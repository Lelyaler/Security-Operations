export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'pending' | 'investigating' | 'resolved';
export type PacketType = 'allowed' | 'blocked';

export interface KpiMetric {
  value: string;
  change: string;
  isPositive: boolean;
  isWarning?: boolean;
}

export interface KpiStats {
  totalPackets: KpiMetric;
  blockedThreats: KpiMetric;
  activeSockets: KpiMetric;
  inspectedPayloads: KpiMetric;
  pendingAlerts: KpiMetric;
}

export interface TrafficDataPoint {
  name: string;
  Traffic: number;
  Threats: number;
  Connections: number;
}

export interface ProtocolShare {
  name: string;
  connections: number;
  share: string;
}

export interface InfrastructureNode {
  id: number;
  name: string;
  category: 'Microservice' | 'Gateway' | 'Database' | 'Caching' | 'Load Balancer' | 'Backup' | string;
  region: string;
  ipAddress: string;
  cpuLoad: string;
  memoryUsage: string;
  threads: number;
  dataTransferred: string;
  uptime: string;
  status: 'healthy' | 'warning' | 'degraded';
  requestsPerSec: number;
}

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
}

export interface SecurityIncident {
  id: string;
  sourceIp: string;
  targetService: string;
  risk: RiskLevel;
  reason: string;
  payloadSize: string;
  timestamp: string;
  status: IncidentStatus;
  cve?: string;
  mitre?: MitreTechnique;
  sha256?: string;
  rawEvent?: string;
  destinationPort?: number;
  protocol?: string;
  userAgent?: string;
}

export interface NetworkPacket {
  id: string | number;
  sourceIp: string;
  endpoint: string;
  payloadSize: string;
  port: number | string;
  statusText: string;
  type: PacketType;
  timestamp?: string;
  latencyMs?: number;
  protocol?: string;
  method?: string;
}
