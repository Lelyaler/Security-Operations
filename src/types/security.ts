export type RiskLevel = 'low' | 'medium' | 'high';
export type AlertStatus = 'pending' | 'investigating' | 'resolved';
export type LogStatus = 'success' | 'failed' | 'pending';
export type PacketType = 'win' | 'loss';

export interface KpiMetric {
  value: string;
  change: string;
  isPositive: boolean;
  isWarning?: boolean;
}

export interface KpiStats {
  ggr: KpiMetric;
  ngr: KpiMetric;
  activePlayers: KpiMetric;
  vipBetsCount: KpiMetric;
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
  players: number;
  share: string;
}

export interface ServerNode {
  id: number;
  name: string;
  category: 'Microservice' | 'Gateway' | 'Database' | 'Caching' | 'Load Balancer' | 'Backup' | string;
  provider: string;
  rtp: string; // CPU load %
  spins: number; // Total requests
  ggr: number; // Data Sent in GB
  popularity: number; // Health %
  activePlayers: number; // Active threads
  image: string;
}

export interface SecurityAlert {
  id: string;
  player: string; // Malicious or source IP
  country: string; // Target node/service
  risk: RiskLevel;
  reason: string;
  amount: string; // Payload size
  time: string;
  status: AlertStatus;
}

export interface AuditLog {
  id: string;
  player: string; // Principal / User / Daemon
  type: 'File Write' | 'SSH Access' | 'API Call' | string;
  amount: number; // Payload size (bytes/tokens)
  method: 'REST' | 'SSH' | 'HTTPS' | 'gRPC' | string;
  time: string;
  status: LogStatus;
}

export interface NetworkPacket {
  id: number;
  player: string; // Source IP
  game: string; // Target endpoint
  amount: string; // Payload KB
  multiplier: string; // Port
  win: string; // Response status (e.g. '200 OK', '403 Blocked')
  type: PacketType; // 'win' (allowed) | 'loss' (blocked)
}
