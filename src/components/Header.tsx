import { Users, Server, Bell, UserCheck, AlertTriangle, Menu, Sliders } from 'lucide-react';

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
          <h1 className="header-title">{getTitle()}</h1>
          <p className="header-subtitle">Real-time network security console</p>
        </div>
      </div>

      <div className="header-widgets">
        <button
          onClick={onOpenDiagnostics}
          className="header-diagnostics-btn"
          title="Open SOC Telemetry & Diagnostics Console"
        >
          <Sliders size={14} />
          <span>Diagnostics</span>
        </button>

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
              {isDdosActive ? 'Anomaly Detected' : 'EU-WEST-1'}
            </span>
            <span className="widget-label">
              {isDdosActive ? 'High Latency' : 'Primary Node'}
            </span>
          </div>
        </div>

        <div className="notification-bell" title="System alerts">
          <Bell size={16} className={isDdosActive ? 'text-danger' : 'text-muted'} />
          <span className={`bell-badge ${isDdosActive ? 'bell-badge-danger' : ''}`}></span>
        </div>

        <div className="admin-profile">
          <div className="profile-avatar">
            <UserCheck size={16} className="text-muted" />
          </div>
          <div className="profile-info">
            <span className="profile-name">Alexander K.</span>
            <span className="profile-role">Security Analyst</span>
          </div>
        </div>
      </div>
    </header>
  );
}
