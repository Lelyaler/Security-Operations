import React from 'react';
import { Users, Server, Bell, UserCheck } from 'lucide-react';

export default function Header({ activeTab }) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'iGaming Real-Time Analytics';
      case 'games':
        return 'Games Performance Matrix';
      case 'fraud':
        return 'Compliance & Fraud Center';
      case 'transactions':
        return 'Financial Transactions Ledger';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="header">
      <div className="header-title-section">
        <h1 className="header-title">{getTitle()}</h1>
        <p className="header-subtitle">Real-time gaming operations console</p>
      </div>

      <div className="header-widgets">
        <div className="widget-item glass-card">
          <Users size={16} className="text-primary" />
          <div className="widget-content">
            <span className="widget-value pulse-text">3,284</span>
            <span className="widget-label">Players Online</span>
          </div>
        </div>

        <div className="widget-item glass-card">
          <Server size={16} className="text-secondary" />
          <div className="widget-content">
            <span className="widget-value">EU-WEST-1</span>
            <span className="widget-label">Primary Node</span>
          </div>
        </div>

        <div className="notification-bell glass-card">
          <Bell size={18} className="text-accent animate-bounce-slow" />
          <span className="bell-badge"></span>
        </div>

        <div className="admin-profile glass-card">
          <div className="profile-avatar">
            <UserCheck size={18} className="text-primary" />
          </div>
          <div className="profile-info">
            <span className="profile-name">Alexander K.</span>
            <span className="profile-role">Compliance Officer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
