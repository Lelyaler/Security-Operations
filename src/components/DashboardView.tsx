import { useEffect, useState, lazy, Suspense } from 'react';
import { protocolDistribution, latencyHistory, httpStatusDistribution, trafficHistory7d } from '../utils/mockData';
import { apiClient } from '../services/apiClient';
import type { TimeRange } from '../types/analytics';
import Panel from './Panel';
import ProtocolChart from './charts/ProtocolChart';
import KpiGrid from './dashboard/KpiGrid';
import LiveFeedTable from './dashboard/LiveFeedTable';

const TrafficChart = lazy(() => import('./charts/TrafficChart'));
const LatencyChart = lazy(() => import('./charts/LatencyChart'));
const StatusCodesChart = lazy(() => import('./charts/StatusCodesChart'));

const RANGES: TimeRange[] = ['24h', '7d', '30d'];

interface DashboardViewProps {
  openIncidents: number;
}

export default function DashboardView({ openIncidents }: DashboardViewProps) {
  const [range, setRange] = useState<TimeRange>('7d');
  const [traffic, setTraffic] = useState(trafficHistory7d);

  useEffect(() => {
    let active = true;
    apiClient.getTrafficMetrics(range).then((data) => active && setTraffic(data));
    return () => {
      active = false;
    };
  }, [range]);

  return (
    <div className="dashboard">
      <KpiGrid openIncidents={openIncidents} />

      <div className="dash-row dash-row-main">
        <Panel
          title="Traffic volume"
          subtitle="Requests and blocked requests per period"
          actions={
            <div className="segmented" role="group" aria-label="Time range">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={r === range ? 'active' : ''}
                  onClick={() => setRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          }
        >
          <div className="chart-box chart-box-lg">
            <Suspense fallback={<div className="chart-skeleton" />}>
              <TrafficChart data={traffic} />
            </Suspense>
          </div>
        </Panel>

        <Panel title="Response codes" subtitle="Share of all responses, 7 days">
          <Suspense fallback={<div className="chart-skeleton chart-skeleton-donut" />}>
            <StatusCodesChart data={httpStatusDistribution} />
          </Suspense>
        </Panel>
      </div>

      <div className="dash-row">
        <Panel title="Latency" subtitle="p50 / p95 / p99 over the last 24 hours">
          <div className="chart-box">
            <Suspense fallback={<div className="chart-skeleton" />}>
              <LatencyChart data={latencyHistory} />
            </Suspense>
          </div>
        </Panel>

        <Panel title="Connections by protocol" subtitle="Currently open sockets">
          <ProtocolChart data={protocolDistribution} />
        </Panel>
      </div>

      <LiveFeedTable />
    </div>
  );
}
