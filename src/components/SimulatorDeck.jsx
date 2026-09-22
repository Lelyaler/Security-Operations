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
        onClick={() => setIsOpen(!isOpen)} 
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
              <h2>Simulation Deck</h2>
            </div>
            <button className="sim-close-btn" onClick={() => setIsOpen(false)} aria-label="Close Simulation Deck">
              <X size={16} />
            </button>
          </div>

          <p className="sim-desc">
            Trigger operations events below to test how the React state and visual interfaces update in real-time.
          </p>

          <div className="sim-actions-list">
            {/* Action 1: Trigger Security Exploit */}
            <div className="sim-action-card">
              <div className="sim-card-info">
                <h3>Trigger Security Exploit</h3>
                <p>Simulates a critical file path access attempt. Triggers a red intrusion banner and injects a blocked query in the feed.</p>
              </div>
              <button onClick={onTriggerJackpot} className="btn btn-primary btn-sim-action">
                <Zap size={14} /> Exploit
              </button>
            </div>

            {/* Action 2: Simulate DDoS Attack */}
            <div className="sim-action-card">
              <div className="sim-card-info">
                <h3>Simulate DDoS Attack</h3>
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

            {/* Action 3: Inject Threat Alert */}
            <div className="sim-action-card">
              <div className="sim-card-info">
                <h3>Inject Threat Alert</h3>
                <p>Injects a new High-Risk port scan or SQL injection alert. Spikes alert badge count instantly.</p>
              </div>
              <button onClick={onInjectFraud} className="btn btn-secondary btn-sim-action text-warning">
                <ShieldAlert size={14} /> Inject Threat
              </button>
            </div>

            {/* Action 4: Freeze Live Traffic */}
            <div className="sim-action-card">
              <div className="sim-card-info">
                <h3>Live Traffic Stream</h3>
                <p>Pause or play the background packet logs generated every 3 seconds.</p>
              </div>
              <button 
                onClick={() => setIsFeedFrozen(!isFeedFrozen)} 
                className="btn btn-secondary btn-sim-action"
              >
                {isFeedFrozen ? <Play size={14} /> : <Pause size={14} />}
                {isFeedFrozen ? 'Resume Traffic' : 'Pause Traffic'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
