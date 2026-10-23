import { useState } from 'react';
import {
  ShieldCheck,
  Key,
  X,
  Copy,
  Check,
  Cpu,
  Lock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/useAuth';

interface OperatorCredentialsModalProps {
  isOpen: boolean;
  initialTab?: 'clearance' | 'keys';
  onClose: () => void;
}

export default function OperatorCredentialsModal({
  isOpen,
  initialTab = 'clearance',
  onClose
}: OperatorCredentialsModalProps) {
  const { operator } = useAuth();
  const [activeTab, setActiveTab] = useState<'clearance' | 'keys'>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog credentials-dialog card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              {activeTab === 'clearance' ? <ShieldCheck size={20} /> : <Key size={20} />}
            </div>
            <div>
              <h2 className="modal-title">Operator Profile & Security Context</h2>
              <p className="modal-subtitle">
                Identity claims, RBAC permissions matrix, and active mutual TLS session credentials
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close credentials dialog">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="credentials-tabs-nav" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'clearance'}
            className={`credentials-tab-btn ${activeTab === 'clearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('clearance')}
          >
            <ShieldCheck size={14} />
            <span>Identity & RBAC Privileges</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'keys'}
            className={`credentials-tab-btn ${activeTab === 'keys' ? 'active' : ''}`}
            onClick={() => setActiveTab('keys')}
          >
            <Key size={14} />
            <span>Mutual TLS & Connection</span>
          </button>
        </div>

        {/* Tab 1: Security Clearance */}
        {activeTab === 'clearance' && (
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
                  <span>Operator ID: {operator.callsign}</span>
                  <span>·</span>
                  <span>Zone: {operator.clusterRegion}</span>
                </div>
              </div>
            </div>

            <div className="credentials-detail-grid">
              <div className="cred-card">
                <div className="cred-card-hdr">
                  <Lock size={13} className="text-primary" />
                  <span>Access Control Policy</span>
                </div>
                <div className="cred-card-val font-mono">{operator.clearanceLevel}</div>
                <span className="cred-card-sub">Granted via Enterprise IAM / IdP Federation Policy</span>
              </div>

              <div className="cred-card">
                <div className="cred-card-hdr">
                  <Cpu size={13} className="text-success" />
                  <span>Hardware Security Module</span>
                </div>
                <div className="cred-card-val font-mono">{operator.hsmToken}</div>
                <span className="cred-card-sub">Hardware cryptographic attestation active</span>
              </div>
            </div>

            <div className="token-claims-section">
              <div className="token-claims-header">
                <div className="token-claims-title">
                  <UserCheck size={13} className="text-secondary" />
                  <span>Authentication & Session Details</span>
                </div>
              </div>
              <div className="token-claims-code font-mono">
                <div>Email: {operator.email}</div>
                <div>Identity Provider: Enterprise SAML 2.0 / FIDO2 (Okta)</div>
                <div>Session Established: {operator.sessionStarted}</div>
                <div>Idle Policy: Enforced auto-lock after 15m inactivity</div>
              </div>
            </div>

            <div className="rbac-matrix-section">
              <span className="rbac-matrix-heading">Assigned RBAC Privileges:</span>
              <div className="rbac-pills-list font-mono">
                <span className="rbac-tag granted">telemetry.kernel.ebpf.read</span>
                <span className="rbac-tag granted">firewall.edge.nullroute.write</span>
                <span className="rbac-tag granted">cluster.node.drain.exec</span>
                <span className="rbac-tag granted">audit.compliance.tamper_proof.read</span>
                <span className="rbac-tag granted">session.ephemeral.rotate</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Session Keys & Certificates */}
        {activeTab === 'keys' && (
          <div className="credentials-tab-content animate-fade-in">
            <div className="cert-info-card">
              <div className="cert-info-top">
                <div className="cert-title-col">
                  <span className="cert-badge">Active Mutual TLS Client</span>
                  <h3 className="cert-cn font-mono">{operator.activeCrtCn}</h3>
                  <span className="cert-ca font-mono text-muted">Issuer: SecureNode Internal Root CA EU-1</span>
                </div>
              </div>

              <div className="cert-meta-grid">
                <div className="cert-meta-item">
                  <span className="meta-lbl">Cipher Suite</span>
                  <span className="meta-val font-mono">ECDHE-ECDSA-AES256-GCM-SHA384</span>
                </div>
                <div className="cert-meta-item">
                  <span className="meta-lbl">Last Rotated</span>
                  <span className="meta-val font-mono">{operator.keyRotatedAt}</span>
                </div>
                <div className="cert-meta-item">
                  <span className="meta-lbl">Validity Remaining</span>
                  <span className="meta-val font-mono text-success">7h 14m (Auto-renewing)</span>
                </div>
              </div>
            </div>

            <div className="keys-box-stack">
              <div className="key-box">
                <div className="key-box-hdr">
                  <span className="key-box-title">mTLS SHA-256 Fingerprint:</span>
                  <button
                    type="button"
                    className="key-copy-btn"
                    onClick={() => handleCopy(operator.sessionFingerprint, 'fp')}
                  >
                    {copiedKey === 'fp' ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                    <span>{copiedKey === 'fp' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <code className="key-code font-mono">{operator.sessionFingerprint}</code>
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
