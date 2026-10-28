import type { IncidentLog, RiskLevel } from '../../types/analytics';

interface IncidentTableProps {
  incidents: IncidentLog[];
  selectedIncident: IncidentLog | null;
  onSelectIncident: (inc: IncidentLog | null) => void;
  getRiskColor: (risk: RiskLevel) => string;
}

export default function IncidentTable({
  incidents,
  selectedIncident,
  onSelectIncident,
  getRiskColor
}: IncidentTableProps) {
  return (
    <div className="threat-table-responsive">
      <table className="threat-table">
        <thead>
          <tr>
            <th>Incident ID</th>
            <th>Source IP</th>
            <th className="threat-col-optional">Endpoint / Service</th>
            <th className="threat-col-optional">HTTP Status</th>
            <th>Severity</th>
            <th className="threat-col-optional">Reason</th>
            <th className="threat-col-optional">Latency</th>
            <th>Timestamp</th>
            <th>Status</th>
            <th className="threat-col-optional">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.length > 0 ? (
            incidents.map((inc) => (
              <tr
                key={inc.id}
                className={`threat-row ${selectedIncident && selectedIncident.id === inc.id ? 'active' : ''}`}
                onClick={() => onSelectIncident(selectedIncident?.id === inc.id ? null : inc)}
              >
                <td className="font-mono text-muted">{inc.id}</td>
                <td className="font-mono font-medium">{inc.sourceIp}</td>
                <td className="text-muted font-mono threat-col-optional">{inc.endpoint || inc.targetService}</td>
                <td className="threat-col-optional font-mono">
                  {inc.httpStatus ? (
                    <span className={`status-pill ${inc.httpStatus >= 500 ? 'blocked' : 'allowed'}`}>
                      {inc.httpStatus}
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${getRiskColor(inc.risk)}`}>
                    {inc.risk.toUpperCase()}
                  </span>
                </td>
                <td className="threat-reason-cell threat-col-optional" title={inc.reason}>
                  {inc.reason}
                </td>
                <td className="font-mono text-muted threat-col-optional">
                  {inc.latencyMs ? `${inc.latencyMs}ms` : inc.payloadSize}
                </td>
                <td className="text-muted">{inc.timestamp}</td>
                <td>
                  <span className={`status-pill status-${inc.status}`}>
                    {inc.status}
                  </span>
                </td>
                <td className="threat-col-optional" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectIncident(selectedIncident?.id === inc.id ? null : inc)}
                    className="btn btn-xs btn-secondary"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="empty-table-state">
                No security incidents match the active filter criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
