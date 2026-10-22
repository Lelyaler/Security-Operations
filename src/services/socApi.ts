import type {
  KpiStats,
  TrafficDataPoint,
  ProtocolShare,
  InfrastructureNode,
  SecurityIncident,
  AuditLog,
  NetworkPacket,
  IncidentStatus
} from '../types/security';
import {
  kpiStats,
  trafficHistory,
  protocolDistribution,
  mockInfrastructureNodes,
  mockSecurityIncidents,
  mockAuditLogs
} from '../utils/mockData';
import { generateSyntheticPacket } from '../utils/securityHelpers';

const BASE_URL = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const API_ROOT = `${BASE_URL}api/v1`;

async function requestWithFallback<T>(endpoint: string, fallbackData: T, options?: RequestInit): Promise<T> {
  const url = `${API_ROOT}${endpoint}`;

  // If Service Worker is active, route through it so DevTools Network reflects realistic kernel telemetry
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(options?.headers || {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        return data as T;
      }
    } catch {
      // Fallback on network error
    }
  }

  // Before Service Worker has claimed the page, resolve directly with fallback data
  // to avoid triggering spurious 404 network errors against the static GitHub Pages host.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(fallbackData)) as T);
    }, 20);
  });
}

export const socApi = {
  getKpiMetrics(): Promise<KpiStats> {
    return requestWithFallback<KpiStats>('/metrics/kpi', kpiStats);
  },

  getTrafficMetrics(): Promise<TrafficDataPoint[]> {
    return requestWithFallback<TrafficDataPoint[]>('/telemetry/traffic', trafficHistory);
  },

  getProtocolDistribution(): Promise<ProtocolShare[]> {
    return requestWithFallback<ProtocolShare[]>('/telemetry/protocols', protocolDistribution);
  },

  getInfrastructureNodes(): Promise<InfrastructureNode[]> {
    return requestWithFallback<InfrastructureNode[]>('/infrastructure/nodes', mockInfrastructureNodes);
  },

  getSecurityIncidents(): Promise<SecurityIncident[]> {
    return requestWithFallback<SecurityIncident[]>('/threats/incidents', mockSecurityIncidents);
  },

  mitigateIncident(id: string, status: IncidentStatus): Promise<{ status: string }> {
    return requestWithFallback<{ status: string }>(
      '/threats/mitigate',
      { status: 'acknowledged' },
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      }
    );
  },

  getAuditLogs(): Promise<AuditLog[]> {
    return requestWithFallback<AuditLog[]>('/audit/logs', mockAuditLogs);
  },

  async fetchLivePacket(isDdos = false): Promise<NetworkPacket> {
    const fallback = generateSyntheticPacket(
      `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      isDdos && Math.random() < 0.65
    );
    return requestWithFallback<NetworkPacket>(
      `/telemetry/packet?ddos=${isDdos}`,
      fallback
    );
  }
};
