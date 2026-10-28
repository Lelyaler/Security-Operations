import { Search, RefreshCw, Download } from 'lucide-react';
import type { RiskLevel, IncidentStatus } from '../../types/analytics';

interface IncidentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  riskFilter: RiskLevel | 'all';
  onRiskChange: (risk: RiskLevel | 'all') => void;
  statusFilter: IncidentStatus | 'all';
  onStatusChange: (status: IncidentStatus | 'all') => void;
  onSyncCisa?: () => void;
  isSyncing?: boolean;
  onExportCsv?: () => void;
}

export default function IncidentFilters({
  searchTerm,
  onSearchChange,
  riskFilter,
  onRiskChange,
  statusFilter,
  onStatusChange,
  onSyncCisa,
  isSyncing = false,
  onExportCsv
}: IncidentFiltersProps) {
  return (
    <div className="threat-filters-row">
      <div className="search-bar threat-search-bar">
        <Search size={14} className="text-muted" />
        <input
          type="text"
          placeholder="Filter by IP, endpoint, status code or reason..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Filter incidents by query"
        />
      </div>

      <select
        value={riskFilter}
        onChange={(e) => onRiskChange(e.target.value as RiskLevel | 'all')}
        className="threat-select"
        aria-label="Filter by Risk"
      >
        <option value="all">All Severities</option>
        <option value="high">High & Critical</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as IncidentStatus | 'all')}
        className="threat-select"
        aria-label="Filter by Status"
      >
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="investigating">Investigating</option>
        <option value="resolved">Resolved</option>
      </select>

      {onSyncCisa && (
        <button
          type="button"
          onClick={onSyncCisa}
          disabled={isSyncing}
          className="btn btn-secondary btn-sm font-mono"
          title="Fetch live exploited CVE records from CISA feed"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
          <span>{isSyncing ? 'Syncing...' : 'CISA Feed'}</span>
        </button>
      )}

      {onExportCsv && (
        <button
          type="button"
          onClick={onExportCsv}
          className="btn btn-secondary btn-sm font-mono"
          title="Export current filtered view to CSV file"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
        >
          <Download size={13} />
          <span>Export CSV</span>
        </button>
      )}
    </div>
  );
}
