import { useState, useEffect, useCallback } from 'react';
import type { SecurityIncident, IncidentStatus } from '../types/security';
import { mockSecurityIncidents } from '../utils/mockData';
import {
  loadPersistedIncidents,
  savePersistedIncidents,
  clearPersistedData
} from '../utils/securityHelpers';

const INCIDENT_SCENARIOS = [
  {
    reason: 'Port scan sweep detected: 50+ probes/sec across perimeter',
    mitre: { id: 'T1046', name: 'Network Service Discovery', tactic: 'Discovery' },
    cve: 'CVE-2025-7821',
    service: 'edge-waf-ingress.us.sec',
    port: 443,
    proto: 'TCP'
  },
  {
    reason: 'Credential stuffing: 4 failed OAuth token validations',
    mitre: { id: 'T1110.004', name: 'Credential Stuffing', tactic: 'Credential Access' },
    cve: 'CVE-2025-2411',
    service: 'auth-node-01.eu.sec',
    port: 443,
    proto: 'HTTPS'
  },
  {
    reason: 'Geo-IP mismatch: Suspicious routing across non-standard ASN',
    mitre: { id: 'T1550', name: 'Use Alternate Authentication Material', tactic: 'Defense Evasion' },
    cve: 'CVE-2025-1082',
    service: 'billing-service.eu.sec',
    port: 8443,
    proto: 'HTTPS'
  },
  {
    reason: 'Remote code execution payload blocked in HTTP Authorization header',
    mitre: { id: 'T1059.004', name: 'Unix Shell', tactic: 'Execution' },
    cve: 'CVE-2026-1142',
    service: 'api-gw-alpha.us.sec',
    port: 443,
    proto: 'HTTPS'
  }
];

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

  const injectSyntheticIncident = useCallback(() => {
    const pick = INCIDENT_SCENARIOS[Math.floor(Math.random() * INCIDENT_SCENARIOS.length)];
    const randomIp = `194.26.${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 240 + 10)}`;
    const newId = `SEC-${Math.floor(Math.random() * 9000) + 1000}`;

    const newIncident: SecurityIncident = {
      id: newId,
      sourceIp: randomIp,
      targetService: pick.service,
      risk: 'high',
      reason: pick.reason,
      payloadSize: `${(Math.random() * 15 + 2).toFixed(1)} MB`,
      timestamp: 'Just now',
      status: 'pending',
      cve: pick.cve,
      mitre: pick.mitre,
      destinationPort: pick.port,
      protocol: pick.proto,
      sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      rawEvent: `CEF:0|SecureNode|Sensor|3.4|9901|IDS_INTRUSION_ALERT|8|src=${randomIp} dst=${pick.service} dpt=${pick.port} proto=${pick.proto} cs1Label=CVE cs1=${pick.cve} cs2Label=Mitre cs2=${pick.mitre.id} msg="${pick.reason}"`
    };

    setIncidents((prev) => [newIncident, ...prev]);
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
    injectSyntheticIncident,
    resetToDefaults,
    unresolvedCount
  };
}
