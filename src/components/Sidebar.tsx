import { LayoutDashboard, AlertTriangle, ChevronLeft, ChevronRight, X, Terminal, Activity } from 'lucide-react';
import type { RouteState } from '../hooks/useNavigationState';

type Tab = RouteState['tab'];

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  alertsCount: number;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  alertsCount,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  const menuItems: { id: Tab; label: string; icon: typeof Activity; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'threats', label: 'Incidents', icon: AlertTriangle, badge: alertsCount || undefined }
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
            <Activity className="logo-icon text-primary" size={22} />
            {showFullMenu && <span className="logo-text">secops</span>}
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
                  <span className={`nav-badge ${isCollapsed && !isMobileOpen ? 'collapsed-badge' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {showFullMenu && (
          <div className="sidebar-footer">
            <div className="system-status">
              <div className="status-header">
                <Terminal size={14} className="text-muted" />
                <span className="status-title">System Status</span>
              </div>
              <div className="status-indicator">
                <span className="status-dot bg-success"></span>
                <span className="status-label">Gateway operational</span>
              </div>
              <div className="system-meta">
                <span>Region: eu-central-1</span>
                <span>SLA: 99.98%</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
