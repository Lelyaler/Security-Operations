import { useState, useRef, useEffect } from 'react';
import { Users, Server, Bell, UserCheck, AlertTriangle, Menu, Sliders, ShieldCheck, Key, LogOut } from 'lucide-react';

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Security Operations Center (SOC)',
          subtitle: 'Real-time network security console & eBPF inspection'
        };
      case 'infrastructure':
        return {
          title: 'Server Infrastructure Matrix',
          subtitle: 'Cluster health, memory telemetry & resource allocation'
        };
      case 'threats':
        return {
          title: 'Threat Intelligence & IDS',
          subtitle: 'Real-time anomaly detection, active mitigations & live packet inspection'
        };
      case 'logs':
        return {
          title: 'System Access Audit Logs',
          subtitle: 'eBPF kernel telemetry & immutable audit trail'
        };
      default:
        return {
          title: 'Security Operations Center (SOC)',
          subtitle: 'Real-time network security console & eBPF inspection'
        };
    }
  };

  const { title, subtitle } = getHeaderMeta();

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
            <h1 className="header-title">{title}</h1>
            <div className={`env-pill ${isDdosActive ? 'env-pill-warning' : ''}`} title="Current Environment Cluster">
              <span className="env-dot"></span>
              <span className="env-name">{isDdosActive ? 'CONGESTION · EU-1' : 'PROD · SEC-EU-1'}</span>
            </div>
          </div>
          <p className="header-subtitle">{subtitle}</p>
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

        <div 
          ref={bellRef}
          className="notification-bell" 
          title="System security notifications"
          onClick={() => {
            setIsNotificationsOpen(!isNotificationsOpen);
            setIsProfileOpen(false);
          }}
        >
          <Bell size={16} className={isDdosActive ? 'text-danger' : 'text-muted'} />
          <span className={`bell-badge ${isDdosActive ? 'bell-badge-danger' : ''}`}></span>

          {isNotificationsOpen && (
            <div className="notifications-dropdown animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="notifications-dropdown-header">
                <span>Security Notifications</span>
                <span className="badge badge-subtle">{isDdosActive ? '3 Active' : '2 Active'}</span>
              </div>
              {isDdosActive && (
                <div className="notification-dropdown-item text-danger">
                  <AlertTriangle size={14} className="text-danger flex-shrink-0" />
                  <span>DDoS SYN flood mitigated on primary ingress node EU-WEST-1.</span>
                </div>
              )}
              <div className="notification-dropdown-item">
                <ShieldCheck size={14} className="text-success flex-shrink-0" />
                <span>eBPF telemetry sensor active on all 6 cluster nodes.</span>
              </div>
              <div className="notification-dropdown-item">
                <Key size={14} className="text-muted flex-shrink-0" />
                <span>Zero-trust mTLS certificate rotation check passed.</span>
              </div>
            </div>
          )}
        </div>

        <div 
          ref={profileRef}
          className="admin-profile"
          onClick={() => {
            setIsProfileOpen(!isProfileOpen);
            setIsNotificationsOpen(false);
          }}
        >
          <div className="profile-avatar">
            <UserCheck size={16} className="text-muted" />
          </div>
          <div className="profile-info">
            <span className="profile-name">Alexander K.</span>
            <span className="profile-role">
              <ShieldCheck size={11} className="role-icon" /> Tier 3 Analyst
            </span>
          </div>

          {isProfileOpen && (
            <div className="profile-menu-dropdown animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="profile-menu-header">
                <span className="profile-menu-user">Alexander K.</span>
                <div className="profile-menu-cluster">
                  <span className="cluster-status-dot"></span>
                  <span>Cluster PROD · SEC-EU-1</span>
                </div>
              </div>
              <button type="button" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                <ShieldCheck size={14} className="menu-item-icon" />
                <span>Security Clearance (Tier 3)</span>
              </button>
              <button type="button" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                <Key size={14} className="menu-item-icon" />
                <span>Session Keys & Certificates</span>
              </button>
              <div className="profile-menu-divider"></div>
              <button type="button" className="profile-menu-item text-muted" onClick={() => setIsProfileOpen(false)}>
                <LogOut size={14} className="menu-item-icon" />
                <span>Lock Console</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
