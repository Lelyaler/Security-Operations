import React from 'react';
import { Sliders, Zap, AlertTriangle, ShieldAlert, Play, Pause, X } from 'lucide-react';

export default function SimulatorDeck({ 
  isOpen, 
  setIsOpen,
  isDdosActive, 
  setIsDdosActive,
  isFeedFrozen, 
  setIsFeedFrozen,
  onTriggerJackpot,
  onInjectFraud
}) {
  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="simulator-toggle-btn pulse-primary"
        title="Open Simulation Controller"
      >
        <Sliders size={20} />
        <span>SIMULATOR</span>
      </button>

      {/* Simulator Drawer Panel */}
      {isOpen && (
        <div className="simulator-drawer glass-card animate-slide-left">
          <div className="simulator-header">
            <div className="sim-title">
              <Sliders size={18} className="text-primary animate-pulse" />
              <h3>Simulation Deck</h3>
            </div>
            <button className="sim-close-btn" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <p className="sim-desc">
            Trigger operations events below to test how the React state and visual interfaces update in real-time.
          </p>

          <div className="sim-actions-list">
            {/* Action 1: Trigger VIP Jackpot */}
            <div className="sim-action-card">
              <div className="sim-card-info">
                <h4>Trigger Mega Jackpot</h4>
                <p>Simulates a high-roller slot win. Displays a golden screen banner and injects a $250k item to the live feed.</p>
              </div>
              <button onClick={onTriggerJackpot} className="btn btn-primary btn-sim-action">
                <Zap size={14} /> Trigger
              </button>
            </div>

            {/* Action 2: Simulate DDoS Attack */}
            <div className="sim-action-card">
              <div className="sim-card-info">
                <h4>Simulate DDoS Attack</h4>
                <p>Forces system status to RED, spikes latency to 820ms, and updates header to display warnings.</p>
              </div>
              <button 
                onClick={() => setIsDdosActive(!isDdosActive)} 
                className={`btn btn-sim-action ${isDdosActive ? 'btn-danger-active' : 'btn-secondary'}`}
              >
                <AlertTriangle size={14} />
                {isDdosActive ? 'Disable' : 'Enable'}
              </button>
            </div>

            {/* Action 3: Inject Fraud Alert */}
            <div className="sim-action-card">
              <div className="sim-card-info">
                <h4>Inject Fraud Alert</h4>
                <p>Adds a new High-Risk compliance alert case. Increases the sidebar alert badge count instantly.</p>
              </div>
              <button onClick={onInjectFraud} className="btn btn-secondary btn-sim-action text-warning">
                <ShieldAlert size={14} /> Inject Alert
              </button>
            </div>

            {/* Action 4: Freeze Live Feed */}
            <div className="sim-action-card">
              <div className="sim-card-info">
                <h4>Live Feed Stream</h4>
                <p>Pause or play the background ticker that populates live bet cards every 3 seconds.</p>
              </div>
              <button 
                onClick={() => setIsFeedFrozen(!isFeedFrozen)} 
                className="btn btn-secondary btn-sim-action"
              >
                {isFeedFrozen ? <Play size={14} /> : <Pause size={14} />}
                {isFeedFrozen ? 'Resume Feed' : 'Freeze Feed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
