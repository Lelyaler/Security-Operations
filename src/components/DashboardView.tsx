import { useState, useEffect, lazy, Suspense } from 'react';
import { TrendingUp, TrendingDown, Users, Activity, ShieldAlert, AlertCircle, Play, Pause } from 'lucide-react';
import { kpiStats, trafficHistory, protocolDistribution } from '../utils/mockData';
import { generateSyntheticPacket } from '../utils/securityHelpers';
import type { NetworkPacket } from '../types/security';

const NetworkTrafficChart = lazy(() => import('./NetworkTrafficChart'));
const ProtocolDistributionChart = lazy(() => import('./ProtocolDistributionChart'));

interface DashboardViewProps {
  livePackets: NetworkPacket[];
  setLivePackets: React.Dispatch<React.SetStateAction<NetworkPacket[]>>;
  isFeedFrozen: boolean;
  isDdosActive: boolean;
  alertsCount?: number;
}

export default function DashboardView({
  livePackets,
  setLivePackets,
  isFeedFrozen,
  isDdosActive,
  alertsCount = 0
}: DashboardViewProps) {
  const [streamSpeed, setStreamSpeed] = useState<number>(1);
  const [trafficFilter, setTrafficFilter] = useState<'all' | 'allowed' | 'blocked'>('all');

  useEffect(() => {
    if (isFeedFrozen || streamSpeed === 0) return;

    const intervalTime = Math.max(400, Math.round(3000 / streamSpeed));
    const interval = setInterval(() => {
      const newPacket = generateSyntheticPacket(
        `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        isDdosActive && Math.random() < 0.6
      );

      setLivePackets((prev) => [newPacket, ...prev.slice(0, 5)]);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isFeedFrozen, streamSpeed, setLivePackets, isDdosActive]);

  const filteredPackets = livePackets.filter((packet) => {
    if (trafficFilter === 'blocked') return packet.type === 'blocked';
    if (trafficFilter === 'allowed') return packet.type === 'allowed';
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
          <div className="kpi-value font-mono">{kpiStats.totalPackets.value}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              <TrendingUp size={12} /> {kpiStats.totalPackets.change}
            </span>
            <span className="trend-label">vs last week</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Blocked Threats</span>
            <ShieldAlert className="kpi-icon text-muted" size={18} />
          </div>
          <div className="kpi-value font-mono">{kpiStats.blockedThreats.value}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              <TrendingUp size={12} /> {kpiStats.blockedThreats.change}
            </span>
            <span className="trend-label">vs last week</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Sockets</span>
            <Users className="kpi-icon text-muted" size={18} />
          </div>
          <div className="kpi-value font-mono">{isDdosActive ? '1,842' : kpiStats.activeSockets.value}</div>
          <div className="kpi-footer">
            <span className={isDdosActive ? 'trend-badge negative' : 'trend-badge positive'}>
              {isDdosActive ? <TrendingDown size={12} /> : <TrendingUp size={12} />} {isDdosActive ? '-43.9%' : kpiStats.activeSockets.change}
            </span>
            <span className="trend-label">vs yesterday</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Intrusion Alerts (IDS)</span>
            <AlertCircle className="kpi-icon text-muted" size={18} />
          </div>
          <div className="kpi-value font-mono">{alertsCount}</div>
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
              <NetworkTrafficChart data={trafficHistory} />
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
                onChange={(e) => setTrafficFilter(e.target.value as 'all' | 'allowed' | 'blocked')}
                className="traffic-filter-select"
              >
                <option value="all">All Traffic</option>
                <option value="allowed">Allowed (200)</option>
                <option value="blocked">Blocked (403/401)</option>
              </select>
            </div>
          </div>

          <div className="live-packets-container">
            {filteredPackets.length === 0 ? (
              <div className="empty-feed-state">
                No packets matching current filter
              </div>
            ) : (
              filteredPackets.map((packet) => (
                <div key={packet.id} className={`live-packet-row ${packet.type}`}>
                  <div className="packet-row-left">
                    <span className="packet-ip font-mono">{packet.sourceIp}</span>
                    <span className="packet-endpoint text-muted font-mono">{packet.endpoint}</span>
                  </div>
                  <div className="packet-row-center">
                    <span className="packet-payload font-mono">{packet.payloadSize}</span>
                    <span className="packet-port-badge font-mono">Port {packet.port}</span>
                  </div>
                  <div className="packet-row-right">
                    <span className={`packet-status font-mono ${packet.type === 'allowed' ? 'text-success' : 'text-danger'}`}>
                      {packet.statusText}
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
              <ProtocolDistributionChart data={protocolDistribution} />
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
