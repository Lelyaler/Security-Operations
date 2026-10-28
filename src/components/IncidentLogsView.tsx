import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { Check } from 'lucide-react';
import { filterIncidents } from '../utils/analyticsHelpers';
import { fetchCisaIncidents } from '../services/liveThreatFeed';
import type { IncidentLog, RiskLevel, IncidentStatus } from '../types/analytics';

import IncidentMetricsCards from './incidents/IncidentMetricsCards';
import IncidentFilters from './incidents/IncidentFilters';
import IncidentTable from './incidents/IncidentTable';
import IncidentPagination from './incidents/IncidentPagination';
import IncidentInspector from './incidents/IncidentInspector';

interface IncidentLogsViewProps {
  incidents: IncidentLog[];
  setIncidents: Dispatch<SetStateAction<IncidentLog[]>>;
  params?: Record<string, string>;
  onUpdateParams?: (newParams: Record<string, string | null>) => void;
}

export default function IncidentLogsView({
  incidents,
  setIncidents,
  params,
  onUpdateParams
}: IncidentLogsViewProps) {
  const [selectedIncident, setSelectedIncident] = useState<IncidentLog | null>(() => {
    if (params?.id) {
      return incidents.find((i) => i.id === params.id) || null;
    }
    return null;
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>(
    (params?.risk as RiskLevel) || 'all'
  );
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>(
    (params?.status as IncidentStatus) || 'all'
  );
  const [searchTerm, setSearchTerm] = useState(params?.q || '');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSyncingCisa, setIsSyncingCisa] = useState(false);

  useEffect(() => {
    onUpdateParams?.({
      q: searchTerm || null,
      risk: riskFilter === 'all' ? null : riskFilter,
      status: statusFilter === 'all' ? null : statusFilter
    });
  }, [searchTerm, riskFilter, statusFilter, onUpdateParams]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSelectIncident = (inc: IncidentLog | null) => {
    setSelectedIncident(inc);
    onUpdateParams?.({ id: inc ? inc.id : null });
  };

  const handleAction = (id: string, newStatus: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc))
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident((prev: IncidentLog | null) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleQuarantine = (incident: IncidentLog) => {
    handleAction(incident.id, 'resolved');
    handleSelectIncident(null);
    showNotification(`Host ${incident.sourceIp} rate-limited via edge firewall.`);
  };

  const handleSyncCisa = async () => {
    setIsSyncingCisa(true);
    const cisaItems = await fetchCisaIncidents();
    setIsSyncingCisa(false);

    if (cisaItems.length > 0) {
      setIncidents((prev: IncidentLog[]) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const newItems = cisaItems.filter((i: IncidentLog) => !existingIds.has(i.id));
        return [...newItems, ...prev];
      });
      showNotification(`Synchronized ${cisaItems.length} records from CISA KEV feed.`);
    } else {
      showNotification('Unable to sync CISA feed (check network connection).');
    }
  };

  const handleExportCsv = () => {
    const data = filteredIncidents.length > 0 ? filteredIncidents : incidents;
    const headers = ['id', 'timestamp', 'risk', 'status', 'sourceIp', 'targetService', 'reason', 'httpStatus', 'endpoint'];
    const rows = data.map((inc) =>
      headers.map((key) => JSON.stringify((inc as unknown as Record<string, unknown>)[key] ?? '')).join(',')
    );
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidents_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(`Exported ${data.length} records to CSV.`);
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
      case 'high':
        return 'badge-danger';
      case 'medium':
        return 'badge-warning';
      default:
        return 'badge-success';
    }
  };

  const filteredIncidents = filterIncidents(incidents, riskFilter, statusFilter, searchTerm);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, riskFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredIncidents.length);
  const paginatedIncidents = filteredIncidents.slice(startIndex, endIndex);

  return (
    <div className="threat-view animate-fade-in">
      {notification && (
        <div className="threat-notification animate-slide-in">
          <Check size={16} className="text-success" />
          <span>{notification}</span>
          <button className="dismiss-alert-btn" onClick={() => setNotification(null)}>Dismiss</button>
        </div>
      )}

      <IncidentMetricsCards incidents={incidents} />

      <div className={`threat-content-layout ${selectedIncident ? 'has-inspector' : ''}`}>
        <div className="threat-table-card card">
          <div className="threat-table-header">
            <div>
              <h2 className="card-heading">API Incidents & Threat Telemetry</h2>
              <p className="card-subheading">Active anomalous events, rate-limiting triggers, and CISA security advisories</p>
            </div>

            <IncidentFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              riskFilter={riskFilter}
              onRiskChange={setRiskFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              onSyncCisa={handleSyncCisa}
              isSyncing={isSyncingCisa}
              onExportCsv={handleExportCsv}
            />
          </div>

          <IncidentTable
            incidents={paginatedIncidents}
            selectedIncident={selectedIncident}
            onSelectIncident={handleSelectIncident}
            getRiskColor={getRiskColor}
          />

          {filteredIncidents.length > 0 && (
            <IncidentPagination
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={filteredIncidents.length}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {selectedIncident && (
          <IncidentInspector
            incident={selectedIncident}
            onClose={() => handleSelectIncident(null)}
            onUpdateStatus={handleAction}
            onQuarantine={handleQuarantine}
            getRiskColor={getRiskColor}
          />
        )}
      </div>
    </div>
  );
}
