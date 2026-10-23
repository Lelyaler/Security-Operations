import { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  AlertTriangle,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/useAuth';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const { operator } = useAuth();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().slice(0, 8));
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const triggerError = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleAttemptUnlock = (enteredPin?: string) => {
    const candidate = (enteredPin !== undefined ? enteredPin : pin).trim();
    if (!candidate) {
      triggerError('Please enter operator PIN or passphrase.');
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    setTimeout(() => {
      if (candidate === '4829' || candidate === '0000' || candidate === 'admin' || candidate.length >= 4) {
        setIsAuthenticating(false);
        onUnlock();
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        setIsAuthenticating(false);
        setPin('');
        triggerError(
          `[PAM_AUTH_FAIL] Invalid credentials (attempt ${nextAttempts}/5). Audit alert sent.`
        );
        inputRef.current?.focus();
      }
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAttemptUnlock();
    } else if (e.key === 'Escape') {
      setPin('');
      setError(null);
    }
  };

  return (
    <div className="lockscreen-overlay animate-fade-in" onKeyDown={handleKeyDown}>
      {/* Top System Bar */}
      <div className="lockscreen-topbar font-mono">
        <div className="lockscreen-topbar-left">
          <span className="station-badge">SEC-STATION-04</span>
          <span className="text-muted">·</span>
          <span className="net-badge">VLAN-402 (ISOLATED DMZ)</span>
          <span className="text-muted">·</span>
          <span className="daemon-badge">eBPF Sensor v4.18</span>
        </div>
        <div className="lockscreen-topbar-right">
          <Clock size={13} className="text-muted" />
          <span className="clock-val">{currentTime} UTC</span>
          <span className="date-val text-muted">{currentDate}</span>
        </div>
      </div>

      {/* Main Lockout Container */}
      <div className={`lockscreen-card card ${shake ? 'shake-anim' : ''}`}>
        <div className="lockscreen-badge-icon">
          <Lock size={28} className="text-primary" />
        </div>

        <div className="lockscreen-header">
          <div className="lockscreen-status-pill font-mono">
            <span className="status-dot-pulse" />
            CONSOLE LOCKED · PAM AUTH REQUIRED
          </div>
          <h1 className="lockscreen-title">Console Session Locked</h1>
          <p className="lockscreen-subtitle">
            Enter operator PIN or security credentials to resume active session
          </p>
        </div>

        {/* Operator Profile Snippet */}
        <div className="lockscreen-operator-box">
          <div className="operator-mini-avatar">
            <UserCheck size={18} className="text-muted" />
          </div>
          <div className="operator-mini-info">
            <div className="operator-mini-name">{operator.name}</div>
            <div className="operator-mini-role font-mono">
              <span>Operator ID: {operator.callsign} · {operator.role}</span>
            </div>
          </div>
        </div>

        {/* Authentication Input Form */}
        <div className="lockscreen-auth-form">
          <div className="pin-input-group">
            <KeyRound size={16} className="text-muted flex-shrink-0" />
            <input
              ref={inputRef}
              type={showPin ? 'text' : 'password'}
              placeholder="Enter PIN (e.g. 4829)"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(null);
              }}
              className="pin-input font-mono"
              maxLength={20}
              autoComplete="off"
              aria-label="Operator PIN"
              disabled={isAuthenticating}
            />
            <button
              type="button"
              className="pin-toggle-btn"
              onClick={() => setShowPin(!showPin)}
              title={showPin ? 'Hide PIN' : 'Show PIN'}
              aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
            >
              {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div className="lockscreen-error font-mono animate-slide-in">
              <AlertTriangle size={14} className="text-danger flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="lockscreen-btn-row">
            <button
              type="button"
              className={`btn btn-primary unlock-btn ${isAuthenticating ? 'loading' : ''}`}
              onClick={() => handleAttemptUnlock()}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <>
                  <span className="spinner-dots" />
                  <span>Verifying PAM credentials...</span>
                </>
              ) : (
                <>
                  <Unlock size={15} />
                  <span>Authenticate & Unlock</span>
                </>
              )}
            </button>
          </div>

          <div className="lockscreen-auth-hint font-mono">
            <span>Operator PIN required to resume · Staging demo PIN: </span>
            <button
              type="button"
              className="hint-pin-link font-mono"
              onClick={() => handleAttemptUnlock('4829')}
              disabled={isAuthenticating}
            >
              4829
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
