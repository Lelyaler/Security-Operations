export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'pending' | 'investigating' | 'resolved';
export type PacketType = 'allowed' | 'blocked';
export type TimeRange = '24h' | '7d' | '30d';

export interface KpiMetric {
  value: string;
  change: string;
}

export interface KpiStats {
  requests: KpiMetric;
  rejected: KpiMetric;
  sockets: KpiMetric;
}

export interface TrafficDataPoint {
  label: string;
  requests: number;
  blocked: number;
}

export interface LatencyDataPoint {
  time: string;
  p50: number;
  p95: number;
  p99: number;
}

export interface HttpStatusShare {
  status: string;
  count: number;
  share: string;
  color: string;
}

export interface ProtocolShare {
  name: string;
  connections: number;
  share: string;
}

export interface IncidentLog {
  id: string;
  sourceIp: string;
  targetService: string;
  endpoint?: string;
  httpStatus?: number;
  risk: RiskLevel;
  reason: string;
  latencyMs?: number;
  payloadSize: string;
  timestamp: string;
  status: IncidentStatus;
  userAgent?: string;
  rawEvent?: string;
}

export interface NetworkPacket {
  id: string | number;
  sourceIp: string;
  endpoint: string;
  payloadSize: string;
  port: number;
  statusText: string;
  type: PacketType;
  receivedAt: number;
  latencyMs: number;
  method: 'GET' | 'POST';
}
