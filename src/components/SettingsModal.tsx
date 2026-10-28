import { useState, useEffect } from 'react';
import { ShieldCheck, Sliders, X, Download, RotateCcw, Check, Clock, UserCheck } from 'lucide-react';
import { useSettings } from '../context/useSettings';
import { loadPersistedIncidents, clearPersistedData } from '../utils/analyticsHelpers';
import { mockIncidentLogs } from '../utils/mockData';

interface SettingsModalProps {
  onClose: () => void;
}

type Tab = 'profile' | 'preferences';

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { operator, preferences, updatePreferences } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>('preferences');
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleExportJson = () => {
    const data = loadPersistedIncidents(mockIncidentLogs);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soc-incidents-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus('json');
    setTimeout(() => setExportStatus(null), 2500);
  };

  const handleExportCsv = () => {
    const data = loadPersistedIncidents(mockIncidentLogs);
    const headers = ['id', 'timestamp', 'risk', 'status', 'sourceIp', 'targetService', 'reason', 'httpStatus', 'endpoint'];
    const rows = data.map((inc) =>
      headers.map((key) => JSON.stringify((inc as unknown as Record<string, unknown>)[key] ?? '')).join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soc-incidents-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus('csv');
    setTimeout(() => setExportStatus(null), 2500);
  };

  const handleResetStorage = () => {
    clearPersistedData();
    window.location.reload();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog credentials-dialog card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              {activeTab === 'profile' ? <UserCheck size={20} /> : <Sliders size={20} />}
            </div>
            <div>
              <h2 className="modal-title">Settings &amp; Preferences</h2>
              <p className="modal-subtitle">Operator workspace preferences, data exports, and audit cache</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="credentials-tabs-nav" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'preferences'}
            className={`credentials-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <Sliders size={14} />
            <span>Preferences &amp; Export</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'profile'}
            className={`credentials-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <ShieldCheck size={14} />
            <span>Profile &amp; Permissions</span>
          </button>
        </div>

        {activeTab === 'preferences' && (
          <div className="credentials-tab-content animate-fade-in">
            <div className="cert-info-card">
              <div className="cert-info-top">
                <div className="cert-title-col">
                  <span className="cert-badge">Display &amp; Stream</span>
                  <h3 className="cert-cn font-mono">Console Configuration</h3>
                </div>
              </div>

              <div className="cert-meta-grid">
                <div className="cert-meta-item">
                  <span className="meta-lbl">Clock display</span>
                  <div style={{ marginTop: '4px' }}>
                    <select
                      aria-label="Clock display"
                      className="time-range-select font-mono"
                      value={preferences.clock}
                      onChange={(e) => updatePreferences({ clock: e.target.value as 'utc' | 'local' })}
                    >
                      <option value="local">Local Time</option>
                      <option value="utc">UTC Time</option>
                    </select>
                  </div>
                </div>

                <div className="cert-meta-item">
                  <span className="meta-lbl">Telemetry interval</span>
                  <div style={{ marginTop: '4px' }}>
                    <select
                      aria-label="Telemetry refresh interval"
                      className="time-range-select font-mono"
                      value={preferences.refreshSeconds}
                      onChange={(e) => updatePreferences({ refreshSeconds: Number(e.target.value) as 1 | 3 | 5 })}
                    >
                      <option value={1}>1 second</option>
                      <option value={3}>3 seconds (Default)</option>
                      <option value={5}>5 seconds</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="keys-box-stack">
              <div className="key-box">
                <div className="key-box-hdr">
                  <span className="key-box-title">Incident Audit Logs:</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="key-copy-btn" onClick={handleExportJson}>
                      {exportStatus === 'json' ? <Check size={12} className="text-success" /> : <Download size={12} />}
                      <span>{exportStatus === 'json' ? 'Downloaded' : 'Export JSON'}</span>
                    </button>
                    <button type="button" className="key-copy-btn" onClick={handleExportCsv}>
                      {exportStatus === 'csv' ? <Check size={12} className="text-success" /> : <Download size={12} />}
                      <span>{exportStatus === 'csv' ? 'Downloaded' : 'Export CSV'}</span>
                    </button>
                  </div>
                </div>
                <code className="key-code font-mono">Export current incident log records to local disk for offline analysis.</code>
              </div>

              <div className="key-box">
                <div className="key-box-hdr">
                  <span className="key-box-title">Local Storage Cache:</span>
                  <button type="button" className="key-copy-btn" onClick={handleResetStorage}>
                    <RotateCcw size={12} />
                    <span>Reset Storage</span>
                  </button>
                </div>
                <code className="key-code font-mono">Clears local overrides and restores initial sample incident dataset.</code>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="credentials-tab-content animate-fade-in">
            <div className="operator-profile-banner">
              <div className="operator-avatar-ring">
                <span className="operator-initials">{operator.initials}</span>
              </div>
              <div className="operator-profile-meta">
                <div className="operator-name-row">
                  <span className="operator-full-name">{operator.name}</span>
                  <span className="clearance-pill">{operator.role}</span>
                </div>
                <div className="operator-sub-row font-mono">
                  <span>{operator.email}</span>
                  <span className="dot-sep">•</span>
                  <span>Cluster: eu-central-1</span>
                </div>
              </div>
            </div>

            <div className="rbac-matrix-section">
              <span className="rbac-matrix-heading">Operational Capabilities:</span>
              <div className="rbac-pills-list font-mono">
                <span className="rbac-tag granted">telemetry:read</span>
                <span className="rbac-tag granted">incidents:mitigate</span>
                <span className="rbac-tag granted">firewall:rate-limit</span>
                <span className="rbac-tag granted">telemetry:export</span>
                <span className="rbac-tag granted">session:refresh</span>
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <div className="modal-footer-meta font-mono text-muted" style={{ fontSize: '0.75rem' }}>
            <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
            Active session
          </div>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
