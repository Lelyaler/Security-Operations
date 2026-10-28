import { TrendingUp, TrendingDown, Activity, ShieldAlert, Users, AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { kpiStats } from '../../utils/mockData';

interface Kpi {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  goodWhenDown?: boolean;
  note: string;
}

interface KpiGridProps {
  openIncidents: number;
}

export default function KpiGrid({ openIncidents }: KpiGridProps) {
  const kpis: Kpi[] = [
    { label: 'Requests', value: kpiStats.requests.value, change: kpiStats.requests.change, icon: Activity, note: 'vs last week' },
    { label: 'Rejected (4xx/5xx)', value: kpiStats.rejected.value, change: kpiStats.rejected.change, goodWhenDown: true, icon: ShieldAlert, note: 'vs last week' },
    { label: 'Active sockets', value: kpiStats.sockets.value, change: kpiStats.sockets.change, icon: Users, note: 'vs yesterday' },
    { label: 'Open incidents', value: openIncidents, icon: AlertCircle, note: 'need triage' }
  ];

  return (
    <div className="kpi-grid">
      {kpis.map(({ label, value, change, goodWhenDown, icon: Icon, note }) => {
        const down = change?.startsWith('-');
        const good = down === Boolean(goodWhenDown);
        return (
          <div key={label} className="card kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">{label}</span>
              <Icon className="text-muted" size={16} />
            </div>
            <div className="kpi-value font-mono">{value}</div>
            <div className="kpi-footer">
              {change && (
                <span className={`trend ${good ? 'trend-good' : 'trend-bad'}`}>
                  {down ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  {change}
                </span>
              )}
              <span>{note}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
