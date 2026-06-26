import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import GamesView from './components/GamesView';
import FraudView from './components/FraudView';
import TransactionsView from './components/TransactionsView';
import SimulatorDeck from './components/SimulatorDeck';
import { initialLiveBets, mockFraudAlerts } from './utils/mockData';
import { ShieldAlert, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Sidebar State (Desktop Collapse & Mobile Swipe Open)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Auto collapse sidebar on tablet/smaller screens (<= 1056px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1056) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    
    // Set initial collapse state based on window size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Shared Simulator States
  const [isDdosActive, setIsDdosActive] = useState(false);
  const [isFeedFrozen, setIsFeedFrozen] = useState(false);
  const [alerts, setAlerts] = useState(mockFraudAlerts);
  const [liveBets, setLiveBets] = useState(initialLiveBets);
  const [jackpotEvent, setJackpotEvent] = useState(null);
  const [simDeckOpen, setSimDeckOpen] = useState(false);

  const handleTriggerJackpot = () => {
    const breachEvent = {
      id: Date.now(),
      player: `185.220.101.${Math.floor(Math.random() * 80) + 10}`,
      game: '/etc/passwd',
      amount: '24 KB',
      multiplier: 'CVE-2026-0928',
      win: 'CRITICAL BLOCK',
      type: 'loss' // blocked
    };
    
    // Inject immediately into live traffic feed
    setLiveBets(prev => [breachEvent, ...prev.slice(0, 4)]);
    
    // Trigger overlay banner
    setJackpotEvent(breachEvent);
    setSimDeckOpen(false);

    // Auto close after 5 seconds
    setTimeout(() => {
      setJackpotEvent(null);
    }, 5000);
  };

  const handleInjectFraud = () => {
    const customReasons = [
      'Port scanning detected: 50+ connections/sec',
      'Credential stuffing: 4 failed OAuth attempts',
      'Geo-IP mismatch: Suspicious routing bypass',
      'Remote Code Execution signature detected'
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
        return <DashboardView liveBets={liveBets} setLiveBets={setLiveBets} isFeedFrozen={isFeedFrozen} isDdosActive={isDdosActive} />;
    }
  };

  const unresolvedAlertsCount = alerts.filter(a => a.status !== 'resolved').length;

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
          {renderContent()}
        </main>
      </div>

      {/* Persistent Simulator Control Deck */}
      <SimulatorDeck 
        isOpen={simDeckOpen}
        setIsOpen={setSimDeckOpen}
        isDdosActive={isDdosActive}
        setIsDdosActive={setIsDdosActive}
        isFeedFrozen={isFeedFrozen}
        setIsFeedFrozen={setIsFeedFrozen}
        onTriggerJackpot={handleTriggerJackpot}
        onInjectFraud={handleInjectFraud}
      />

      {/* Global Security Breach Overlay */}
      {jackpotEvent && (
        <div className="jackpot-overlay animate-zoom-in" style={{ zIndex: 1100 }}>
          <div className="jackpot-banner glass-card border-danger" style={{ boxShadow: 'var(--card-shadow), 0 0 50px rgba(239, 68, 68, 0.4)' }}>
            <button className="jackpot-close-btn" onClick={() => setJackpotEvent(null)}>
              <X size={16} />
            </button>
            <div className="jackpot-icon-wrapper">
              <ShieldAlert className="jackpot-crown animate-bounce-slow text-danger" style={{ filter: 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.6))' }} size={48} />
            </div>
            <div className="jackpot-message">
              <h2 className="text-danger">SECURITY BREACH DETECTED!</h2>
              <p>Unauthorized attempt to read root shell files</p>
              <h1 className="jackpot-win-amount text-danger" style={{ textShadow: '0 0 25px var(--danger)' }}>CRITICAL EXPLOIT</h1>
              <p className="jackpot-game-meta">Source IP: <strong>{jackpotEvent.player}</strong> | Target Path: <strong>{jackpotEvent.game}</strong> | Signature: <strong>{jackpotEvent.multiplier}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
