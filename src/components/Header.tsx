import { useState, useRef, useEffect } from 'react';
import { Users, Server, Bell, UserCheck, AlertTriangle, Menu, ShieldCheck, Key, LogOut, Clock } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import type { TimeRange } from '../context/AuthContext';

interface HeaderProps {
  activeTab: string;
  isDdosActive: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenCredentials: (tab: 'clearance' | 'keys') => void;
  onLockConsole: () => void;
}

export default function Header({
  activeTab,
  isDdosActive,
  setIsMobileOpen,
  onOpenCredentials,
  onLockConsole
}: HeaderProps) {
  const { operator, timeRange, setTimeRange } = useAuth();
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
              <span className="env-name">{isDdosActive ? 'ANOMALY · EU-1' : 'PROD · SEC-EU-1'}</span>
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

        <div className="time-range-box" title="Global Telemetry Observation Window">
          <Clock size={13} className="text-muted" />
          <select
            aria-label="Observation Time Window"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="time-range-select font-mono"
          >
            <option value="15m">Last 15m</option>
            <option value="1h">Last 1h</option>
            <option value="6h">Last 6h</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
          </select>
        </div>

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
            <span className="profile-name">{operator.name}</span>
            <span className="profile-role">{operator.role}</span>
          </div>

          {isProfileOpen && (
            <div className="profile-menu-dropdown animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="profile-menu-header">
                <span className="profile-menu-user">{operator.name}</span>
                <div className="profile-menu-cluster">
                  <span className="cluster-status-dot"></span>
                  <span>{operator.clusterRegion}</span>
                </div>
              </div>
              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  onOpenCredentials('clearance');
                }}
              >
                <ShieldCheck size={14} className="menu-item-icon text-success" />
                <span>Security Clearance & RBAC</span>
              </button>
              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  onOpenCredentials('keys');
                }}
              >
                <Key size={14} className="menu-item-icon text-secondary" />
                <span>Session Keys & mTLS</span>
              </button>
              <div className="profile-menu-divider"></div>
              <button
                type="button"
                className="profile-menu-item text-danger"
                onClick={() => {
                  setIsProfileOpen(false);
                  onLockConsole();
                }}
              >
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
