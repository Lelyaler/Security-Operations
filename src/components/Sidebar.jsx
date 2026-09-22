import React from 'react';
import { LayoutDashboard, Server, ShieldAlert, Terminal, ShieldCheck, AlertTriangle, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  alertsCount, 
  isDdosActive,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'games', label: 'Server Matrix', icon: Server },
    { 
      id: 'fraud', 
      label: 'Threat Center', 
      icon: ShieldAlert, 
      badge: alertsCount > 0 ? alertsCount : null 
    },
    { id: 'transactions', label: 'Access Logs', icon: Terminal }
  ];

  const showFullMenu = !isCollapsed || isMobileOpen;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`sidebar ${isCollapsed && !isMobileOpen ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <ShieldCheck className={`logo-icon ${isDdosActive ? 'text-danger animate-pulse' : 'text-primary animate-pulse'}`} size={28} />
          {showFullMenu && <span className="logo-text">SECURE<span className={isDdosActive ? 'text-danger' : 'text-primary'}>NODE</span></span>}
          
          {/* Collapse/Expand toggle for desktop */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="sidebar-toggle-action-btn"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Close button for mobile */}
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="sidebar-close-mobile-btn"
            title="Close Menu"
            aria-label="Close Menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false); // Auto close sidebar on mobile navigation
                }}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={isCollapsed && !isMobileOpen ? item.label : undefined}
              >
                <Icon size={20} className="nav-icon" />
                {showFullMenu && <span className="nav-label">{item.label}</span>}
                {item.badge && (
                  <span className={`nav-badge ${isDdosActive ? 'bg-danger text-white' : 'pulse-primary'} ${isCollapsed && !isMobileOpen ? 'collapsed-badge' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {showFullMenu && (
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
        )}
      </aside>
    </>
  );
}
