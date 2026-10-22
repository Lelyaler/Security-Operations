// SecureNode SOC Telemetry & Management API Service Worker
// Simulates edge eBPF kernel telemetry and distributed RPC service responses

const SW_VERSION = 'v2.15.0';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const KPI_DATA = {
  totalPackets: { value: "12.4M", change: "+14.2%", isPositive: true },
  blockedThreats: { value: "98.4K", change: "+12.8%", isPositive: true },
  activeSockets: { value: "3,284", change: "+8.4%", isPositive: true },
  inspectedPayloads: { value: "148 GB", change: "+24.1%", isPositive: true },
  pendingAlerts: { value: "7", change: "-2", isPositive: false, isWarning: true }
};

const TRAFFIC_DATA = [
  { name: "Mon", Traffic: 15200, Threats: 1180, Connections: 3400 },
  { name: "Tue", Traffic: 18400, Threats: 1420, Connections: 4100 },
  { name: "Wed", Traffic: 16100, Threats: 1250, Connections: 3800 },
  { name: "Thu", Traffic: 21900, Threats: 1730, Connections: 4900 },
  { name: "Fri", Traffic: 24500, Threats: 1980, Connections: 5600 },
  { name: "Sat", Traffic: 32000, Threats: 2650, Connections: 7400 },
  { name: "Sun", Traffic: 28800, Threats: 2280, Connections: 6500 }
];

const PROTOCOL_DATA = [
  { name: "Web (HTTPS)", connections: 1840, share: "56%" },
  { name: "API Gateway", connections: 820, share: "25%" },
  { name: "DB Queries", connections: 390, share: "12%" },
  { name: "SSH Terminal", connections: 234, share: "7%" }
];

const INFRASTRUCTURE_NODES = [
  {
    id: 1,
    name: "auth-node-01.eu.sec",
    category: "Microservice",
    region: "EU-WEST-1",
    ipAddress: "10.0.12.14",
    cpuLoad: "24.5%",
    memoryUsage: "3.2 GB / 8 GB",
    threads: 128,
    dataTransferred: "142 GB",
    uptime: "99.98%",
    status: "healthy",
    requestsPerSec: 1420
  },
  {
    id: 2,
    name: "api-gw-alpha.us.sec",
    category: "Gateway",
    region: "US-EAST-1",
    ipAddress: "10.0.2.10",
    cpuLoad: "58.2%",
    memoryUsage: "6.8 GB / 16 GB",
    threads: 340,
    dataTransferred: "580 GB",
    uptime: "99.95%",
    status: "healthy",
    requestsPerSec: 3210
  },
  {
    id: 3,
    name: "db-primary-replica.eu.sec",
    category: "Database",
    region: "EU-WEST-1",
    ipAddress: "10.0.40.5",
    cpuLoad: "74.1%",
    memoryUsage: "28.4 GB / 32 GB",
    threads: 512,
    dataTransferred: "1.2 TB",
    uptime: "99.99%",
    status: "warning",
    requestsPerSec: 890
  },
  {
    id: 4,
    name: "cache-redis-cluster.eu.sec",
    category: "Caching",
    region: "EU-WEST-1",
    ipAddress: "10.0.80.3",
    cpuLoad: "18.3%",
    memoryUsage: "12.1 GB / 16 GB",
    threads: 64,
    dataTransferred: "840 GB",
    uptime: "100.0%",
    status: "healthy",
    requestsPerSec: 5400
  },
  {
    id: 5,
    name: "edge-waf-ingress.us.sec",
    category: "Load Balancer",
    region: "US-EAST-1",
    ipAddress: "10.0.1.20",
    cpuLoad: "42.0%",
    memoryUsage: "4.5 GB / 8 GB",
    threads: 256,
    dataTransferred: "2.4 TB",
    uptime: "99.94%",
    status: "healthy",
    requestsPerSec: 7800
  },
  {
    id: 6,
    name: "backup-s3-gateway.eu.sec",
    category: "Backup",
    region: "EU-WEST-1",
    ipAddress: "10.0.99.12",
    cpuLoad: "12.8%",
    memoryUsage: "2.1 GB / 8 GB",
    threads: 48,
    dataTransferred: "4.1 TB",
    uptime: "99.89%",
    status: "healthy",
    requestsPerSec: 320
  }
];

const ENDPOINTS = [
  '/api/v1/auth/login',
  '/gateway/queries',
  '/api/v2/billing',
  '/users/profile',
  '/cache/keys/flush',
  '/ssh/session/request',
  '/metrics/push',
  '/db/healthcheck'
];

const MALICIOUS_TARGETS = [
  '/etc/passwd',
  '/wp-login.php',
  '/.env',
  '/api/v1/debug/pprof',
  '/actuator/health'
];

function generatePacket(isDdos) {
  const isMalicious = isDdos ? Math.random() < 0.7 : Math.random() < 0.25;
  const oct1 = isMalicious ? (Math.random() < 0.5 ? 185 : 45) : (Math.random() < 0.5 ? 10 : 192);
  const oct2 = Math.floor(Math.random() * 254) + 1;
  const oct3 = Math.floor(Math.random() * 254) + 1;
  const oct4 = Math.floor(Math.random() * 254) + 1;
  const ip = `${oct1}.${oct2}.${oct3}.${oct4}`;

  const endpointList = isMalicious ? MALICIOUS_TARGETS : ENDPOINTS;
  const endpoint = endpointList[Math.floor(Math.random() * endpointList.length)];
  const status = isMalicious ? (Math.random() < 0.5 ? '403 Blocked' : '401 Blocked') : '200 OK';
  const type = isMalicious ? 'blocked' : 'allowed';
  const size = `${(Math.random() * 1.5 + 0.1).toFixed(1)} KB`;
  const port = isMalicious ? (Math.random() < 0.3 ? 22 : 443) : 443;
  const latency = Math.floor(Math.random() * 28) + 4;
  const time = new Date().toTimeString().slice(0, 8);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sourceIp: ip,
    endpoint,
    payloadSize: size,
    port,
    statusText: status,
    type,
    timestamp: time,
    latencyMs: latency,
    protocol: port === 22 ? 'SSH-2.0' : 'TLS 1.3',
    method: isMalicious ? 'POST' : 'GET'
  };
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (!url.pathname.includes('/api/v1/')) {
    return;
  }

  event.respondWith(
    (async () => {
      // Simulate micro-latency typical of high-performance internal microservices
      await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 25) + 10));

      const headers = {
        'Content-Type': 'application/json',
        'X-eBPF-Agent-Version': SW_VERSION,
        'X-Cluster-Region': 'eu-central-1',
        'X-Telemetry-Latency-Ms': String(Math.floor(Math.random() * 15) + 3),
        'Cache-Control': 'no-store, max-age=0'
      };

      if (url.pathname.endsWith('/metrics/kpi')) {
        return new Response(JSON.stringify(KPI_DATA), { status: 200, headers });
      }

      if (url.pathname.endsWith('/telemetry/traffic')) {
        return new Response(JSON.stringify(TRAFFIC_DATA), { status: 200, headers });
      }

      if (url.pathname.endsWith('/telemetry/protocols')) {
        return new Response(JSON.stringify(PROTOCOL_DATA), { status: 200, headers });
      }

      if (url.pathname.endsWith('/infrastructure/nodes')) {
        return new Response(JSON.stringify(INFRASTRUCTURE_NODES), { status: 200, headers });
      }

      if (url.pathname.endsWith('/telemetry/packet') || url.pathname.endsWith('/telemetry/live-stream')) {
        const isDdos = url.searchParams.get('ddos') === 'true';
        const packet = generatePacket(isDdos);
        return new Response(JSON.stringify(packet), { status: 200, headers });
      }

      if (url.pathname.endsWith('/threats/mitigate') && event.request.method === 'POST') {
        const body = await event.request.json().catch(() => ({}));
        return new Response(
          JSON.stringify({
            status: 'acknowledged',
            incidentId: body.id,
            action: body.status,
            committedAt: new Date().toISOString(),
            appliedRule: 'DROP_SRC_CIDR_32'
          }),
          { status: 200, headers }
        );
      }

      // Default safe response for any other API endpoint - never hit the static web host
      return new Response(JSON.stringify({ status: 'ok', endpoint: url.pathname }), {
        status: 200,
        headers
      });
    })()
  );
});
