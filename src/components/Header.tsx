import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, ShieldCheck, Key, Settings } from 'lucide-react';
import { useSettings } from '../context/useSettings';
import type { RouteState } from '../hooks/useNavigationState';

interface HeaderProps {
  activeTab: RouteState['tab'];
  setIsMobileOpen: (open: boolean) => void;
  onOpenSettings: () => void;
}

const TITLES: Record<RouteState['tab'], { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Overview',
    subtitle: 'Gateway traffic, latency and response codes'
  },
  threats: {
    title: 'Incidents',
    subtitle: 'Rate limiting, upstream timeouts and security alerts'
  }
};

type Popover = 'profile' | 'notifications' | null;

export default function Header({ activeTab, setIsMobileOpen, onOpenSettings }: HeaderProps) {
  const { operator } = useSettings();
  const [open, setOpen] = useState<Popover>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!actionsRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = (name: Exclude<Popover, null>) => setOpen((cur) => (cur === name ? null : name));
  const { title, subtitle } = TITLES[activeTab];

  return (
    <header className="header">
      <div className="header-left-group">
        <button
          type="button"
          className="mobile-menu-trigger-btn"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="header-title-section">
          <div className="header-title-row">
            <h1 className="header-title">{title}</h1>
            <span className="env-pill">
              <span className="env-dot" />
              eu-central-1
            </span>
          </div>
          <p className="header-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="header-widgets" ref={actionsRef}>
        <div className="widget-item">
          <div className="widget-content">
            <span className="widget-value font-mono">99.98%</span>
            <span className="widget-label">Uptime, 30d</span>
          </div>
        </div>

        <div className="popover-anchor">
          <button
            type="button"
            className="notification-bell"
            aria-label="Notifications"
            aria-expanded={open === 'notifications'}
            onClick={() => toggle('notifications')}
          >
            <Bell size={16} className="text-muted" />
            <span className="bell-badge" />
          </button>

          {open === 'notifications' && (
            <div className="notifications-dropdown animate-fade-in">
              <div className="notifications-dropdown-header">
                <span>Notifications</span>
                <span className="badge badge-subtle">2</span>
              </div>
              <div className="notification-dropdown-item">
                <ShieldCheck size={14} className="text-success" />
                <span>All edge gateways operational across 3 availability zones.</span>
              </div>
              <div className="notification-dropdown-item">
                <Key size={14} className="text-muted" />
                <span>TLS wildcard cert (*.api.example.com) auto-renews in 12 days.</span>
              </div>
            </div>
          )}
        </div>

        <div className="popover-anchor">
          <button
            type="button"
            className="admin-profile"
            aria-expanded={open === 'profile'}
            onClick={() => toggle('profile')}
          >
            <span className="profile-avatar font-mono">{operator.initials}</span>
            <span className="profile-info">
              <span className="profile-name">{operator.name}</span>
              <span className="profile-role">{operator.role}</span>
            </span>
          </button>

          {open === 'profile' && (
            <div className="profile-menu-dropdown animate-fade-in">
              <div className="profile-menu-header">
                <span className="profile-menu-user">{operator.name}</span>
                <span className="profile-menu-cluster">{operator.email}</span>
              </div>
              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {
                  setOpen(null);
                  onOpenSettings();
                }}
              >
                <Settings size={14} className="menu-item-icon" />
                Settings &amp; export
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
