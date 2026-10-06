import type { SecurityAlert, AuditLog, NetworkPacket, RiskLevel, AlertStatus, LogStatus, ServerNode } from '../types/security';

/**
 * Filter security alerts by risk level, status, and query term
 */
export function filterAlerts(
  alerts: SecurityAlert[],
  riskFilter: RiskLevel | 'all',
  statusFilter: AlertStatus | 'all',
  query = ''
): SecurityAlert[] {
  const normalizedQuery = query.trim().toLowerCase();

  return alerts.filter((alert) => {
    const matchesRisk = riskFilter === 'all' || alert.risk === riskFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesQuery =
      !normalizedQuery ||
      alert.id.toLowerCase().includes(normalizedQuery) ||
      alert.player.toLowerCase().includes(normalizedQuery) ||
      alert.country.toLowerCase().includes(normalizedQuery) ||
      alert.reason.toLowerCase().includes(normalizedQuery);

    return matchesRisk && matchesStatus && matchesQuery;
  });
}

/**
 * Filter administrative audit logs by type, status, and query
 */
export function filterAuditLogs(
  logs: AuditLog[],
  typeFilter: string | 'all',
  statusFilter: LogStatus | 'all',
  query = ''
): AuditLog[] {
  const normalizedQuery = query.trim().toLowerCase();

  return logs.filter((log) => {
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesQuery =
      !normalizedQuery ||
      log.id.toLowerCase().includes(normalizedQuery) ||
      log.player.toLowerCase().includes(normalizedQuery) ||
      log.method.toLowerCase().includes(normalizedQuery);

    return matchesType && matchesStatus && matchesQuery;
  });
}

/**
 * Generates an RFC-compliant CSV string from audit logs
 */
export function exportLogsToCsv(logs: AuditLog[]): string {
  const headers = ['Log ID', 'Principal', 'Event Type', 'Payload (Bytes)', 'Protocol', 'Timestamp', 'Status'];
  const rows = logs.map((log) => [
    log.id,
    `"${log.player.replace(/"/g, '""')}"`,
    `"${log.type.replace(/"/g, '""')}"`,
    log.amount.toString(),
    log.method,
    log.time,
    log.status
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Computes overall infrastructure health score (0-100) based on nodes and pending alerts
 */
export function calculateInfrastructureHealth(nodes: ServerNode[], pendingAlertCount: number): number {
  if (nodes.length === 0) return 100;
  const avgPopularity = nodes.reduce((acc, curr) => acc + curr.popularity, 0) / nodes.length;
  const penalty = Math.min(pendingAlertCount * 2.5, 30);
  return Math.max(0, Math.round(avgPopularity - penalty));
}

const mockEndpoints = [
  '/api/v1/auth/login',
  '/gateway/queries',
  '/api/v2/billing',
  '/users/profile',
  '/cache/keys/flush',
  '/ssh/session/request',
  '/metrics/push',
  '/db/healthcheck'
];

/**
 * Creates a synthetic network socket packet
 */
export function generateSyntheticPacket(id: number, forceBlocked = false): NetworkPacket {
  const randomIp = `${Math.floor(Math.random() * 200 + 20)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  const endpoint = mockEndpoints[Math.floor(Math.random() * mockEndpoints.length)];
  const isLoss = forceBlocked || Math.random() < 0.25;

  return {
    id,
    player: randomIp,
    game: endpoint,
    amount: Math.floor(Math.random() * 950 + 50).toString(),
    multiplier: isLoss ? '80' : '443',
    win: isLoss ? '403 Blocked' : '200 OK',
    type: isLoss ? 'loss' : 'win'
  };
}
