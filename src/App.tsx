import { useState, useEffect, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import { useIncidents } from './hooks/useIncidents';
import { useNavigationState } from './hooks/useNavigationState';

const IncidentLogsView = lazy(() => import('./components/IncidentLogsView'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));

const COLLAPSE_BREAKPOINT = 1056;

export default function App() {
  const { tab: activeTab, params, navigateTab, updateParams } = useNavigationState();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { incidents, setIncidents, unresolvedCount } = useIncidents();

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${COLLAPSE_BREAKPOINT}px)`);
    const sync = () => setIsSidebarCollapsed(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={navigateTab}
        alertsCount={unresolvedCount}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      <div className="main-content">
        <Header
          activeTab={activeTab}
          setIsMobileOpen={setIsMobileSidebarOpen}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="content-area">
          <Suspense fallback={<div className="view-loading" />}>
            {activeTab === 'threats' ? (
              <IncidentLogsView
                incidents={incidents}
                setIncidents={setIncidents}
                params={params}
                onUpdateParams={updateParams}
              />
            ) : (
              <DashboardView openIncidents={unresolvedCount} />
            )}
          </Suspense>
        </main>
      </div>

      {isSettingsOpen && (
        <Suspense fallback={null}>
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
