import React, { useEffect, lazy, Suspense } from 'react';
import { TrendingUp, TrendingDown, Users, Activity, ShieldAlert, AlertCircle } from 'lucide-react';
import { kpiStats, revenueHistory, playerDistribution, liveGamesList } from '../utils/mockData';

const NetworkTrafficChart = lazy(() => import('./NetworkTrafficChart'));
const ProtocolDistributionChart = lazy(() => import('./ProtocolDistributionChart'));

export default function DashboardView({ liveBets, setLiveBets, isFeedFrozen, isDdosActive, alertsCount }) {
  // Live simulation of network sockets and traffic
  useEffect(() => {
    if (isFeedFrozen) return;

    const interval = setInterval(() => {
      const isSuccess = Math.random() > 0.15;
      const bytes = Math.floor(Math.random() * 1400) + 64;
      const ports = [443, 80, 22, 8080, 3306, 5432];
      const port = ports[Math.floor(Math.random() * ports.length)];
      
      const statusText = isSuccess ? "200 OK" : ["403 Blocked", "401 Unauthorized", "502 Bad Gateway"][Math.floor(Math.random() * 3)];
      
      const newBet = {
        id: Date.now(),
        player: `185.90.11.${Math.floor(Math.random() * 240) + 10}`,
        game: liveGamesList[Math.floor(Math.random() * liveGamesList.length)],
        amount: bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`,
        multiplier: `${port}`,
        win: statusText,
        type: isSuccess ? 'win' : 'loss'
      };

      setLiveBets(prev => [newBet, ...prev.slice(0, 4)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isFeedFrozen, setLiveBets]);

  return (
    <div className="dashboard-view animate-fade-in">
      {/* KPI Stats Grid */}
      <div className="kpi-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Network Packets</span>
            <Activity className="kpi-icon text-primary" size={20} />
          </div>
          <div className="kpi-value">{kpiStats.ggr.value}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              <TrendingUp size={12} /> {kpiStats.ggr.change}
            </span>
            <span className="trend-label">vs last week</span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Blocked Threats</span>
            <ShieldAlert className="kpi-icon text-secondary" size={20} />
          </div>
          <div className="kpi-value">{kpiStats.ngr.value}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              <TrendingUp size={12} /> {kpiStats.ngr.change}
            </span>
            <span className="trend-label">vs last week</span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Sockets</span>
            <Users className="kpi-icon text-accent" size={20} />
          </div>
          <div className="kpi-value">{isDdosActive ? '1,842' : kpiStats.activePlayers.value}</div>
          <div className="kpi-footer">
            <span className={isDdosActive ? 'trend-badge negative' : 'trend-badge positive'}>
              {isDdosActive ? <TrendingDown size={12} /> : <TrendingUp size={12} />} {isDdosActive ? '-43.9%' : kpiStats.activePlayers.change}
            </span>
            <span className="trend-label">vs yesterday</span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Intrusion Alerts (IDS)</span>
            <AlertCircle className="kpi-icon text-danger" size={20} />
          </div>
          <div className="kpi-value text-danger">{alertsCount}</div>
          <div className="kpi-footer">
            <span className="trend-badge negative">
              {isDdosActive ? 'CRITICAL' : kpiStats.pendingAlerts.change}
            </span>
            <span className="trend-label">unresolved threat files</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Live Feed Section */}
      <div className="dashboard-content-layout">
        {/* Analytics Chart */}
        <div className="glass-card main-chart-card">
          <h2 className="card-heading">Network Traffic vs Blocked Threats</h2>
          <div className="chart-wrapper">
            <Suspense fallback={<div className="chart-placeholder" style={{ height: 320 }} />}>
              <NetworkTrafficChart data={revenueHistory} />
            </Suspense>
          </div>
        </div>

        {/* Live Feed Panel */}
        <div className="glass-card live-feed-card">
          <div className="live-feed-header">
            <div className="live-pulse-container">
              <span className="live-dot pulse-primary"></span>
              <h2 className="card-heading">Live Network Traffic Logs</h2>
            </div>
            <span className="badge badge-success">Simulated Feed</span>
          </div>

          <div className="live-bets-container">
            {liveBets.map((bet) => (
              <div key={bet.id} className={`live-bet-row ${bet.type} animate-slide-in`}>
                <div className="bet-row-left">
                  <span className="bet-player">{bet.player}</span>
                  <span className="bet-game text-muted">{bet.game}</span>
                </div>
                <div className="bet-row-center">
                  <span className="bet-amount">{bet.amount}</span>
                  <span className="bet-multiplier badge">Port {bet.multiplier}</span>
                </div>
                <div className="bet-row-right">
                  <span className={`bet-win ${bet.type === 'win' ? 'text-success' : 'text-danger font-bold'}`}>
                    {bet.win}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Metrics Section */}
      <div className="secondary-metrics-layout">
        {/* Game Distribution Chart */}
        <div className="glass-card dist-chart-card">
          <h2 className="card-heading">Active Sockets by Protocol</h2>
          <div className="chart-wrapper">
            <Suspense fallback={<div className="chart-placeholder" style={{ height: 240 }} />}>
              <ProtocolDistributionChart data={playerDistribution} />
            </Suspense>
          </div>
        </div>

        {/* System Operations Logs */}
        <div className="glass-card system-logs-card">
          <h2 className="card-heading">Security Operations Audit Log</h2>
          <div className="logs-container">
            {isDdosActive && (
              <div className="log-item animate-pulse" style={{ borderLeftColor: 'var(--danger)' }}>
                <span className="log-time">[WARNING]</span>
                <span className="log-text text-danger">🚨 DDoS EXPLOIT: Anomaly (1.2M pps) detected on EU-WEST-1. Firewalls active.</span>
              </div>
            )}
            <div className="log-item">
              <span className="log-time">[14:38:12]</span>
              <span className="log-text">GeoIP database updated. Added <strong>14 new firewall rule blocks</strong>.</span>
            </div>
            <div className="log-item">
              <span className="log-time">[14:29:45]</span>
              <span className="log-text text-warning">Threat Intelligence: Pattern match on file access attempt by guest.</span>
            </div>
            <div className="log-item">
              <span className="log-time">[14:15:30]</span>
              <span className="log-text">Integrity Scan: System binary check completed. Hash match <strong>100% (Healthy)</strong>.</span>
            </div>
            <div className="log-item">
              <span className="log-time">[13:58:02]</span>
              <span className="log-text text-success">Network perimeter check completed. No open SSH ports found.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
