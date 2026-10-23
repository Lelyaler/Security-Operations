import { useState, useEffect, useCallback } from 'react';
import type { SecurityIncident, IncidentStatus } from '../types/security';
import { mockSecurityIncidents } from '../utils/mockData';
import {
  loadPersistedIncidents,
  savePersistedIncidents,
  clearPersistedData
} from '../utils/securityHelpers';

export function useIncidents() {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(() =>
    loadPersistedIncidents(mockSecurityIncidents)
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
    setIncidents(mockSecurityIncidents);
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
