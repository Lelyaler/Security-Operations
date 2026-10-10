import React from 'react';
import { Users, Server, Bell, UserCheck, AlertTriangle, Menu } from 'lucide-react';

export default function Header({ activeTab, isDdosActive, setIsMobileOpen }) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Security Operations Center (SOC)';
      case 'games':
        return 'Server Infrastructure Matrix';
      case 'fraud':
        return 'Threat Intelligence & IDS';
      case 'transactions':
        return 'System Access Audit Logs';
      default:
        return 'Dashboard';
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
