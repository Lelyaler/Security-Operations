import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import Panel from '../Panel';
import { formatClock } from '../../utils/analyticsHelpers';
import { useSettings } from '../../context/useSettings';
import { useLiveFeed } from '../../hooks/useLiveFeed';

type FeedFilter = 'all' | 'allowed' | 'blocked';
const FILTERS: FeedFilter[] = ['all', 'allowed', 'blocked'];

export default function LiveFeedTable() {
  const { preferences } = useSettings();
  const [filter, setFilter] = useState<FeedFilter>('all');
  const feed = useLiveFeed(preferences.refreshSeconds * 1000);

  const rows = filter === 'all' ? feed.packets : feed.packets.filter((p) => p.type === filter);

  return (
    <Panel
      title="Live requests"
      subtitle={`Edge gateway sample, every ${preferences.refreshSeconds}s`}
      className="feed-panel"
      actions={
        <>
          <div className="segmented" role="group" aria-label="Filter requests">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={f === filter ? 'active' : ''}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-secondary btn-xs" onClick={feed.togglePaused}>
            {feed.paused ? <Play size={12} /> : <Pause size={12} />}
            {feed.paused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" className="btn btn-secondary btn-xs" onClick={feed.clear}>
            Clear
          </button>
        </>
      }
    >
      <div className="feed-scroll">
        <table className="feed-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Method</th>
              <th>Source IP</th>
              <th>Endpoint</th>
              <th className="num">Size</th>
              <th className="num">Latency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-muted">{formatClock(p.receivedAt, preferences.clock)}</td>
                <td className="font-mono">{p.method}</td>
                <td className="font-mono">{p.sourceIp}</td>
                <td className="font-mono text-muted feed-endpoint">{p.endpoint}</td>
                <td className="font-mono text-muted num">{p.payloadSize}</td>
                <td className="font-mono text-muted num">{p.latencyMs} ms</td>
                <td>
                  <span className={`code-pill code-${p.type}`}>{p.statusText}</span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="feed-empty">
                  {feed.paused ? 'Stream paused.' : 'Waiting for traffic…'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
