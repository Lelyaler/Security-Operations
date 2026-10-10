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
  onTriggerBreach = onTriggerJackpot,
  onInjectFraud
}) {
  const handleTriggerBreach = onTriggerBreach || onTriggerJackpot;

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="simulator-toggle-btn"
        title="Open Simulation Controller"
      >
        <Sliders size={15} />
        <span>Simulations</span>
      </button>

      {isOpen && (
        <div className="simulator-drawer card animate-slide-left">
          <div className="simulator-header">
            <div className="sim-title">
              <Sliders size={16} className="text-muted" />
              <h2>Event Simulator</h2>
            </div>
            <button className="sim-close-btn" onClick={() => setIsOpen(false)} aria-label="Close Simulation Deck">
              <X size={16} />
            </button>
          </div>

          <p className="sim-desc">
            Simulate operational security events to test monitoring telemetry and interface state in real-time.
          </p>

          <div className="sim-actions-list">
            <div className="sim-action-card">
              <div className="sim-card-info">
                <h3>Trigger Root Exploit</h3>
                <p>Simulates an unauthorized file access attempt with security banner alert and traffic log injection.</p>
              </div>
              <button onClick={handleTriggerBreach} className="btn btn-primary btn-sim-action">
                <Zap size={14} /> Inject Exploit
              </button>
            </div>

            <div className="sim-action-card">
              <div className="sim-card-info">
                <h3>Simulate DDoS Attack</h3>
                <p>Toggles DDoS state: spikes network latency, changes node status to critical, and alters active sockets.</p>
              </div>
              <button 
                onClick={() => setIsDdosActive(!isDdosActive)} 
                className={`btn btn-sim-action ${isDdosActive ? 'btn-danger' : 'btn-secondary'}`}
              >
                <AlertTriangle size={14} />
                {isDdosActive ? 'Stop Attack' : 'Simulate Attack'}
              </button>
            </div>

            <div className="sim-action-card">
              <div className="sim-card-info">
                <h3>Inject Threat Alert</h3>
                <p>Generates an IDS intrusion alert with elevated risk level and increments the unread badge counter.</p>
              </div>
              <button onClick={onInjectFraud} className="btn btn-secondary btn-sim-action">
                <ShieldAlert size={14} /> Generate Alert
              </button>
            </div>

            <div className="sim-action-card">
              <div className="sim-card-info">
                <h3>Live Traffic Feed</h3>
                <p>Pause or resume the incoming synthetic socket packet stream.</p>
              </div>
              <button 
                onClick={() => setIsFeedFrozen(!isFeedFrozen)} 
                className="btn btn-secondary btn-sim-action"
              >
                {isFeedFrozen ? <Play size={14} /> : <Pause size={14} />}
                {isFeedFrozen ? 'Resume Stream' : 'Pause Stream'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
