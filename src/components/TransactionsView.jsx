import React, { useState } from 'react';
import { Search, Download, CheckCircle, Clock, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { mockTransactions } from '../utils/mockData';

export default function TransactionsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesSearch = tx.player.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            setExportComplete(true);
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={14} className="text-success" />;
      case 'pending':
        return <Clock size={14} className="text-warning animate-spin-slow" />;
      case 'failed':
        return <AlertTriangle size={14} className="text-danger" />;
      default:
        return null;
    }
  };

  return (
    <div className="transactions-view animate-fade-in">
      <div className="ledger-controls glass-card">
        <div className="search-bar">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            placeholder="Search by User or Log ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="select-wrapper">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All">All Types</option>
              <option value="File Write">File Write</option>
              <option value="SSH Access">SSH Access</option>
              <option value="API Call">API Call</option>
            </select>
          </div>

          <div className="select-wrapper">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
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
            <Download size={16} />
            {isExporting ? `Exporting (${exportProgress}%)` : 'Export Log Ledger'}
          </button>
        </div>
      </div>

      {isExporting && (
        <div className="export-progress-container glass-card animate-slide-in">
          <div className="progress-bar-label">
            <FileSpreadsheet size={16} className="text-primary" />
            <span>Compiling access audit logs into CSV format...</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${exportProgress}%` }}></div>
          </div>
        </div>
      )}

      {exportComplete && (
        <div className="export-complete-alert glass-card animate-slide-in">
          <CheckCircle size={16} className="text-success" />
          <span>Success! <strong>access_audit_log_{new Date().toISOString().slice(0,10)}.csv</strong> downloaded to virtual disk.</span>
          <button className="dismiss-alert-btn" onClick={() => setExportComplete(false)}>Dismiss</button>
        </div>
      )}

      <div className="ledger-table-container glass-card">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>User Principal</th>
              <th>Protocol</th>
              <th>Timestamp</th>
              <th>Action Type</th>
              <th>Payload Size</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="ledger-row">
                  <td><strong className="text-muted">{tx.id}</strong></td>
                  <td><span className="player-name">{tx.player}</span></td>
                  <td><span className="method-tag">{tx.method}</span></td>
                  <td className="text-muted">{tx.time}</td>
                  <td>
                    <span className={`type-tag ${tx.type.toLowerCase().replace(' ', '-')}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td>
                    <strong className="text-primary">
                      {tx.amount.toLocaleString()} B
                    </strong>
                  </td>
                  <td>
                    <div className="status-cell">
                      {getStatusIcon(tx.status)}
                      <span className={`status-text ${tx.status}`}>{tx.status}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">No audit logs match your search filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
