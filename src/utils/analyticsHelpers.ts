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

type PacketSample = Omit<NetworkPacket, 'id' | 'receivedAt'>;

const samples: PacketSample[] = [
  { sourceIp: '185.12.94.14', endpoint: '/api/v1/telemetry', payloadSize: '1.4 KB', port: 443, statusText: '200 OK', type: 'allowed', latencyMs: 18, method: 'GET' },
  { sourceIp: '94.130.82.110', endpoint: '/api/v2/products', payloadSize: '4.8 KB', port: 443, statusText: '200 OK', type: 'allowed', latencyMs: 34, method: 'GET' },
  { sourceIp: '193.106.191.88', endpoint: '/wp-login.php', payloadSize: '0.8 KB', port: 443, statusText: '404 Not Found', type: 'blocked', latencyMs: 12, method: 'POST' },
  { sourceIp: '77.88.55.66', endpoint: '/api/v1/auth/session', payloadSize: '2.2 KB', port: 443, statusText: '200 OK', type: 'allowed', latencyMs: 22, method: 'POST' },
  { sourceIp: '185.220.101.42', endpoint: '/api/v1/auth/login', payloadSize: '1.9 KB', port: 443, statusText: '429 Too Many', type: 'blocked', latencyMs: 142, method: 'POST' },
  { sourceIp: '109.236.85.12', endpoint: '/api/v2/checkout', payloadSize: '6.4 KB', port: 443, statusText: '504 Timeout', type: 'blocked', latencyMs: 3004, method: 'POST' },
  { sourceIp: '178.62.204.81', endpoint: '/api/v1/catalog/search', payloadSize: '8.1 KB', port: 443, statusText: '200 OK', type: 'allowed', latencyMs: 45, method: 'GET' },
  { sourceIp: '142.250.180.14', endpoint: '/health', payloadSize: '0.2 KB', port: 80, statusText: '200 OK', type: 'allowed', latencyMs: 8, method: 'GET' },
  { sourceIp: '51.15.42.199', endpoint: '/api/v1/users/me', payloadSize: '3.1 KB', port: 443, statusText: '304 Not Modified', type: 'allowed', latencyMs: 15, method: 'GET' },
  { sourceIp: '89.208.29.130', endpoint: '/api/v1/assets/upload', payloadSize: '28.4 MB', port: 443, statusText: '413 Too Large', type: 'blocked', latencyMs: 84, method: 'POST' }
];

let cursor = 0;

export function nextPacket(receivedAt = Date.now()): NetworkPacket {
  const sample = samples[cursor % samples.length];
  cursor++;
  return { ...sample, id: `${receivedAt.toString(36)}-${cursor}`, receivedAt };
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
