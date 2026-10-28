import { useState, useEffect, useCallback } from 'react';
import type { IncidentLog, IncidentStatus } from '../types/analytics';
import { mockIncidentLogs } from '../utils/mockData';
import {
  loadPersistedIncidents,
  savePersistedIncidents,
  clearPersistedData
} from '../utils/analyticsHelpers';

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentLog[]>(() =>
    loadPersistedIncidents(mockIncidentLogs)
  );

  useEffect(() => {
    savePersistedIncidents(incidents);
  }, [incidents]);

  const updateIncidentStatus = useCallback((id: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    clearPersistedData();
    setIncidents(mockIncidentLogs);
  }, []);

  const unresolvedCount = incidents.filter((item) => item.status !== 'resolved').length;

  return {
    incidents,
    setIncidents,
    updateIncidentStatus,
    resetToDefaults,
    unresolvedCount
  };
}
