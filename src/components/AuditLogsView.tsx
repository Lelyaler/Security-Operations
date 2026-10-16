import { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, Clock, AlertTriangle, FileSpreadsheet, Terminal } from 'lucide-react';
import { socApi } from '../services/socApi';
import { mockAuditLogs } from '../utils/mockData';
import { exportLogsToCsv, filterAuditLogs } from '../utils/securityHelpers';
import type { AuditLog, AuditLogStatus } from '../types/security';

export default function AuditLogsView() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<AuditLogStatus | 'all'>('all');
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    socApi.getAuditLogs()
      .then((data) => {
        if (mounted) {
          setLogs(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setLogs(mockAuditLogs);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredLogs = filterAuditLogs(logs, typeFilter, statusFilter, searchTerm);

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const csvContent = exportLogsToCsv(filteredLogs);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `soc_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setIsExporting(false);
            setExportComplete(true);
          }, 200);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  const getStatusIcon = (status: AuditLogStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={14} className="text-success" />;
      case 'pending':
        return <Clock size={14} className="text-warning" />;
      case 'failed':
        return <AlertTriangle size={14} className="text-danger" />;
      default:
        return null;
    }
  };

  return (
    <div className="audit-logs-view animate-fade-in">
      <div className="audit-controls card">
        <div className="search-bar">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search by Principal User, Client IP, or Details..."
            aria-label="Search by Principal User or Details"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="select-wrapper">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by event type"
            >
              <option value="all">All Event Types</option>
              <option value="File Write">File Write</option>
              <option value="SSH Access">SSH Access</option>
              <option value="API Call">API Call</option>
            </select>
          </div>

          <div className="select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AuditLogStatus | 'all')}
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="btn btn-primary"
          >
            <Download size={15} />
            {isExporting ? `Exporting (${exportProgress}%)` : 'Export CSV'}
          </button>
        </div>
      </div>

      {isExporting && (
        <div className="export-progress-container card animate-slide-in">
          <div className="progress-bar-label">
            <FileSpreadsheet size={16} className="text-primary" />
            <span>Compiling access audit CSV stream...</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${exportProgress}%` }}></div>
          </div>
        </div>
      )}

      {exportComplete && (
        <div className="export-complete-alert card animate-slide-in">
          <CheckCircle size={16} className="text-success" />
          <span>Audit report generated and saved to local disk.</span>
          <button className="dismiss-alert-btn" onClick={() => setExportComplete(false)}>Dismiss</button>
        </div>
      )}

      <div className="audit-table-container card">
        <div className="table-heading-row">
          <div>
            <h2 className="card-heading">Security Access & Audit Log</h2>
            <p className="card-subheading">Privileged access sessions, storage mutations, and API transactions</p>
          </div>
          <span className="record-count font-mono text-muted">{filteredLogs.length} events logged</span>
        </div>

        <div className="table-responsive">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Principal / Subject</th>
                <th>Client IP</th>
                <th>Protocol</th>
                <th>Timestamp</th>
                <th>Event Type</th>
                <th>Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="empty-table-state font-mono">
                    Loading security audit telemetry...
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono text-muted">{log.id}</td>
                    <td>
                      <div className="principal-cell">
                        <Terminal size={14} className="text-muted" />
                        <span className="font-mono font-medium">{log.principal}</span>
                      </div>
                    </td>
                    <td className="font-mono text-muted">{log.clientIp || '10.0.x.x'}</td>
                    <td>
                      <span className="protocol-badge font-mono">{log.method}</span>
                    </td>
                    <td className="text-muted font-mono">{log.timestamp}</td>
                    <td>
                      <span className="event-type-tag">{log.type}</span>
                    </td>
                    <td className="audit-details-cell text-muted" title={log.details || ''}>
                      {log.details || `${log.payloadSize.toLocaleString()} B transfer`}
                    </td>
                    <td>
                      <span className={`status-pill status-${log.status}`}>
                        {getStatusIcon(log.status)}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty-table-state">
                    No access log events found matching the active criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
