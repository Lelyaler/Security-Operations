import type {
  KpiStats,
  TrafficDataPoint,
  LatencyDataPoint,
  HttpStatusShare,
  ProtocolShare,
  IncidentLog
} from '../types/analytics';

export const kpiStats: KpiStats = {
  requests: { value: "14.8M", change: "+12.4%" },
  rejected: { value: "32.1K", change: "-8.3%" },
  sockets: { value: "4,190", change: "+5.1%" }
};

export const trafficHistory24h: TrafficDataPoint[] = [
  { label: "00:00", requests: 12400, blocked: 420 },
  { label: "04:00", requests: 8900, blocked: 310 },
  { label: "08:00", requests: 21500, blocked: 840 },
  { label: "12:00", requests: 28400, blocked: 1120 },
  { label: "16:00", requests: 31200, blocked: 1350 },
  { label: "20:00", requests: 24800, blocked: 980 },
  { label: "24:00", requests: 17200, blocked: 610 }
];

export const trafficHistory7d: TrafficDataPoint[] = [
  { label: "Mon", requests: 18200, blocked: 820 },
  { label: "Tue", requests: 21400, blocked: 950 },
  { label: "Wed", requests: 19800, blocked: 880 },
  { label: "Thu", requests: 24600, blocked: 1210 },
  { label: "Fri", requests: 27900, blocked: 1450 },
  { label: "Sat", requests: 34100, blocked: 1890 },
  { label: "Sun", requests: 30500, blocked: 1540 }
];

export const trafficHistory30d: TrafficDataPoint[] = [
  { label: "Week 1", requests: 142000, blocked: 6200 },
  { label: "Week 2", requests: 168000, blocked: 7400 },
  { label: "Week 3", requests: 189000, blocked: 8100 },
  { label: "Week 4", requests: 215000, blocked: 9800 }
];

export const latencyHistory: LatencyDataPoint[] = [
  { time: "00:00", p50: 22, p95: 58, p99: 112 },
  { time: "03:00", p50: 19, p95: 49, p99: 94 },
  { time: "06:00", p50: 24, p95: 64, p99: 128 },
  { time: "09:00", p50: 38, p95: 98, p99: 195 },
  { time: "12:00", p50: 45, p95: 118, p99: 240 },
  { time: "15:00", p50: 42, p95: 112, p99: 225 },
  { time: "18:00", p50: 34, p95: 89, p99: 172 },
  { time: "21:00", p50: 28, p95: 72, p99: 145 }
];

export const httpStatusDistribution: HttpStatusShare[] = [
  { status: "200 OK", count: 10656000, share: "72%", color: "#0d9488" },
  { status: "304 Not Modified", count: 2220000, share: "15%", color: "#94a3b8" },
  { status: "4xx Client Error", count: 1332000, share: "9%", color: "#d97706" },
  { status: "5xx Server Error", count: 592000, share: "4%", color: "#dc2626" }
];

export const protocolDistribution: ProtocolShare[] = [
  { name: "Web (HTTPS)", connections: 2340, share: "56%" },
  { name: "REST API", connections: 1040, share: "25%" },
  { name: "WebSocket", connections: 520, share: "12%" },
  { name: "gRPC Streaming", connections: 290, share: "7%" }
];

export const mockIncidentLogs: IncidentLog[] = [
  {
    id: "INC-8101",
    sourceIp: "185.220.101.42",
    targetService: "Auth Service",
    risk: "high",
    reason: "API Rate limit threshold exceeded (/api/v1/auth/login)",
    payloadSize: "14.2 KB",
    timestamp: "2m ago",
    status: "pending",
    httpStatus: 429,
    endpoint: "/api/v1/auth/login",
    latencyMs: 142,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    rawEvent: JSON.stringify({
      timestamp: new Date(Date.now() - 120000).toISOString(),
      service: "auth-gateway",
      endpoint: "/api/v1/auth/login",
      method: "POST",
      statusCode: 429,
      clientIp: "185.220.101.42",
      error: "TooManyRequests: 120 req/min limit exceeded",
      durationMs: 142
    }, null, 2)
  },
  {
    id: "INC-8102",
    sourceIp: "194.26.29.112",
    targetService: "Payment API Gateway",
    risk: "critical",
    reason: "Upstream 504 Gateway Timeout during checkout processing",
    payloadSize: "8.4 KB",
    timestamp: "6m ago",
    status: "investigating",
    httpStatus: 504,
    endpoint: "/api/v2/checkout/process",
    latencyMs: 3004,
    userAgent: "iOS/17.4 PaymentClient/3.2",
    rawEvent: JSON.stringify({
      timestamp: new Date(Date.now() - 360000).toISOString(),
      service: "payment-gw",
      endpoint: "/api/v2/checkout/process",
      method: "POST",
      statusCode: 504,
      clientIp: "194.26.29.112",
      error: "GatewayTimeout: Upstream acquirer socket timed out after 3000ms",
      durationMs: 3004
    }, null, 2)
  },
  {
    id: "INC-8103",
    sourceIp: "45.154.255.89",
    targetService: "Search & Catalog Service",
    risk: "medium",
    reason: "Anomalous SQL query duration (pool starvation warning)",
    payloadSize: "42.1 KB",
    timestamp: "14m ago",
    status: "pending",
    httpStatus: 500,
    endpoint: "/api/v1/catalog/search",
    latencyMs: 1890,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    rawEvent: JSON.stringify({
      timestamp: new Date(Date.now() - 840000).toISOString(),
      service: "catalog-service",
      endpoint: "/api/v1/catalog/search?q=unindexed_facet",
      method: "GET",
      statusCode: 500,
      clientIp: "45.154.255.89",
      error: "DbConnectionTimeout: Active pool reached 100/100 limit",
      durationMs: 1890
    }, null, 2)
  },
  {
    id: "INC-8104",
    sourceIp: "89.208.29.130",
    targetService: "Media Asset Ingest",
    risk: "low",
    reason: "413 Content Too Large: upload exceeded 25MB ceiling",
    payloadSize: "38.4 MB",
    timestamp: "28m ago",
    status: "resolved",
    httpStatus: 413,
    endpoint: "/api/v1/assets/upload",
    latencyMs: 84,
    userAgent: "DashboardAdmin/2.1",
    rawEvent: JSON.stringify({
      timestamp: new Date(Date.now() - 1680000).toISOString(),
      service: "asset-ingest",
      endpoint: "/api/v1/assets/upload",
      method: "POST",
      statusCode: 413,
      clientIp: "89.208.29.130",
      error: "PayloadTooLarge: multipart stream 38.4MB > 25MB max",
      durationMs: 84
    }, null, 2)
  },
  {
    id: "INC-8105",
    sourceIp: "103.145.13.77",
    targetService: "GraphQL Public Edge",
    risk: "high",
    reason: "CORS preflight validation failure burst from untrusted origin",
    payloadSize: "2.1 KB",
    timestamp: "42m ago",
    status: "investigating",
    httpStatus: 403,
    endpoint: "/graphql",
    latencyMs: 18,
    userAgent: "Python-urllib/3.11",
    rawEvent: JSON.stringify({
      timestamp: new Date(Date.now() - 2520000).toISOString(),
      service: "graphql-edge",
      endpoint: "/graphql",
      method: "OPTIONS",
      statusCode: 403,
      clientIp: "103.145.13.77",
      error: "OriginNotAllowed: Origin header mismatched allowed list",
      durationMs: 18
    }, null, 2)
  }
];

export const mockSecurityIncidents = mockIncidentLogs;

