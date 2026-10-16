import { Users, Server, Bell, UserCheck, AlertTriangle, Menu, Sliders, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  isDdosActive: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenDiagnostics: () => void;
}

export default function Header({
  activeTab,
  isDdosActive,
  setIsMobileOpen,
  onOpenDiagnostics
}: HeaderProps) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Security Operations Center (SOC)';
      case 'infrastructure':
        return 'Server Infrastructure Matrix';
      case 'threats':
        return 'Threat Intelligence & IDS';
      case 'logs':
        return 'System Access Audit Logs';
      default:
        return 'Security Operations Center (SOC)';
    }
  };

  return (
    <header className="header">
      <div className="header-left-group">
        <button 
          onClick={() => setIsMobileOpen(true)} 
          className="mobile-menu-trigger-btn"
          title="Open Menu"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>
        <div className="header-title-section">
          <div className="header-title-row">
            <h1 className="header-title">{getTitle()}</h1>
            <div className={`env-pill ${isDdosActive ? 'env-pill-warning' : ''}`} title="Current Environment Cluster">
              <span className="env-dot"></span>
              <span className="env-name">{isDdosActive ? 'CONGESTION · EU-1' : 'PROD · SEC-EU-1'}</span>
            </div>
          </div>
          <p className="header-subtitle">Real-time network security console & eBPF inspection</p>
        </div>
      </div>

      <div className="header-widgets">
        <div className="widget-item">
          <Users size={15} className={isDdosActive ? 'text-danger' : 'text-muted'} />
          <div className="widget-content">
            <span className="widget-value">{isDdosActive ? '184' : '3,284'}</span>
            <span className="widget-label">Active Sockets</span>
          </div>
        </div>

        <div className={`widget-item ${isDdosActive ? 'widget-item-danger' : ''}`}>
          {isDdosActive ? (
            <AlertTriangle size={15} className="text-danger" />
          ) : (
            <Server size={15} className="text-muted" />
          )}
          <div className="widget-content">
            <span className={`widget-value ${isDdosActive ? 'text-danger' : ''}`}>
              {isDdosActive ? 'Spike Anomaly' : 'EU-WEST-1'}
            </span>
            <span className="widget-label">
              {isDdosActive ? 'Elevated Drop' : 'Primary Node'}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenDiagnostics}
          className={`header-harness-btn ${isDdosActive ? 'active' : ''}`}
          title="Telemetry Simulation & Fault Injection Harness"
          aria-label="Simulation Harness"
        >
          <Sliders size={13} />
          <span>Simulation Harness</span>
        </button>

        <div className="notification-bell" title="System security notifications">
          <Bell size={16} className={isDdosActive ? 'text-danger' : 'text-muted'} />
          <span className={`bell-badge ${isDdosActive ? 'bell-badge-danger' : ''}`}></span>
        </div>

        <div className="admin-profile">
          <div className="profile-avatar">
            <UserCheck size={16} className="text-muted" />
          </div>
          <div className="profile-info">
            <span className="profile-name">Alexander K.</span>
            <span className="profile-role">
              <ShieldCheck size={11} className="role-icon" /> Tier 3 Analyst
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
