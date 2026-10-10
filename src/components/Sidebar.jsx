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
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`sidebar ${isCollapsed && !isMobileOpen ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-badge-wrap">
            <ShieldCheck className={`logo-icon ${isDdosActive ? 'text-danger' : 'text-primary'}`} size={24} />
            {showFullMenu && (
              <span className="logo-text">
                SECURE<span className={isDdosActive ? 'text-danger' : 'text-primary'}>NODE</span>
              </span>
            )}
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="sidebar-toggle-action-btn"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>

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
                  setIsMobileOpen(false);
                }}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={isCollapsed && !isMobileOpen ? item.label : undefined}
              >
                <Icon size={18} className="nav-icon" />
                {showFullMenu && <span className="nav-label">{item.label}</span>}
                {item.badge && (
                  <span className={`nav-badge ${isDdosActive ? 'bg-danger text-white' : ''} ${isCollapsed && !isMobileOpen ? 'collapsed-badge' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {showFullMenu && (
          <div className="sidebar-footer">
            <div className={`system-status ${isDdosActive ? 'status-danger' : ''}`}>
              <div className="status-header">
                {isDdosActive ? (
                  <AlertTriangle size={14} className="text-danger" />
                ) : (
                  <Terminal size={14} className="text-muted" />
                )}
                <span className={isDdosActive ? 'text-danger font-bold' : 'status-title'}>
                  {isDdosActive ? 'DDoS Anomaly' : 'System Status'}
                </span>
              </div>
              <div className="status-indicator">
                <span className={`status-dot ${isDdosActive ? 'bg-danger' : 'bg-success'}`}></span>
                <span className={`status-label ${isDdosActive ? 'text-danger font-bold' : ''}`}>
                  {isDdosActive ? 'Attack in progress' : 'Gateway operational'}
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
