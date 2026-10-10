import React, { useState, useEffect, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import SimulatorDeck from './components/SimulatorDeck';
import { initialLiveBets, mockFraudAlerts } from './utils/mockData';
import { ShieldAlert, X } from 'lucide-react';

const GamesView = lazy(() => import('./components/GamesView'));
const FraudView = lazy(() => import('./components/FraudView'));
const TransactionsView = lazy(() => import('./components/TransactionsView'));

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
  const [alerts, setAlerts] = useState(mockFraudAlerts);
  const [liveBets, setLiveBets] = useState(initialLiveBets);
  const [breachEvent, setBreachEvent] = useState(null);
  const [simDeckOpen, setSimDeckOpen] = useState(false);

  const handleTriggerBreach = () => {
    const newBreach = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      player: `185.220.101.${Math.floor(Math.random() * 80) + 10}`,
      game: '/etc/passwd',
      amount: '24 KB',
      multiplier: 'CVE-2026-0928',
      win: 'CRITICAL BLOCK',
      type: 'loss'
    };
    
    setLiveBets(prev => [newBreach, ...prev.slice(0, 5)]);
    setBreachEvent(newBreach);
    setSimDeckOpen(false);

    setTimeout(() => {
      setBreachEvent(null);
    }, 6000);
  };

  const handleInjectFraud = () => {
    const customReasons = [
      'Port scan sweep detected: 50+ probes/sec',
      'Credential stuffing: 4 failed OAuth attempts',
      'Geo-IP mismatch: Suspicious proxy tunnel',
      'Remote code execution signature detected'
    ];
    
    const randomIP = [
      '185.220.101.99', 
      '192.168.22.4', 
      '94.130.49.205', 
      '213.89.141.15'
    ][Math.floor(Math.random() * 4)];
    
    const randomNode = [
      'Auth Node-01', 
      'API Gateway Alpha', 
      'Database Primary', 
      'CDN Edge-03'
    ][Math.floor(Math.random() * 4)];
    
    const newAlert = {
      id: `SEC-${Math.floor(Math.random() * 9000) + 1000}`,
      player: randomIP,
      country: randomNode,
      risk: 'high',
      reason: customReasons[Math.floor(Math.random() * customReasons.length)],
      amount: `${(Math.random() * 20 + 1).toFixed(1)} MB`,
      time: 'Just now',
      status: 'pending'
    };

    setAlerts(prev => [newAlert, ...prev]);
  };

  const unresolvedAlertsCount = alerts.filter(a => a.status !== 'resolved').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            liveBets={liveBets} 
            setLiveBets={setLiveBets} 
            isFeedFrozen={isFeedFrozen} 
            isDdosActive={isDdosActive} 
            alertsCount={unresolvedAlertsCount}
          />
        );
      case 'games':
        return <GamesView />;
      case 'fraud':
        return <FraudView alerts={alerts} setAlerts={setAlerts} />;
      case 'transactions':
        return <TransactionsView />;
      default:
        return (
          <DashboardView 
            liveBets={liveBets} 
            setLiveBets={setLiveBets} 
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
        />
        
        <main className="content-area">
          <Suspense fallback={<div className="loading-fallback">Loading Console Node...</div>}>
            {renderContent()}
          </Suspense>
        </main>
      </div>

      <SimulatorDeck 
        isOpen={simDeckOpen}
        setIsOpen={setSimDeckOpen}
        isDdosActive={isDdosActive}
        setIsDdosActive={setIsDdosActive}
        isFeedFrozen={isFeedFrozen}
        setIsFeedFrozen={setIsFeedFrozen}
        onTriggerJackpot={handleTriggerBreach}
        onTriggerBreach={handleTriggerBreach}
        onInjectFraud={handleInjectFraud}
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
              <p>Unauthorized attempt to read sensitive system file was blocked by intrusion detection.</p>
              <div className="breach-details-pill">
                CRITICAL INTRUSION PREVENTED
              </div>
              <div className="breach-meta">
                <span>Source: <strong>{breachEvent.player}</strong></span>
                <span>Path: <strong>{breachEvent.game}</strong></span>
                <span>Rule: <strong>{breachEvent.multiplier}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
