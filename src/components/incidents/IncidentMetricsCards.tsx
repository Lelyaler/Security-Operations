import { AlertOctagon, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { IncidentLog } from '../../types/analytics';

interface IncidentMetricsCardsProps {
  incidents: IncidentLog[];
}

export default function IncidentMetricsCards({ incidents }: IncidentMetricsCardsProps) {
  const highRiskCount = incidents.filter(
    (a) => (a.risk === 'high' || a.risk === 'critical') && a.status !== 'resolved'
  ).length;

  const investigatingCount = incidents.filter((a) => a.status === 'investigating').length;
  const resolvedCount = incidents.filter((a) => a.status === 'resolved').length;

  return (
    <div className="threat-summary-grid">
      <div className="card summary-card danger">
        <AlertOctagon size={22} className="text-danger" />
        <div className="summary-info">
          <span className="summary-val font-mono">{highRiskCount}</span>
          <span className="summary-label">High-Risk Incidents</span>
        </div>
      </div>

      <div className="card summary-card warning">
        <ShieldAlert size={22} className="text-warning" />
        <div className="summary-info">
          <span className="summary-val font-mono">{investigatingCount}</span>
          <span className="summary-label">Under Investigation</span>
        </div>
      </div>

      <div className="card summary-card success">
        <ShieldCheck size={22} className="text-success" />
        <div className="summary-info">
          <span className="summary-val font-mono">{resolvedCount}</span>
          <span className="summary-label">Resolved Events</span>
        </div>
      </div>
    </div>
  );
}
