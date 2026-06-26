import React from 'react';
import { Users, Server, Bell, UserCheck, AlertTriangle } from 'lucide-react';

export default function Header({ activeTab, isDdosActive }) {
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
      <div className="header-title-section">
        <h1 className="header-title">{getTitle()}</h1>
        <p className="header-subtitle">Real-time network security console</p>
      </div>

      <div className="header-widgets">
        <div className="widget-item glass-card">
          <Users size={16} className={isDdosActive ? 'text-danger' : 'text-primary'} />
          <div className="widget-content">
            <span className="widget-value pulse-text">{isDdosActive ? '184' : '3,284'}</span>
            <span className="widget-label">Active Sockets</span>
          </div>
        </div>

        <div className={`widget-item glass-card ${isDdosActive ? 'border-danger-glow' : ''}`}>
          {isDdosActive ? (
            <AlertTriangle size={16} className="text-danger animate-pulse" />
          ) : (
            <Server size={16} className="text-secondary" />
          )}
          <div className="widget-content">
            <span className={`widget-value ${isDdosActive ? 'text-danger' : ''}`}>
              {isDdosActive ? 'ANOMALY DETECTED' : 'EU-WEST-1'}
            </span>
            <span className="widget-label">
              {isDdosActive ? 'Latency Warning' : 'Primary Node'}
            </span>
          </div>
        </div>

        <div className="notification-bell glass-card">
          <Bell size={18} className={isDdosActive ? 'text-danger animate-bounce-slow' : 'text-accent animate-bounce-slow'} />
          <span className={`bell-badge ${isDdosActive ? 'bg-danger' : 'bg-accent'}`}></span>
        </div>

        <div className="admin-profile glass-card">
          <div className="profile-avatar">
            <UserCheck size={18} className="text-primary" />
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
