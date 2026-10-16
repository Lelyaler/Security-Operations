import { useState, useEffect, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import DiagnosticsModal from './components/DiagnosticsModal';
import { initialLivePackets, mockSecurityIncidents } from './utils/mockData';
import { loadPersistedIncidents, savePersistedIncidents, clearPersistedData } from './utils/securityHelpers';
import type { SecurityIncident, NetworkPacket } from './types/security';
import { ShieldAlert, X } from 'lucide-react';

const InfrastructureView = lazy(() => import('./components/InfrastructureView'));
const ThreatCenterView = lazy(() => import('./components/ThreatCenterView'));
const AuditLogsView = lazy(() => import('./components/AuditLogsView'));

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
  
  const [isDdosActive, setIsDdosActive] = useState(false);
  const [isFeedFrozen, setIsFeedFrozen] = useState(false);
  const [incidents, setIncidents] = useState<SecurityIncident[]>(() =>
    loadPersistedIncidents(mockSecurityIncidents)
  );
  const [livePackets, setLivePackets] = useState<NetworkPacket[]>(initialLivePackets);
  const [breachEvent, setBreachEvent] = useState<{
    sourceIp: string;
    endpoint: string;
    rule: string;
    cve?: string;
  } | null>(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);

  // Synchronize incidents to local storage
  useEffect(() => {
    savePersistedIncidents(incidents);
  }, [incidents]);

  const handleTriggerBreach = () => {
    const randomOctet = Math.floor(Math.random() * 80) + 10;
    const ip = `185.220.101.${randomOctet}`;
    const newPacket: NetworkPacket = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sourceIp: ip,
      endpoint: '/etc/security/limits.conf',
      payloadSize: '24.2 KB',
      port: 443,
      statusText: '403 Blocked',
      type: 'blocked',
      timestamp: new Date().toTimeString().slice(0, 8)
    };
    
    setLivePackets((prev) => [newPacket, ...prev.slice(0, 5)]);
    setBreachEvent({
      sourceIp: ip,
      endpoint: '/etc/security/limits.conf',
      rule: 'CVE-2026-0928 (Header Injection)',
      cve: 'CVE-2026-0928'
    });

    setTimeout(() => {
      setBreachEvent(null);
    }, 6000);
  };

  const handleInjectIncident = () => {
    const scenarios = [
      {
        reason: 'Port scan sweep detected: 50+ probes/sec across perimeter',
        mitre: { id: 'T1046', name: 'Network Service Discovery', tactic: 'Discovery' },
        cve: 'CVE-2025-7821',
        service: 'edge-waf-ingress.us.sec',
        port: 443,
        proto: 'TCP'
      },
      {
        reason: 'Credential stuffing: 4 failed OAuth token validations',
        mitre: { id: 'T1110.004', name: 'Credential Stuffing', tactic: 'Credential Access' },
        cve: 'CVE-2025-2411',
        service: 'auth-node-01.eu.sec',
        port: 443,
        proto: 'HTTPS'
      },
      {
        reason: 'Geo-IP mismatch: Suspicious routing across non-standard ASN',
        mitre: { id: 'T1550', name: 'Use Alternate Authentication Material', tactic: 'Defense Evasion' },
        cve: 'CVE-2025-1082',
        service: 'billing-service.eu.sec',
        port: 8443,
        proto: 'HTTPS'
      },
      {
        reason: 'Remote code execution payload blocked in HTTP Authorization header',
        mitre: { id: 'T1059.004', name: 'Unix Shell', tactic: 'Execution' },
        cve: 'CVE-2026-1142',
        service: 'api-gw-alpha.us.sec',
        port: 443,
        proto: 'HTTPS'
      }
    ];

    const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
    const randomIp = `194.26.${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 240 + 10)}`;
    const newId = `SEC-${Math.floor(Math.random() * 9000) + 1000}`;

    const newIncident: SecurityIncident = {
      id: newId,
      sourceIp: randomIp,
      targetService: pick.service,
      risk: 'high',
      reason: pick.reason,
      payloadSize: `${(Math.random() * 15 + 2).toFixed(1)} MB`,
      timestamp: 'Just now',
      status: 'pending',
      cve: pick.cve,
      mitre: pick.mitre,
      destinationPort: pick.port,
      protocol: pick.proto,
      sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      rawEvent: `CEF:0|SecureNode|Sensor|3.4|9901|IDS_INTRUSION_ALERT|8|src=${randomIp} dst=${pick.service} dpt=${pick.port} proto=${pick.proto} cs1Label=CVE cs1=${pick.cve} cs2Label=Mitre cs2=${pick.mitre.id} msg="${pick.reason}"`
    };

    setIncidents((prev) => [newIncident, ...prev]);
  };

  const handleResetDefaults = () => {
    clearPersistedData();
    setIncidents(mockSecurityIncidents);
  };

  const unresolvedAlertsCount = incidents.filter((a) => a.status !== 'resolved').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            livePackets={livePackets} 
            setLivePackets={setLivePackets} 
            isFeedFrozen={isFeedFrozen} 
            isDdosActive={isDdosActive} 
            alertsCount={unresolvedAlertsCount}
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
            alertsCount={unresolvedAlertsCount}
          />
        );
    }
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        alertsCount={unresolvedAlertsCount}
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
        onTriggerBreach={handleTriggerBreach}
        onInjectIncident={handleInjectIncident}
        onResetDefaults={handleResetDefaults}
      />

      {breachEvent && (
        <div className="breach-overlay animate-zoom-in">
          <div className="breach-modal card">
            <button className="breach-close-btn" onClick={() => setBreachEvent(null)} aria-label="Dismiss security notice">
              <X size={16} />
            </button>
            <div className="breach-icon-wrapper">
              <ShieldAlert className="text-danger" size={40} />
            </div>
            <div className="breach-message">
              <h2>Security Breach Intercepted</h2>
              <p>Unauthorized attempt to read sensitive system configuration was blocked by intrusion detection.</p>
              <div className="breach-details-pill">
                CRITICAL INTRUSION PREVENTED
              </div>
              <div className="breach-meta font-mono">
                <span>Source: <strong>{breachEvent.sourceIp}</strong></span>
                <span>Target: <strong>{breachEvent.endpoint}</strong></span>
                <span>Rule: <strong>{breachEvent.rule}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
