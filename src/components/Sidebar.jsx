import React from 'react';
import { LayoutDashboard, Gamepad2, ShieldAlert, Coins, ShieldCheck, Terminal, Award, AlertTriangle } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, alertsCount, isDdosActive }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'games', label: 'Games Matrix', icon: Gamepad2 },
    { 
      id: 'fraud', 
      label: 'Fraud Center', 
      icon: ShieldAlert, 
      badge: alertsCount > 0 ? alertsCount : null 
    },
    { id: 'transactions', label: 'Transactions', icon: Coins }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Award className={`logo-icon ${isDdosActive ? 'text-danger animate-pulse' : 'text-primary animate-pulse'}`} size={28} />
        <span className="logo-text">NEON<span className={isDdosActive ? 'text-danger' : 'text-primary'}>SPIN</span></span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${isDdosActive ? 'bg-danger text-white' : 'pulse-primary'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className={`system-status glass-card ${isDdosActive ? 'border-danger' : ''}`}>
          <div className="status-header">
            {isDdosActive ? (
              <AlertTriangle size={14} className="text-danger animate-bounce-slow" />
            ) : (
              <Terminal size={14} className="text-primary" />
            )}
            <span className={isDdosActive ? 'text-danger font-bold' : 'status-title'}>
              {isDdosActive ? 'DDoS ANOMALY' : 'System Status'}
            </span>
          </div>
          <div className="status-indicator">
            <span className={`status-dot ${isDdosActive ? 'bg-danger' : 'bg-success'}`}></span>
            <span className={`status-label ${isDdosActive ? 'text-danger font-bold' : ''}`}>
              {isDdosActive ? 'ATTACK IN PROGRESS' : 'API Gateway Online'}
            </span>
          </div>
          <div className="system-meta">
            <span>Ping: {isDdosActive ? '824ms' : '14ms'}</span>
            <span>Uptime: {isDdosActive ? '94.12%' : '99.98%'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
