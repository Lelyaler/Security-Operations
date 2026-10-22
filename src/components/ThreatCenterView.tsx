import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  X,
  Terminal,
  Globe,
  Check,
  ShieldOff,
  Search,
  Copy,
  CheckCheck,
  FileCode,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { filterIncidents } from '../utils/securityHelpers';
import { socApi } from '../services/socApi';
import { mockAuditLogs } from '../utils/mockData';
import { useAuth } from '../context/useAuth';
import { useDragScroll } from '../hooks/useDragScroll';
import type { SecurityIncident, RiskLevel, IncidentStatus, AuditLog } from '../types/security';

interface ThreatCenterViewProps {
  incidents: SecurityIncident[];
  setIncidents: Dispatch<SetStateAction<SecurityIncident[]>>;
  params?: Record<string, string>;
  onUpdateParams?: (newParams: Record<string, string | null>) => void;
}

export default function ThreatCenterView({
  incidents,
  setIncidents,
  params,
  onUpdateParams
}: ThreatCenterViewProps) {
  const { operator } = useAuth();
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(() => {
    if (params?.id) {
      return incidents.find((i) => i.id === params.id) || null;
    }
    return null;
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>(
    (params?.risk as RiskLevel) || 'all'
  );
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>(
    (params?.status as IncidentStatus) || 'all'
  );
  const [searchTerm, setSearchTerm] = useState(params?.q || '');
  const [inspectorTab, setInspectorTab] = useState<'overview' | 'raw'>('overview');
  const [copiedRaw, setCopiedRaw] = useState(false);

  const [currentPage, setCurrentPage] = useState(() => (params?.page ? Number(params.page) : 1));
  const [pageSize, setPageSize] = useState(6);

  const { ref: threatTableRef } = useDragScroll<HTMLDivElement>();

  useEffect(() => {
    if (params?.id) {
      setSelectedIncident((current) => {
        if (current?.id === params.id) return current;
        const match = incidents.find((i) => i.id === params.id);
        return match || current;
      });
    }
  }, [params?.id, incidents]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSelectIncident = (inc: SecurityIncident | null) => {
    setSelectedIncident(inc);
    onUpdateParams?.({ id: inc ? inc.id : null });
  };

  const handleAction = (id: string, newStatus: IncidentStatus) => {
    socApi.mitigateIncident(id, newStatus).catch(() => {});
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc))
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleQuarantine = (incident: SecurityIncident) => {
    handleAction(incident.id, 'resolved');
    handleSelectIncident(null);

    const auditEntry: AuditLog = {
      id: `LOG-${Math.floor(4120 + Math.random() * 500)}`,
      principal: operator.name.toLowerCase().replace(/\s+/g, '_'),
      type: 'SSH Access',
      payloadSize: 180,
      method: 'REST',
      timestamp: new Date().toTimeString().slice(0, 8),
      status: 'success',
      clientIp: '192.168.10.45',
      details: `SOAR Playbook executed: Null-route dropped host ${incident.sourceIp} via edge firewall rule`
    };
    mockAuditLogs.unshift(auditEntry);

    showNotification(`SOAR Containment executed: Host IP ${incident.sourceIp} quarantined & logged to Audit Trail.`);
  };

  const handleCopyRaw = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
      case 'high':
        return 'badge-danger';
      case 'medium':
        return 'badge-warning';
      default:
        return 'badge-success';
    }
  };

  const filteredIncidents = filterIncidents(incidents, riskFilter, statusFilter, searchTerm);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, riskFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredIncidents.length);
  const paginatedIncidents = filteredIncidents.slice(startIndex, endIndex);

  return (
    <div className="threat-view animate-fade-in">
      {notification && (
        <div className="threat-notification animate-slide-in">
          <Check size={16} className="text-success" />
          <span>{notification}</span>
          <button className="dismiss-alert-btn" onClick={() => setNotification(null)}>Dismiss</button>
        </div>
      )}

      <div className="threat-summary-grid">
        <div className="card summary-card danger">
          <AlertOctagon size={22} className="text-danger" />
          <div className="summary-info">
            <span className="summary-val font-mono">
              {incidents.filter((a) => (a.risk === 'high' || a.risk === 'critical') && a.status !== 'resolved').length}
            </span>
            <span className="summary-label">High-Risk Incidents</span>
          </div>
        </div>

        <div className="card summary-card warning">
          <ShieldAlert size={22} className="text-warning" />
          <div className="summary-info">
            <span className="summary-val font-mono">
              {incidents.filter((a) => a.status === 'investigating').length}
            </span>
            <span className="summary-label">Under Investigation</span>
          </div>
        </div>

        <div className="card summary-card success">
          <ShieldCheck size={22} className="text-success" />
          <div className="summary-info">
            <span className="summary-val font-mono">
              {incidents.filter((a) => a.status === 'resolved').length}
            </span>
            <span className="summary-label">Mitigated Threats</span>
          </div>
        </div>
      </div>

      <div className={`threat-content-layout ${selectedIncident ? 'has-inspector' : ''}`}>
        <div className="threat-table-card card">
          <div className="threat-table-header">
            <div>
              <h2 className="card-heading">Active Threat Stream (IDS / IPS)</h2>
              <p className="card-subheading">Rule-based intrusion detection events requiring SOC analyst review</p>
            </div>
            
            <div className="threat-filters-row">
              <div className="search-bar threat-search-bar">
                <Search size={14} className="text-muted" />
                <input
                  type="text"
                  placeholder="Filter by IP, CVE, MITRE ID, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Filter incidents by query"
                />
              </div>

              <select 
                value={riskFilter} 
                onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
                className="threat-select"
                aria-label="Filter by Risk"
              >
                <option value="all">All Severities</option>
                <option value="high">High & Critical</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'all')}
                className="threat-select"
                aria-label="Filter by Status"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div ref={threatTableRef} className="threat-table-responsive">
            <table className="threat-table">
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Source IP</th>
                  <th className="threat-col-optional">Target Node</th>
                  <th className="threat-col-optional">MITRE / CVE</th>
                  <th>Severity</th>
                  <th className="threat-col-optional">Detection Reason</th>
                  <th className="threat-col-optional">Payload</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th className="threat-col-optional">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIncidents.length > 0 ? (
                  paginatedIncidents.map((inc) => (
                    <tr 
                      key={inc.id}
                      className={`threat-row ${selectedIncident && selectedIncident.id === inc.id ? 'active' : ''}`}
                      onClick={() => handleSelectIncident(selectedIncident?.id === inc.id ? null : inc)}
                    >
                      <td className="font-mono text-muted">{inc.id}</td>
                      <td className="font-mono font-medium">{inc.sourceIp}</td>
                      <td className="text-muted font-mono threat-col-optional">{inc.targetService}</td>
                      <td className="threat-col-optional">
                        {inc.mitre ? (
                          <span className="mitre-badge font-mono" title={`${inc.mitre.name} (${inc.mitre.tactic})`}>
                            {inc.mitre.id}
                          </span>
                        ) : inc.cve ? (
                          <span className="cve-badge font-mono">{inc.cve}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getRiskColor(inc.risk)}`}>
                          {inc.risk.toUpperCase()}
                        </span>
                      </td>
                      <td className="threat-reason-cell threat-col-optional" title={inc.reason}>{inc.reason}</td>
                      <td className="font-mono text-muted threat-col-optional">{inc.payloadSize}</td>
                      <td className="text-muted">{inc.timestamp}</td>
                      <td>
                        <span className={`status-pill status-${inc.status}`}>
                          {inc.status}
                        </span>
                      </td>
                      <td className="threat-col-optional" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectIncident(selectedIncident?.id === inc.id ? null : inc)}
                          className="btn btn-xs btn-secondary"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="empty-table-state">
                      No security incidents match the active filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Threat Incidents Pagination Bar */}
          {filteredIncidents.length > 0 && (
            <div className="table-pagination-bar">
              <div className="pagination-info font-mono">
                Showing <strong>{startIndex + 1}–{endIndex}</strong> of <strong>{filteredIncidents.length}</strong> incidents
              </div>

              <div className="pagination-actions">
                <div className="pagination-page-size">
                  <span className="page-size-label">Per page:</span>
                  <select
                    aria-label="Incidents per page"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="page-size-select font-mono"
                  >
                    <option value={6}>6</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                <div className="pagination-nav-buttons" role="navigation" aria-label="Incident Pagination">
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={safePage <= 1}
                    title="First Page"
                    aria-label="First Page"
                  >
                    <ChevronsLeft size={15} />
                  </button>
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    title="Previous Page"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  <div className="pagination-page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        className={`pagination-num-btn font-mono ${pageNum === safePage ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    title="Next Page"
                    aria-label="Next Page"
                  >
                    <ChevronRight size={15} />
                  </button>
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safePage >= totalPages}
                    title="Last Page"
                    aria-label="Last Page"
                  >
                    <ChevronsRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedIncident && (
          <div className="threat-inspector-sidebar card animate-slide-left">
            <div className="inspector-header">
              <div className="inspector-title">
                <ShieldAlert size={18} className="text-danger" />
                <h3>Incident Investigation</h3>
              </div>
              <button 
                className="btn-icon-close" 
                onClick={() => handleSelectIncident(null)}
                aria-label="Close Inspector"
              >
                <X size={16} />
              </button>
            </div>

            <div className="inspector-tabs-nav">
              <button
                type="button"
                className={`inspector-tab-btn ${inspectorTab === 'overview' ? 'active' : ''}`}
                onClick={() => setInspectorTab('overview')}
              >
                <Info size={13} /> Overview
              </button>
              <button
                type="button"
                className={`inspector-tab-btn ${inspectorTab === 'raw' ? 'active' : ''}`}
                onClick={() => setInspectorTab('raw')}
              >
                <FileCode size={13} /> Raw SIEM Event
              </button>
            </div>

            <div className="inspector-body">
              {inspectorTab === 'overview' ? (
                <>
                  <div className="inspector-meta-box">
                    <div className="meta-field">
                      <span className="field-lbl">Tracking ID</span>
                      <span className="field-val font-mono">{selectedIncident.id}</span>
                    </div>
                    <div className="meta-field">
                      <span className="field-lbl">Source IP</span>
                      <span className="field-val font-mono">{selectedIncident.sourceIp}</span>
                    </div>
                    <div className="meta-field">
                      <span className="field-lbl">Target Service</span>
                      <span className="field-val font-mono">{selectedIncident.targetService}</span>
                    </div>
                    <div className="meta-field">
                      <span className="field-lbl">Severity</span>
                      <span className={`badge ${getRiskColor(selectedIncident.risk)}`}>
                        {selectedIncident.risk.toUpperCase()}
                      </span>
                    </div>
                    {selectedIncident.cve && (
                      <div className="meta-field">
                        <span className="field-lbl">Vulnerability</span>
                        <span className="field-val font-mono text-danger">{selectedIncident.cve}</span>
                      </div>
                    )}
                    {selectedIncident.destinationPort && (
                      <div className="meta-field">
                        <span className="field-lbl">Destination</span>
                        <span className="field-val font-mono">Port {selectedIncident.destinationPort} ({selectedIncident.protocol || 'TCP'})</span>
                      </div>
                    )}
                  </div>

                  {selectedIncident.mitre && (
                    <div className="mitre-info-box">
                      <span className="mitre-box-title">MITRE ATT&CK Mapping</span>
                      <div className="mitre-box-content font-mono">
                        <span className="mitre-code">{selectedIncident.mitre.id}</span>
                        <span className="mitre-name">{selectedIncident.mitre.name}</span>
                        <span className="mitre-tactic">Tactic: {selectedIncident.mitre.tactic}</span>
                      </div>
                    </div>
                  )}

                  <div className="threat-details-block">
                    <h4>Signature Analysis</h4>
                    <p className="analysis-text">{selectedIncident.reason}</p>
                    {selectedIncident.userAgent && (
                      <div className="user-agent-block font-mono">
                        <span className="text-muted">User-Agent: </span>{selectedIncident.userAgent}
                      </div>
                    )}
                    <div className="telemetry-chip-row">
                      <span className="chip"><Globe size={13} /> External Network</span>
                      <span className="chip"><Terminal size={13} /> Payload: {selectedIncident.payloadSize}</span>
                    </div>
                  </div>

                  {selectedIncident.sha256 && (
                    <div className="sha256-block">
                      <span className="sha-label font-mono">SHA-256 Signature Hash:</span>
                      <code className="sha-code font-mono">{selectedIncident.sha256}</code>
                    </div>
                  )}
                </>
              ) : (
                <div className="raw-siem-view">
                  <div className="raw-siem-header">
                    <span className="font-mono text-muted text-xs">Common Event Format (CEF) Record</span>
                    <button
                      type="button"
                      className="btn btn-xs btn-secondary"
                      onClick={() => handleCopyRaw(selectedIncident.rawEvent || '')}
                      title="Copy raw log string"
                    >
                      {copiedRaw ? <CheckCheck size={12} className="text-success" /> : <Copy size={12} />}
                      <span>{copiedRaw ? 'Copied' : 'Copy CEF'}</span>
                    </button>
                  </div>
                  <pre className="raw-code-block font-mono">
                    {selectedIncident.rawEvent || `CEF:0|SecureNode|Sensor|1.0|${selectedIncident.id}|${selectedIncident.reason}|${selectedIncident.risk}|src=${selectedIncident.sourceIp} dst=${selectedIncident.targetService}`}
                  </pre>
                </div>
              )}

              <div className="inspector-action-buttons">
                {selectedIncident.status !== 'resolved' ? (
                  <>
                    <button 
                      onClick={() => handleQuarantine(selectedIncident)} 
                      className="btn btn-danger btn-block"
                    >
                      <ShieldOff size={15} /> Quarantine & Drop IP
                    </button>
                    {selectedIncident.status !== 'investigating' && (
                      <button 
                        onClick={() => handleAction(selectedIncident.id, 'investigating')} 
                        className="btn btn-secondary btn-block"
                      >
                        Assign to Analyst
                      </button>
                    )}
                    <button 
                      onClick={() => handleAction(selectedIncident.id, 'resolved')} 
                      className="btn btn-outline btn-block"
                    >
                      Mark Mitigated
                    </button>
                  </>
                ) : (
                  <div className="mitigated-box text-success">
                    <ShieldCheck size={18} />
                    <span>Incident successfully mitigated and closed.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
