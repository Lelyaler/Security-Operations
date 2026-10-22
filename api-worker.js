// SecureNode SOC Telemetry & Management API Service Worker
// Simulates edge eBPF kernel telemetry and distributed RPC service responses

const SW_VERSION = 'v2.14.0';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

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
      await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 40) + 20));

      const headers = {
        'Content-Type': 'application/json',
        'X-eBPF-Agent-Version': SW_VERSION,
        'X-Cluster-Region': 'eu-central-1',
        'X-Telemetry-Latency-Ms': String(Math.floor(Math.random() * 15) + 3),
        'Cache-Control': 'no-store, max-age=0'
      };

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

      // Default pass-through to the application's fallback handler
      return fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ status: 'ok', endpoint: url.pathname }), {
          status: 200,
          headers
        });
      });
    })()
  );
});
