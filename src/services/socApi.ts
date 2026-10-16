import type {
  KpiStats,
  TrafficDataPoint,
  ProtocolShare,
  InfrastructureNode,
  SecurityIncident,
  AuditLog
} from '../types/security';
import {
  kpiStats,
  trafficHistory,
  protocolDistribution,
  mockInfrastructureNodes,
  mockSecurityIncidents,
  mockAuditLogs
} from '../utils/mockData';

const NETWORK_SIMULATION_DELAY_MS = 60;

function simulateDelay<T>(data: T, delayMs = NETWORK_SIMULATION_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(data)) as T);
    }, delayMs);
  });
}

export const socApi = {
  getKpiMetrics(): Promise<KpiStats> {
    return simulateDelay(kpiStats);
  },

  getTrafficMetrics(): Promise<TrafficDataPoint[]> {
    return simulateDelay(trafficHistory);
  },

  getProtocolDistribution(): Promise<ProtocolShare[]> {
    return simulateDelay(protocolDistribution);
  },

  getInfrastructureNodes(): Promise<InfrastructureNode[]> {
    return simulateDelay(mockInfrastructureNodes);
  },

  getSecurityIncidents(): Promise<SecurityIncident[]> {
    return simulateDelay(mockSecurityIncidents);
  },

  getAuditLogs(): Promise<AuditLog[]> {
    return simulateDelay(mockAuditLogs);
  }
};
