import { useState, useEffect, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import DiagnosticsModal from './components/DiagnosticsModal';
import OperatorCredentialsModal from './components/OperatorCredentialsModal';
import LockScreen from './components/LockScreen';
import { useIncidents } from './hooks/useIncidents';
import { useTelemetry } from './hooks/useTelemetry';
import { useNavigationState } from './hooks/useNavigationState';
import { ShieldAlert, X } from 'lucide-react';

const InfrastructureView = lazy(() => import('./components/InfrastructureView'));
const ThreatCenterView = lazy(() => import('./components/ThreatCenterView'));
const AuditLogsView = lazy(() => import('./components/AuditLogsView'));

export default function App() {
  const { tab: activeTab, params, navigateTab, updateParams } = useNavigationState();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);

  const [credentialsModal, setCredentialsModal] = useState<{
    isOpen: boolean;
    tab: 'clearance' | 'keys';
  }>({
    isOpen: false,
    tab: 'clearance'
  });

  const [isConsoleLocked, setIsConsoleLocked] = useState(() => {
    return sessionStorage.getItem('soc_console_locked') === 'true';
  });

  const handleLockConsole = () => {
    sessionStorage.setItem('soc_console_locked', 'true');
    setIsConsoleLocked(true);
  };

  const handleUnlockConsole = () => {
    sessionStorage.removeItem('soc_console_locked');
    setIsConsoleLocked(false);
  };

  const {
    incidents,
    setIncidents,
    injectSyntheticIncident,
    resetToDefaults,
    unresolvedCount
  } = useIncidents();

  const {
    isDdosActive,
    setIsDdosActive,
    isFeedFrozen,
    setIsFeedFrozen,
    livePackets,
    setLivePackets,
    breachEvent,
    triggerBreachSimulation,
    dismissBreach
  } = useTelemetry();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1056) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            livePackets={livePackets}
            setLivePackets={setLivePackets}
            isFeedFrozen={isFeedFrozen}
            isDdosActive={isDdosActive}
            alertsCount={unresolvedCount}
          />
        );
      case 'infrastructure':
        return <InfrastructureView params={params} onUpdateParams={updateParams} />;
      case 'threats':
        return (
          <ThreatCenterView
            incidents={incidents}
            setIncidents={setIncidents}
            params={params}
            onUpdateParams={updateParams}
          />
        );
      case 'logs':
        return <AuditLogsView params={params} onUpdateParams={updateParams} />;
      default:
        return (
          <DashboardView
            livePackets={livePackets}
            setLivePackets={setLivePackets}
            isFeedFrozen={isFeedFrozen}
            isDdosActive={isDdosActive}
            alertsCount={unresolvedCount}
          />
        );
    }
  };

  return (
    <div
      className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${
        isMobileSidebarOpen ? 'mobile-sidebar-open' : ''
      }`}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(t) => navigateTab(t as any)}
        alertsCount={unresolvedCount}
        isDdosActive={isDdosActive}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      <div className="main-content">
        <Header
          activeTab={activeTab}
          isDdosActive={isDdosActive}
          setIsMobileOpen={setIsMobileSidebarOpen}
          onOpenDiagnostics={() => setDiagnosticsOpen(true)}
          onOpenCredentials={(tab) => setCredentialsModal({ isOpen: true, tab })}
          onLockConsole={handleLockConsole}
        />

        <main className="content-area">
          <Suspense fallback={<div className="loading-fallback">Loading Console Node...</div>}>
            {renderContent()}
          </Suspense>
        </main>
      </div>

      <DiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
        isDdosActive={isDdosActive}
        setIsDdosActive={setIsDdosActive}
        isFeedFrozen={isFeedFrozen}
        setIsFeedFrozen={setIsFeedFrozen}
        onTriggerBreach={triggerBreachSimulation}
        onInjectIncident={injectSyntheticIncident}
        onResetDefaults={resetToDefaults}
      />

      <OperatorCredentialsModal
        isOpen={credentialsModal.isOpen}
        initialTab={credentialsModal.tab}
        onClose={() => setCredentialsModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {isConsoleLocked && (
        <LockScreen onUnlock={handleUnlockConsole} />
      )}

      {breachEvent && (
        <div className="breach-overlay animate-zoom-in">
          <div className="breach-modal card">
            <button
              className="breach-close-btn"
              onClick={dismissBreach}
              aria-label="Dismiss security notice"
            >
              <X size={16} />
            </button>
            <div className="breach-icon-wrapper">
              <ShieldAlert className="text-danger" size={40} />
            </div>
            <div className="breach-message">
              <h2>Security Breach Intercepted</h2>
              <p>
                Unauthorized attempt to read sensitive system configuration was blocked by intrusion
                detection.
              </p>
              <div className="breach-details-pill">CRITICAL INTRUSION PREVENTED</div>
              <div className="breach-meta font-mono">
                <span>
                  Source: <strong>{breachEvent.sourceIp}</strong>
                </span>
                <span>
                  Target: <strong>{breachEvent.endpoint}</strong>
                </span>
                <span>
                  Rule: <strong>{breachEvent.rule}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
