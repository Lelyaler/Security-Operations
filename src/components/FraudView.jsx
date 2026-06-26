import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, UserX, AlertOctagon, X, Terminal, Globe, Calendar } from 'lucide-react';
import { mockFraudAlerts } from '../utils/mockData';

export default function FraudView({ alerts, setAlerts }) {
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleAction = (id, newStatus) => {
    setAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, status: newStatus } : alert));
    if (selectedAlert && selectedAlert.id === id) {
      setSelectedAlert(prev => ({ ...prev, status: newStatus }));
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      default: return 'badge-success';
    }
  };

  return (
    <div className="fraud-view animate-fade-in">
      <div className="fraud-summary-grid">
        <div className="glass-card summary-card danger">
          <AlertOctagon size={24} className="text-danger" />
          <div className="summary-info">
            <span className="summary-val">{alerts.filter(a => a.risk === 'high' && a.status !== 'resolved').length}</span>
            <span className="summary-label">High-Risk Cases</span>
          </div>
        </div>

        <div className="glass-card summary-card warning">
          <ShieldAlert size={24} className="text-warning" />
          <div className="summary-info">
            <span className="summary-val">{alerts.filter(a => a.status === 'investigating').length}</span>
            <span className="summary-label">Under Investigation</span>
          </div>
        </div>

        <div className="glass-card summary-card success">
          <ShieldCheck size={24} className="text-success" />
          <div className="summary-info">
            <span className="summary-val">{alerts.filter(a => a.status === 'resolved').length}</span>
            <span className="summary-label">Cases Resolved Today</span>
          </div>
        </div>
      </div>

      <div className="alerts-table-container glass-card">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Source IP</th>
              <th>Target Node</th>
              <th>Risk Level</th>
              <th>Flag Reason</th>
              <th>Payload Volume</th>
              <th>Age</th>
              <th>Status</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="alert-row">
                <td><strong className="text-muted">{alert.id}</strong></td>
                <td><span className="player-name-bold">{alert.player}</span></td>
                <td>
                  <div className="country-cell">
                    <Globe size={14} className="text-muted" />
                    <span>{alert.country}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${getRiskColor(alert.risk)}`}>
                    {alert.risk}
                  </span>
                </td>
                <td><span className="alert-reason">{alert.reason}</span></td>
                <td><strong className="text-danger">{alert.amount}</strong></td>
                <td>{alert.time}</td>
                <td>
                  <span className={`status-tag ${alert.status}`}>
                    {alert.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-cell">
                    {alert.status !== 'resolved' && (
                      <>
                        <button 
                          onClick={() => {
                            handleAction(alert.id, 'investigating');
                            setSelectedAlert(alert);
                          }}
                          className="btn btn-secondary btn-table-action text-warning"
                          title="Investigate Details"
                        >
                          Investigate
                        </button>
                        <button 
                          onClick={() => handleAction(alert.id, 'resolved')}
                          className="btn btn-secondary btn-table-action text-success"
                          title="Approve / Dismiss Flag"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                    {alert.status === 'resolved' && (
                      <span className="text-success-muted font-sm">Closed File</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Investigation Details Modal */}
      {selectedAlert && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-zoom-in">
            <div className="modal-header">
              <div className="modal-title-group">
                <ShieldAlert className="text-danger" size={22} />
                <h3>Investigation File: {selectedAlert.id}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedAlert(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="player-meta-box">
                <div className="meta-item">
                  <span className="label">Intrusion Source:</span>
                  <span className="val">{selectedAlert.player} ({selectedAlert.country})</span>
                </div>
                <div className="meta-item">
                  <span className="label">Payload Volume:</span>
                  <span className="val text-danger">{selectedAlert.amount}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Risk Level:</span>
                  <span className={`badge ${getRiskColor(selectedAlert.risk)}`}>{selectedAlert.risk}</span>
                </div>
              </div>

              <div className="suspect-logs">
                <div className="logs-header">
                  <Terminal size={14} className="text-primary" />
                  <span>Audit Logs & Trigger Signatures</span>
                </div>
                <div className="logs-body">
                  <div className="log-line">
                    <span className="time">[13:41:05]</span> <span className="msg">Login initiated from unauthorized proxy server.</span>
                  </div>
                  <div className="log-line text-warning">
                    <span className="time">[13:42:19]</span> <span className="msg">Anomaly: Request density increased by 1500% over baseline.</span>
                  </div>
                  <div className="log-line">
                    <span className="time">[13:43:01]</span> <span className="msg">Triggered pattern match: <em>{selectedAlert.reason}</em>.</span>
                  </div>
                  <div className="log-line text-danger">
                    <span className="time">[13:44:00]</span> <span className="msg">Data transfer threshold exceeded. Automated rate-limiting active.</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <div className="left-actions">
                  <button 
                    onClick={() => {
                      handleAction(selectedAlert.id, 'resolved');
                      setSelectedAlert(null);
                    }}
                    className="btn btn-primary"
                  >
                    <ShieldCheck size={16} /> Resolve & Close Ticket
                  </button>
                </div>
                <div className="right-actions">
                  <button 
                    onClick={() => {
                      // Simulating lock account
                      alert(`Session for IP ${selectedAlert.player} has been revoked and quarantined.`);
                      handleAction(selectedAlert.id, 'resolved');
                      setSelectedAlert(null);
                    }}
                    className="btn btn-secondary text-danger"
                  >
                    <UserX size={16} /> Quarantine IP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
