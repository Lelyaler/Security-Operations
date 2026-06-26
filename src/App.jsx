import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import GamesView from './components/GamesView';
import FraudView from './components/FraudView';
import TransactionsView from './components/TransactionsView';
import SimulatorDeck from './components/SimulatorDeck';
import { initialLiveBets, mockFraudAlerts } from './utils/mockData';
import { Award, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Shared Simulator States
  const [isDdosActive, setIsDdosActive] = useState(false);
  const [isFeedFrozen, setIsFeedFrozen] = useState(false);
  const [alerts, setAlerts] = useState(mockFraudAlerts);
  const [liveBets, setLiveBets] = useState(initialLiveBets);
  const [jackpotEvent, setJackpotEvent] = useState(null);
  const [simDeckOpen, setSimDeckOpen] = useState(false);

  const handleTriggerJackpot = () => {
    const jackpotBet = {
      id: Date.now(),
      player: `Player-VIP-${Math.floor(Math.random() * 80) + 10}`,
      game: 'Crazy Time',
      amount: '$10,000',
      multiplier: '25x',
      win: '$250,000',
      type: 'win'
    };
    
    // Inject immediately into live feed
    setLiveBets(prev => [jackpotBet, ...prev.slice(0, 4)]);
    
    // Trigger overlay banner
    setJackpotEvent(jackpotBet);
    setSimDeckOpen(false);

    // Auto close after 5 seconds
    setTimeout(() => {
      setJackpotEvent(null);
    }, 5000);
  };

  const handleInjectFraud = () => {
    const customReasons = [
      'Velocity Limit exceeded: $50k in 1 min',
      'Carding attempt: 4 failed Visa auths',
      'Geo-IP discrepancy: Login session mismatch',
      'Exploit signature matched: Roulette bets'
    ];
    
    const randomName = ['Lucas G.', 'Victor D.', 'Diana M.', 'Clara L.'][Math.floor(Math.random() * 4)];
    const randomCountry = ['UA', 'CY', 'MT', 'GB'][Math.floor(Math.random() * 4)];
    
    const newAlert = {
      id: `FL-${Math.floor(Math.random() * 9000) + 1000}`,
      player: randomName,
      country: randomCountry,
      risk: 'high',
      reason: customReasons[Math.floor(Math.random() * customReasons.length)],
      amount: `$${(Math.floor(Math.random() * 40) + 10) * 1000}`,
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
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        alertsCount={unresolvedAlertsCount}
        isDdosActive={isDdosActive}
      />
      
      <div className="main-content">
        <Header activeTab={activeTab} isDdosActive={isDdosActive} />
        
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

      {/* Global Jackpot Banner Overlay */}
      {jackpotEvent && (
        <div className="jackpot-overlay animate-zoom-in">
          <div className="jackpot-banner glass-card pulse-primary">
            <button className="jackpot-close-btn" onClick={() => setJackpotEvent(null)}>
              <X size={16} />
            </button>
            <div className="jackpot-icon-wrapper">
              <Award className="jackpot-crown animate-bounce-slow" size={48} />
            </div>
            <div className="jackpot-message">
              <h2>MEGA JACKPOT WINNER!</h2>
              <p>Player <strong>{jackpotEvent.player}</strong> just won</p>
              <h1 className="jackpot-win-amount">{jackpotEvent.win}</h1>
              <p className="jackpot-game-meta">on game <strong>{jackpotEvent.game}</strong> ({jackpotEvent.multiplier})</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
