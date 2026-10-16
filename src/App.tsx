import { useState, useEffect, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import DiagnosticsModal from './components/DiagnosticsModal';
import { useIncidents } from './hooks/useIncidents';
import { useTelemetry } from './hooks/useTelemetry';
import { ShieldAlert, X } from 'lucide-react';

const InfrastructureView = lazy(() => import('./components/InfrastructureView'));
const ThreatCenterView = lazy(() => import('./components/ThreatCenterView'));
const AuditLogsView = lazy(() => import('./components/AuditLogsView'));

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);

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
        return <InfrastructureView />;
      case 'threats':
        return <ThreatCenterView incidents={incidents} setIncidents={setIncidents} />;
      case 'logs':
        return <AuditLogsView />;
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
        setActiveTab={setActiveTab}
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
