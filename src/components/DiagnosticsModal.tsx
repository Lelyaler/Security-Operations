import { Sliders, Zap, AlertTriangle, ShieldAlert, Play, Pause, X, RotateCcw } from 'lucide-react';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDdosActive: boolean;
  setIsDdosActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  isFeedFrozen: boolean;
  setIsFeedFrozen: (frozen: boolean | ((prev: boolean) => boolean)) => void;
  onTriggerBreach: () => void;
  onInjectIncident: () => void;
  onResetDefaults: () => void;
}

export default function DiagnosticsModal({
  isOpen,
  onClose,
  isDdosActive,
  setIsDdosActive,
  isFeedFrozen,
  setIsFeedFrozen,
  onTriggerBreach,
  onInjectIncident,
  onResetDefaults
}: DiagnosticsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-dialog diagnostics-dialog card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Sliders size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="modal-title">SOC Diagnostics & Telemetry Ingest</h2>
              <p className="modal-subtitle">Operational controls for ingress load anomalies, synthetic event injection, and socket feed controls.</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close diagnostics dialog">
            <X size={18} />
          </button>
        </div>

        <div className="diagnostics-body">
          <div className="diag-action-grid">
            <div className="diag-card">
              <div className="diag-info">
                <h3>Ingress DDoS Congestion</h3>
                <p>Simulates edge traffic saturation, elevates perimeter packet counters, and triggers cluster warning alerts.</p>
              </div>
              <button
                onClick={() => setIsDdosActive((prev) => !prev)}
                className={`btn btn-sm ${isDdosActive ? 'btn-danger' : 'btn-secondary'}`}
              >
                <AlertTriangle size={14} />
                {isDdosActive ? 'Deactivate Congestion' : 'Engage Ingress Spike'}
              </button>
            </div>

            <div className="diag-card">
              <div className="diag-info">
                <h3>Synthetic CVE Intrusion</h3>
                <p>Generates an intercepted exploit attempt with complete Common Event Format (CEF) metadata and live stream alert.</p>
              </div>
              <button
                onClick={() => {
                  onTriggerBreach();
                  onClose();
                }}
                className="btn btn-sm btn-primary"
              >
                <Zap size={14} />
                Ingest Exploit Event
              </button>
            </div>

            <div className="diag-card">
              <div className="diag-info">
                <h3>IDS Threat Ingestion</h3>
                <p>Appends an unhandled high-severity intrusion alert with MITRE ATT&CK mapping to the active triage queue.</p>
              </div>
              <button
                onClick={() => {
                  onInjectIncident();
                  onClose();
                }}
                className="btn btn-sm btn-secondary"
              >
                <ShieldAlert size={14} />
                Inject Triage Alert
              </button>
            </div>

            <div className="diag-card">
              <div className="diag-info">
                <h3>Socket Telemetry Stream</h3>
                <p>Temporarily pause or resume real-time socket ingestion for detailed packet payload inspection.</p>
              </div>
              <button
                onClick={() => setIsFeedFrozen((prev) => !prev)}
                className="btn btn-sm btn-secondary"
              >
                {isFeedFrozen ? <Play size={14} /> : <Pause size={14} />}
                {isFeedFrozen ? 'Resume Socket Stream' : 'Freeze Ingest Stream'}
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={() => {
              if (window.confirm('Reset all triage records, threat states, and local storage to factory defaults?')) {
                onResetDefaults();
                onClose();
              }
            }}
            className="btn btn-sm btn-subtle text-muted"
            title="Clear saved local storage records"
          >
            <RotateCcw size={14} /> Reset Telemetry Store
          </button>
          <button onClick={onClose} className="btn btn-sm btn-secondary">
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
}
