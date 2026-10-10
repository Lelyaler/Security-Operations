import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TrendingUp, TrendingDown, Users, Activity, ShieldAlert, AlertCircle, Play, Pause } from 'lucide-react';
import { kpiStats, revenueHistory, playerDistribution, liveGamesList } from '../utils/mockData';

const NetworkTrafficChart = lazy(() => import('./NetworkTrafficChart'));
const ProtocolDistributionChart = lazy(() => import('./ProtocolDistributionChart'));

export default function DashboardView({ liveBets, setLiveBets, isFeedFrozen, isDdosActive, alertsCount = 0 }) {
  const [streamSpeed, setStreamSpeed] = useState(1);
  const [trafficFilter, setTrafficFilter] = useState('all');

  useEffect(() => {
    if (isFeedFrozen || streamSpeed === 0) return;

    const intervalTime = Math.max(400, Math.round(3000 / streamSpeed));
    const interval = setInterval(() => {
      const isSuccess = Math.random() > 0.15;
      const bytes = Math.floor(Math.random() * 1400) + 64;
      const ports = [443, 80, 22, 8080, 3306, 5432];
      const port = ports[Math.floor(Math.random() * ports.length)];
      
      const statusText = isSuccess ? "200 OK" : ["403 Blocked", "401 Unauthorized", "502 Bad Gateway"][Math.floor(Math.random() * 3)];
      
      const newPacket = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        player: `185.90.11.${Math.floor(Math.random() * 240) + 10}`,
        game: liveGamesList[Math.floor(Math.random() * liveGamesList.length)],
        amount: bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`,
        multiplier: `${port}`,
        win: statusText,
        type: isSuccess ? 'win' : 'loss'
      };

      setLiveBets(prev => [newPacket, ...prev.slice(0, 5)]);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isFeedFrozen, streamSpeed, setLiveBets]);

  const filteredBets = liveBets.filter((bet) => {
    if (trafficFilter === 'blocked') return bet.type === 'loss';
    if (trafficFilter === 'allowed') return bet.type === 'win';
    return true;
  });

  return (
    <div className="dashboard-view animate-fade-in">
      <div className="kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Network Packets</span>
            <Activity className="kpi-icon text-muted" size={18} />
          </div>
          <div className="kpi-value">{kpiStats.ggr.value}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              <TrendingUp size={12} /> {kpiStats.ggr.change}
            </span>
            <span className="trend-label">vs last week</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Blocked Threats</span>
            <ShieldAlert className="kpi-icon text-muted" size={18} />
          </div>
          <div className="kpi-value">{kpiStats.ngr.value}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              <TrendingUp size={12} /> {kpiStats.ngr.change}
            </span>
            <span className="trend-label">vs last week</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Sockets</span>
            <Users className="kpi-icon text-muted" size={18} />
          </div>
          <div className="kpi-value">{isDdosActive ? '1,842' : kpiStats.activePlayers.value}</div>
          <div className="kpi-footer">
            <span className={isDdosActive ? 'trend-badge negative' : 'trend-badge positive'}>
              {isDdosActive ? <TrendingDown size={12} /> : <TrendingUp size={12} />} {isDdosActive ? '-43.9%' : kpiStats.activePlayers.change}
            </span>
            <span className="trend-label">vs yesterday</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Intrusion Alerts (IDS)</span>
            <AlertCircle className="kpi-icon text-muted" size={18} />
          </div>
          <div className="kpi-value">{alertsCount}</div>
          <div className="kpi-footer">
            <span className="trend-badge negative">
              {isDdosActive ? 'CRITICAL' : kpiStats.pendingAlerts.change}
            </span>
            <span className="trend-label">active alerts</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content-layout">
        <div className="card main-chart-card">
          <h2 className="card-heading">Network Traffic vs Blocked Threats</h2>
          <div className="chart-wrapper">
            <Suspense fallback={<div className="chart-placeholder" style={{ height: 320 }} />}>
              <NetworkTrafficChart data={revenueHistory} />
            </Suspense>
          </div>
        </div>

        <div className="card live-feed-card">
          <div className="live-feed-header">
            <div className="live-pulse-container">
              <span className={`live-dot ${streamSpeed === 0 ? 'paused' : ''}`}></span>
              <h2 className="card-heading">Live Network Traffic</h2>
            </div>
            
            <div className="feed-controls-group">
              <div className="speed-buttons-wrap">
                <button
                  type="button"
                  title={streamSpeed === 0 ? 'Resume stream' : 'Pause stream'}
                  onClick={() => setStreamSpeed(streamSpeed === 0 ? 1 : 0)}
                  className={`btn-stream-toggle ${streamSpeed === 0 ? 'paused' : ''}`}
                >
                  {streamSpeed === 0 ? <Play size={10} /> : <Pause size={10} />}
                  <span>{streamSpeed === 0 ? 'Paused' : 'Live'}</span>
                </button>
                {[1, 2, 5].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setStreamSpeed(speed)}
                    className={`btn-speed-select ${streamSpeed === speed ? 'active' : ''}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <select
                aria-label="Filter traffic logs"
                value={trafficFilter}
                onChange={(e) => setTrafficFilter(e.target.value)}
                className="traffic-filter-select"
              >
                <option value="all">All Traffic</option>
                <option value="allowed">Allowed (200)</option>
                <option value="blocked">Blocked (403/401)</option>
              </select>
            </div>
          </div>

          <div className="live-bets-container">
            {filteredBets.length === 0 ? (
              <div className="empty-feed-state">
                No packets matching current filter
              </div>
            ) : (
              filteredBets.map((bet) => (
                <div key={bet.id} className={`live-bet-row ${bet.type}`}>
                  <div className="bet-row-left">
                    <span className="bet-player">{bet.player}</span>
                    <span className="bet-game text-muted">{bet.game}</span>
                  </div>
                  <div className="bet-row-center">
                    <span className="bet-amount">{bet.amount}</span>
                    <span className="bet-port-badge">Port {bet.multiplier}</span>
                  </div>
                  <div className="bet-row-right">
                    <span className={`bet-win ${bet.type === 'win' ? 'text-success' : 'text-danger'}`}>
                      {bet.win}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="secondary-metrics-layout">
        <div className="card dist-chart-card">
          <h2 className="card-heading">Active Sockets by Protocol</h2>
          <div className="chart-wrapper">
            <Suspense fallback={<div className="chart-placeholder" style={{ height: 240 }} />}>
              <ProtocolDistributionChart data={playerDistribution} />
            </Suspense>
          </div>
        </div>

        <div className="card system-logs-card">
          <h2 className="card-heading">Security Audit Log</h2>
          <div className="logs-container">
            {isDdosActive && (
              <div className="log-item log-danger">
                <span className="log-time">[CRITICAL]</span>
                <span className="log-text text-danger">DDoS Anomaly detected (1.2M pps on EU-WEST-1). Dynamic firewall rules engaged.</span>
              </div>
            )}
            <div className="log-item">
              <span className="log-time">[14:38:12]</span>
              <span className="log-text">GeoIP rule update applied: 14 subnets added to perimeter blocklist.</span>
            </div>
            <div className="log-item">
              <span className="log-time">[14:29:45]</span>
              <span className="log-text text-warning">Anomaly detection matched signature on /api/v1/auth/login.</span>
            </div>
            <div className="log-item">
              <span className="log-time">[14:15:30]</span>
              <span className="log-text">SHA256 binary validation passed across cluster nodes.</span>
            </div>
            <div className="log-item">
              <span className="log-time">[13:58:02]</span>
              <span className="log-text text-success">Perimeter scan completed. No unexpected open ports discovered.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
