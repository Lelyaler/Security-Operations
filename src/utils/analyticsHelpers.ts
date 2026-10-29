import type {
  IncidentLog,
  NetworkPacket,
  RiskLevel,
  IncidentStatus
} from '../types/analytics';

const STORAGE_KEY_INCIDENTS = 'secops_incidents_v1';

export type ClockMode = 'utc' | 'local';

export function filterIncidents(
  incidents: IncidentLog[],
  riskFilter: RiskLevel | 'all',
  statusFilter: IncidentStatus | 'all',
  query = ''
): IncidentLog[] {
  const normalizedQuery = query.trim().toLowerCase();

  return incidents.filter((incident) => {
    const matchesRisk = riskFilter === 'all' || incident.risk === riskFilter;
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesQuery =
      !normalizedQuery ||
      incident.id.toLowerCase().includes(normalizedQuery) ||
      incident.sourceIp.toLowerCase().includes(normalizedQuery) ||
      incident.targetService.toLowerCase().includes(normalizedQuery) ||
      incident.reason.toLowerCase().includes(normalizedQuery) ||
      (incident.endpoint && incident.endpoint.toLowerCase().includes(normalizedQuery)) ||
      (incident.httpStatus && String(incident.httpStatus).includes(normalizedQuery));

    return matchesRisk && matchesStatus && matchesQuery;
  });
}

const pad = (n: number) => String(n).padStart(2, '0');

export function formatClock(timestamp: number, mode: ClockMode = 'local'): string {
  const d = new Date(timestamp);
  return mode === 'utc'
    ? `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
    : `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const SUBNETS = [
  '185.12.94.',
  '94.130.82.',
  '77.88.55.',
  '178.62.204.',
  '142.250.180.',
  '51.15.42.',
  '89.208.29.',
  '185.220.101.',
  '109.236.85.'
];

const ROUTE_DEFINITIONS = [
  { endpoint: '/api/v1/telemetry', method: 'GET' as const, port: 443, statusText: '200 OK', type: 'allowed' as const, latency: 18, sizeKb: 1.4 },
  { endpoint: '/api/v2/products', method: 'GET' as const, port: 443, statusText: '200 OK', type: 'allowed' as const, latency: 34, sizeKb: 4.8 },
  { endpoint: '/wp-login.php', method: 'POST' as const, port: 443, statusText: '404 Not Found', type: 'blocked' as const, latency: 12, sizeKb: 0.8 },
  { endpoint: '/api/v1/auth/session', method: 'POST' as const, port: 443, statusText: '200 OK', type: 'allowed' as const, latency: 22, sizeKb: 2.2 },
  { endpoint: '/api/v1/auth/login', method: 'POST' as const, port: 443, statusText: '429 Too Many', type: 'blocked' as const, latency: 142, sizeKb: 1.9 },
  { endpoint: '/api/v2/checkout', method: 'POST' as const, port: 443, statusText: '504 Timeout', type: 'blocked' as const, latency: 3004, sizeKb: 6.4 },
  { endpoint: '/api/v1/catalog/search', method: 'GET' as const, port: 443, statusText: '200 OK', type: 'allowed' as const, latency: 45, sizeKb: 8.1 },
  { endpoint: '/health', method: 'GET' as const, port: 80, statusText: '200 OK', type: 'allowed' as const, latency: 8, sizeKb: 0.2 },
  { endpoint: '/api/v1/users/me', method: 'GET' as const, port: 443, statusText: '304 Not Modified', type: 'allowed' as const, latency: 15, sizeKb: 3.1 },
  { endpoint: '/api/v1/assets/upload', method: 'POST' as const, port: 443, statusText: '413 Too Large', type: 'blocked' as const, latency: 84, sizeKb: 28.4 }
];

let cursor = 0;

export function nextPacket(receivedAt = Date.now()): NetworkPacket {
  const route = ROUTE_DEFINITIONS[cursor % ROUTE_DEFINITIONS.length];
  const subnet = SUBNETS[cursor % SUBNETS.length];
  const host = ((cursor * 19 + 7) % 245) + 1;
  const jitter = Math.round(Math.sin(cursor) * (route.latency > 100 ? 15 : 4));
  const latencyMs = Math.max(4, route.latency + jitter);
  const sizeVariance = (route.sizeKb + (Math.cos(cursor) * 0.2)).toFixed(1);

  cursor++;
  return {
    id: `${receivedAt.toString(36)}-${cursor}`,
    sourceIp: `${subnet}${host}`,
    endpoint: route.endpoint,
    payloadSize: `${sizeVariance} KB`,
    port: route.port,
    statusText: route.statusText,
    type: route.type,
    receivedAt,
    latencyMs,
    method: route.method
  };
}

export function seedPackets(count: number, stepMs: number, now = Date.now()): NetworkPacket[] {
  return Array.from({ length: count }, (_, i) => nextPacket(now - (count - 1 - i) * stepMs)).reverse();
}

let memoryStorage: Record<string, string> = {};

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memoryStorage[key] ?? null;
  }
}

function writeStorage(key: string, value: string): void {
  memoryStorage[key] = value;
  try {
    window.localStorage.setItem(key, value);
  } catch {
  }
}

export function loadPersistedIncidents(fallback: IncidentLog[]): IncidentLog[] {
  try {
    const raw = readStorage(STORAGE_KEY_INCIDENTS);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function savePersistedIncidents(incidents: IncidentLog[]): void {
  writeStorage(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
}

export function clearPersistedData(): void {
  memoryStorage = {};
  try {
    window.localStorage.removeItem(STORAGE_KEY_INCIDENTS);
  } catch {
  }
}
