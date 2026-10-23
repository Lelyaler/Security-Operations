import type {
  SecurityIncident,
  NetworkPacket,
  RiskLevel,
  IncidentStatus,
  InfrastructureNode
} from '../types/security';

const STORAGE_KEY_INCIDENTS = 'securenode_incidents_v1';
const STORAGE_KEY_LOGS = 'securenode_audit_logs_v1';

/**
 * Filter security incidents by risk level, status, and query term
 */
export function filterIncidents(
  incidents: SecurityIncident[],
  riskFilter: RiskLevel | 'all',
  statusFilter: IncidentStatus | 'all',
  query = ''
): SecurityIncident[] {
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
      (incident.mitre && (incident.mitre.id.toLowerCase().includes(normalizedQuery) || incident.mitre.name.toLowerCase().includes(normalizedQuery))) ||
      (incident.cve && incident.cve.toLowerCase().includes(normalizedQuery));

    return matchesRisk && matchesStatus && matchesQuery;
  });
}

/**
 * Computes overall infrastructure health score (0-100) based on nodes and pending incidents
 */
export function calculateInfrastructureHealth(nodes: InfrastructureNode[], pendingAlertCount: number): number {
  if (nodes.length === 0) return 100;
  
  const scoreSum = nodes.reduce((acc, curr) => {
    const statusScore = curr.status === 'healthy' ? 100 : curr.status === 'warning' ? 75 : 50;
    return acc + statusScore;
  }, 0);

  const avgScore = scoreSum / nodes.length;
  const penalty = Math.min(pendingAlertCount * 2.5, 30);
  return Math.max(0, Math.round(avgScore - penalty));
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

const protocols = ['TLS 1.3', 'HTTP/2', 'HTTPS', 'gRPC', 'TCP'];
const methods = ['GET', 'POST', 'HEAD', 'PUT', 'CONNECT'];

/**
 * Creates a synthetic network socket packet
 */
export function generateSyntheticPacket(id: string | number, forceBlocked = false): NetworkPacket {
  const randomIp = `${Math.floor(Math.random() * 200 + 20)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  const endpoint = mockEndpoints[Math.floor(Math.random() * mockEndpoints.length)];
  const isBlocked = forceBlocked || Math.random() < 0.25;
  const bytes = Math.floor(Math.random() * 1400) + 64;
  const ports = [443, 80, 22, 8080, 3306, 5432];
  const port = isBlocked ? (Math.random() > 0.5 ? 22 : 80) : ports[Math.floor(Math.random() * ports.length)];
  const statusText = isBlocked
    ? (Math.random() > 0.5 ? '403 Blocked' : '401 Unauthorized')
    : '200 OK';

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
  const latency = Math.floor(Math.random() * 42) + 4;
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  const method = isBlocked && port === 22 ? 'SSH' : methods[Math.floor(Math.random() * methods.length)];

  return {
    id,
    sourceIp: randomIp,
    endpoint,
    payloadSize: bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`,
    port,
    statusText,
    type: isBlocked ? 'blocked' : 'allowed',
    timestamp: timeStr,
    latencyMs: latency,
    protocol,
    method
  };
}

let memoryStorage: Record<string, string> = {};

function getStorageItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryStorage[key] || null;
    }
  }
  return memoryStorage[key] || null;
}

function setStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage quota or security restriction
    }
  }
  memoryStorage[key] = value;
}

function removeStorageItem(key: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
  delete memoryStorage[key];
}

/**
 * Load persisted incidents from browser storage or return fallback
 */
export function loadPersistedIncidents(fallback: SecurityIncident[]): SecurityIncident[] {
  try {
    const raw = getStorageItem(STORAGE_KEY_INCIDENTS);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Save incidents to browser storage
 */
export function savePersistedIncidents(incidents: SecurityIncident[]): void {
  try {
    setStorageItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
  } catch {
    // Storage quota or private mode restriction
  }
}

/**
 * Clear persisted telemetry data to reset to factory defaults
 */
export function clearPersistedData(): void {
  try {
    removeStorageItem(STORAGE_KEY_INCIDENTS);
    removeStorageItem(STORAGE_KEY_LOGS);
    memoryStorage = {};
  } catch {
    // ignore
  }
}

