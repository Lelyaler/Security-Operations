import React from 'react';
import { LayoutDashboard, Gamepad2, ShieldAlert, Coins, ShieldCheck, Terminal, Award } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'games', label: 'Games Matrix', icon: Gamepad2 },
    { id: 'fraud', label: 'Fraud Center', icon: ShieldAlert, badge: 3 },
    { id: 'transactions', label: 'Transactions', icon: Coins }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Award className="logo-icon text-primary animate-pulse" size={28} />
        <span className="logo-text">NEON<span className="text-primary">SPIN</span></span>
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
                <span className="nav-badge pulse-primary">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status glass-card">
          <div className="status-header">
            <Terminal size={14} className="text-primary" />
            <span className="status-title">System Status</span>
          </div>
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-label">API Gateway Online</span>
          </div>
          <div className="system-meta">
            <span>Ping: 14ms</span>
            <span>Uptime: 99.98%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
