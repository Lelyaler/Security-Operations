import { useState } from 'react';
import { ShieldAlert, ShieldCheck, ShieldOff, X, Copy, CheckCheck } from 'lucide-react';
import type { IncidentLog, IncidentStatus, RiskLevel } from '../../types/analytics';

interface IncidentInspectorProps {
  incident: IncidentLog;
  onClose: () => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
  onQuarantine: (incident: IncidentLog) => void;
  getRiskColor: (risk: RiskLevel) => string;
}

export default function IncidentInspector({
  incident,
  onClose,
  onUpdateStatus,
  onQuarantine,
  getRiskColor
}: IncidentInspectorProps) {
  const [inspectorTab, setInspectorTab] = useState<'overview' | 'raw'>('overview');
  const [copiedRaw, setCopiedRaw] = useState(false);

  const handleCopyRaw = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div className="threat-inspector-sidebar card animate-slide-left">
      <div className="inspector-header">
        <div className="inspector-title">
          <ShieldAlert size={18} className="text-danger" />
          <h3>Incident Investigation</h3>
        </div>
        <button
          className="btn-icon-close"
          onClick={onClose}
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
          Overview
        </button>
        <button
          type="button"
          className={`inspector-tab-btn ${inspectorTab === 'raw' ? 'active' : ''}`}
          onClick={() => setInspectorTab('raw')}
        >
          Raw Telemetry
        </button>
      </div>

      <div className="inspector-body">
        {inspectorTab === 'overview' ? (
          <>
            <div className="inspector-meta-box">
              <div className="meta-field">
                <span className="field-lbl">Tracking ID</span>
                <span className="field-val font-mono">{incident.id}</span>
              </div>
              <div className="meta-field">
                <span className="field-lbl">Client IP</span>
                <span className="field-val font-mono">{incident.sourceIp}</span>
              </div>
              <div className="meta-field">
                <span className="field-lbl">Target Service</span>
                <span className="field-val font-mono">{incident.targetService}</span>
              </div>
              {incident.endpoint && (
                <div className="meta-field">
                  <span className="field-lbl">Endpoint</span>
                  <span className="field-val font-mono">{incident.endpoint}</span>
                </div>
              )}
              {incident.httpStatus && (
                <div className="meta-field">
                  <span className="field-lbl">HTTP Status</span>
                  <span className="field-val font-mono font-bold text-danger">{incident.httpStatus}</span>
                </div>
              )}
              <div className="meta-field">
                <span className="field-lbl">Severity</span>
                <span className={`badge ${getRiskColor(incident.risk)}`}>
                  {incident.risk.toUpperCase()}
                </span>
              </div>
              {incident.latencyMs && (
                <div className="meta-field">
                  <span className="field-lbl">Latency</span>
                  <span className="field-val font-mono">{incident.latencyMs} ms</span>
                </div>
              )}
            </div>

            <div className="threat-details-block">
              <h4>Event Summary</h4>
              <p className="analysis-text">{incident.reason}</p>
              {incident.userAgent && (
                <div className="user-agent-block font-mono">
                  <span className="text-muted">User-Agent: </span>{incident.userAgent}
                </div>
              )}
              <div className="telemetry-chip-row">
                <span className="chip">Gateway Ingress</span>
                <span className="chip">Payload: {incident.payloadSize}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="raw-siem-view">
            <div className="raw-siem-header">
              <span className="font-mono text-muted text-xs">JSON Telemetry Record</span>
              <button
                type="button"
                className="btn btn-xs btn-secondary"
                onClick={() => handleCopyRaw(incident.rawEvent || JSON.stringify(incident, null, 2))}
                title="Copy raw log string"
              >
                {copiedRaw ? <CheckCheck size={12} className="text-success" /> : <Copy size={12} />}
                <span>{copiedRaw ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="raw-code-block font-mono">
              {incident.rawEvent || JSON.stringify(incident, null, 2)}
            </pre>
          </div>
        )}

        <div className="inspector-action-buttons">
          {incident.status !== 'resolved' ? (
            <>
              <button
                onClick={() => onQuarantine(incident)}
                className="btn btn-danger btn-block"
              >
                <ShieldOff size={15} /> Rate Limit Client IP
              </button>
              {incident.status !== 'investigating' && (
                <button
                  onClick={() => onUpdateStatus(incident.id, 'investigating')}
                  className="btn btn-secondary btn-block"
                >
                  Mark Investigating
                </button>
              )}
              <button
                onClick={() => onUpdateStatus(incident.id, 'resolved')}
                className="btn btn-outline btn-block"
              >
                Mark Resolved
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
  );
}
