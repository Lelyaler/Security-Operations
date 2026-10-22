import { useState } from 'react';
import {
  ShieldCheck,
  Key,
  X,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Lock,
  FileCheck
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
  const { operator, rotateSessionKey } = useAuth();
  const [activeTab, setActiveTab] = useState<'clearance' | 'keys'>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [rotateSuccess, setRotateSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRotateKey = async () => {
    if (isRotating) return;
    setIsRotating(true);
    setRotateSuccess(false);

    try {
      await rotateSessionKey();
      setIsRotating(false);
      setRotateSuccess(true);
      setTimeout(() => setRotateSuccess(false), 4000);
    } catch {
      setIsRotating(false);
    }
  };

  const dummyJwt =
    'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6InNlYy1ldTEtMjAyNiJ9.eyJzdWIiOiJhbGV4YW5kZXIuayIsInJvbGVzIjpbInNlY29wcy5sZWFkIiwiaW5jaWRlbnQuY29tbWFuZGVyIl0sImNsZWFyYW5jZSI6IlRJRVItMyIsImlzcyI6ImF1dGguc2VjdXJlbm9kZS5pbnRlcm5hbCIsImV4cCI6MTc5Mjg1OTAwMCwiaWF0IjoxNzkyODIwNDAwfQ';

  const dummySshKey =
    'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG5YqZ89mXv10Qk27PLM44xL901eX17k2B14R89qZ21A ops@sec-ops-eu1';

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
              <h2 className="modal-title">Operator Identity & Security Keys</h2>
              <p className="modal-subtitle">
                Cryptographic authentication claims, clearance level, and ephemeral session certificates
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
            <span>Security Clearance (Tier 3)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'keys'}
            className={`credentials-tab-btn ${activeTab === 'keys' ? 'active' : ''}`}
            onClick={() => setActiveTab('keys')}
          >
            <Key size={14} />
            <span>Session Keys & Certificates</span>
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
                  <span>Mandatory Access Control Level</span>
                </div>
                <div className="cred-card-val font-mono">{operator.clearanceLevel}</div>
                <span className="cred-card-sub">Granted by Central Security Council</span>
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
                  <FileCheck size={13} className="text-secondary" />
                  <span>Cryptographic Authorization Token (ES512 JWT)</span>
                </div>
                <button
                  type="button"
                  className="copy-token-btn"
                  onClick={() => handleCopy(dummyJwt, 'jwt')}
                >
                  {copiedKey === 'jwt' ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                  <span>{copiedKey === 'jwt' ? 'Copied Token' : 'Copy Payload'}</span>
                </button>
              </div>
              <div className="token-claims-code font-mono" title={dummyJwt}>
                {dummyJwt}
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
            {rotateSuccess && (
              <div className="key-rotate-toast animate-slide-in">
                <Check size={15} className="text-success" />
                <span>New ephemeral session key generated & committed to cluster key-store.</span>
              </div>
            )}

            <div className="cert-info-card">
              <div className="cert-info-top">
                <div className="cert-title-col">
                  <span className="cert-badge">Active Mutual TLS Client</span>
                  <h3 className="cert-cn font-mono">{operator.activeCrtCn}</h3>
                  <span className="cert-ca font-mono text-muted">Issuer: SecureNode Internal Root CA EU-1</span>
                </div>
                <button
                  type="button"
                  className={`btn btn-secondary btn-sm ${isRotating ? 'loading' : ''}`}
                  onClick={handleRotateKey}
                  disabled={isRotating}
                >
                  <RefreshCw size={13} className={isRotating ? 'animate-spin' : ''} />
                  <span>{isRotating ? 'Re-handshaking...' : 'Rotate Session Key'}</span>
                </button>
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

              <div className="key-box">
                <div className="key-box-hdr">
                  <span className="key-box-title">Workstation Ed25519 Public Key:</span>
                  <button
                    type="button"
                    className="key-copy-btn"
                    onClick={() => handleCopy(dummySshKey, 'ssh')}
                  >
                    {copiedKey === 'ssh' ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                    <span>{copiedKey === 'ssh' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <code className="key-code font-mono">{dummySshKey}</code>
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
