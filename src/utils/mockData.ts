import type {
  KpiStats,
  TrafficDataPoint,
  ProtocolShare,
  InfrastructureNode,
  SecurityIncident,
  AuditLog,
  NetworkPacket
} from '../types/security';

export const kpiStats: KpiStats = {
  totalPackets: { value: "12.4M", change: "+14.2%", isPositive: true },
  blockedThreats: { value: "98.4K", change: "+12.8%", isPositive: true },
  activeSockets: { value: "3,284", change: "+8.4%", isPositive: true },
  inspectedPayloads: { value: "148 GB", change: "+24.1%", isPositive: true },
  pendingAlerts: { value: "7", change: "-2", isPositive: false, isWarning: true }
};

export const trafficHistory: TrafficDataPoint[] = [
  { name: "Mon", Traffic: 15200, Threats: 1180, Connections: 3400 },
  { name: "Tue", Traffic: 18400, Threats: 1420, Connections: 4100 },
  { name: "Wed", Traffic: 16100, Threats: 1250, Connections: 3800 },
  { name: "Thu", Traffic: 21900, Threats: 1730, Connections: 4900 },
  { name: "Fri", Traffic: 24500, Threats: 1980, Connections: 5600 },
  { name: "Sat", Traffic: 32000, Threats: 2650, Connections: 7400 },
  { name: "Sun", Traffic: 28800, Threats: 2280, Connections: 6500 }
];

export const protocolDistribution: ProtocolShare[] = [
  { name: "Web (HTTPS)", connections: 1840, share: "56%" },
  { name: "API Gateway", connections: 820, share: "25%" },
  { name: "DB Queries", connections: 390, share: "12%" },
  { name: "SSH Terminal", connections: 234, share: "7%" }
];

export const mockInfrastructureNodes: InfrastructureNode[] = [
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
    status: "warning",
    requestsPerSec: 3850
  },
  {
    id: 3,
    name: "db-primary-replica.eu.sec",
    category: "Database",
    region: "EU-WEST-1",
    ipAddress: "10.0.40.5",
    cpuLoad: "32.1%",
    memoryUsage: "28.4 GB / 32 GB",
    threads: 210,
    dataTransferred: "320 GB",
    uptime: "99.99%",
    status: "healthy",
    requestsPerSec: 890
  },
  {
    id: 4,
    name: "redis-cluster-02.ap.sec",
    category: "Caching",
    region: "AP-SOUTH-1",
    ipAddress: "10.0.80.18",
    cpuLoad: "18.4%",
    memoryUsage: "12.1 GB / 16 GB",
    threads: 94,
    dataTransferred: "194 GB",
    uptime: "100.0%",
    status: "healthy",
    requestsPerSec: 5200
  },
  {
    id: 5,
    name: "edge-waf-ingress.us.sec",
    category: "Gateway",
    region: "US-WEST-2",
    ipAddress: "10.0.4.1",
    cpuLoad: "44.8%",
    memoryUsage: "7.4 GB / 16 GB",
    threads: 280,
    dataTransferred: "410 GB",
    uptime: "99.97%",
    status: "healthy",
    requestsPerSec: 4120
  },
  {
    id: 6,
    name: "billing-service.eu.sec",
    category: "Microservice",
    region: "EU-WEST-1",
    ipAddress: "10.0.18.22",
    cpuLoad: "34.0%",
    memoryUsage: "4.1 GB / 8 GB",
    threads: 160,
    dataTransferred: "88 GB",
    uptime: "99.99%",
    status: "healthy",
    requestsPerSec: 720
  },
  {
    id: 7,
    name: "lb-main-cluster.eu.sec",
    category: "Load Balancer",
    region: "EU-WEST-1",
    ipAddress: "10.0.1.254",
    cpuLoad: "41.5%",
    memoryUsage: "5.5 GB / 16 GB",
    threads: 410,
    dataTransferred: "890 GB",
    uptime: "99.99%",
    status: "healthy",
    requestsPerSec: 7800
  },
  {
    id: 8,
    name: "event-broker-kafka.us.sec",
    category: "Microservice",
    region: "US-EAST-1",
    ipAddress: "10.0.24.8",
    cpuLoad: "29.7%",
    memoryUsage: "14.2 GB / 32 GB",
    threads: 185,
    dataTransferred: "450 GB",
    uptime: "99.94%",
    status: "healthy",
    requestsPerSec: 2300
  },
  {
    id: 9,
    name: "backup-s3-vault.ap.sec",
    category: "Backup",
    region: "AP-SOUTH-1",
    ipAddress: "10.0.99.12",
    cpuLoad: "12.8%",
    memoryUsage: "3.8 GB / 16 GB",
    threads: 48,
    dataTransferred: "954 GB",
    uptime: "99.90%",
    status: "healthy",
    requestsPerSec: 110
  },
  {
    id: 10,
    name: "dns-recursive-resolver.eu.sec",
    category: "Gateway",
    region: "EU-WEST-1",
    ipAddress: "10.0.1.53",
    cpuLoad: "16.2%",
    memoryUsage: "2.1 GB / 4 GB",
    threads: 88,
    dataTransferred: "72 GB",
    uptime: "100.0%",
    status: "healthy",
    requestsPerSec: 6400
  },
  {
    id: 11,
    name: "frontend-ssr-node.us.sec",
    category: "Microservice",
    region: "US-WEST-2",
    ipAddress: "10.0.10.15",
    cpuLoad: "38.6%",
    memoryUsage: "5.9 GB / 8 GB",
    threads: 190,
    dataTransferred: "312 GB",
    uptime: "99.96%",
    status: "healthy",
    requestsPerSec: 1890
  },
  {
    id: 12,
    name: "redis-cluster-01.us.sec",
    category: "Caching",
    region: "US-EAST-1",
    ipAddress: "10.0.80.12",
    cpuLoad: "22.3%",
    memoryUsage: "10.4 GB / 16 GB",
    threads: 112,
    dataTransferred: "214 GB",
    uptime: "99.98%",
    status: "healthy",
    requestsPerSec: 4800
  }
];

export const mockSecurityIncidents: SecurityIncident[] = [
  {
    id: "SEC-9081",
    sourceIp: "185.220.101.42",
    targetService: "auth-node-01.eu.sec",
    risk: "high",
    reason: "Brute force login wave detected (failed password threshold exceeded)",
    payloadSize: "8.5 MB",
    timestamp: "10 mins ago",
    status: "pending",
    cve: "CVE-2025-2411",
    mitre: { id: "T1110.001", name: "Password Guessing", tactic: "Credential Access" },
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    destinationPort: 443,
    protocol: "HTTPS",
    userAgent: "Hydra/9.5 (Linux; x86_64)",
    rawEvent: `CEF:0|SecureNode|WAF-Sensor|3.4|1001|BRUTE_FORCE_BURST|8|src=185.220.101.42 dst=10.0.12.14 spt=51240 dpt=443 proto=TCP app=HTTPS request=/api/v1/auth/login cs1Label=AuthFailures cs1=42 cs2Label=Mitre cs2=T1110.001 msg="Consecutive invalid password attempts exceeded rate limit window (threshold=10/min)"`
  },
  {
    id: "SEC-9082",
    sourceIp: "94.130.49.201",
    targetService: "db-primary-replica.eu.sec",
    risk: "medium",
    reason: "SQL injection signature matched in parameter token",
    payloadSize: "3.2 MB",
    timestamp: "25 mins ago",
    status: "pending",
    cve: "CVE-2024-5108",
    mitre: { id: "T1190", name: "Exploit Public-Facing Application", tactic: "Initial Access" },
    sha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    destinationPort: 5432,
    protocol: "TCP",
    userAgent: "sqlmap/1.7#stable",
    rawEvent: `CEF:0|SecureNode|DB-Firewall|2.1|4002|SQLI_PATTERN_MATCH|6|src=94.130.49.201 dst=10.0.40.5 spt=49221 dpt=5432 proto=TCP app=Postgres cs1Label=QuerySignature cs1="UNION SELECT null, username, password_hash FROM pg_shadow--" msg="Pattern match rule SQLI_UNION_EXTRACT detected"`
  },
  {
    id: "SEC-9083",
    sourceIp: "213.89.141.12",
    targetService: "billing-service.eu.sec",
    risk: "high",
    reason: "Suspicious API token replay sequence across non-routable ASN",
    payloadSize: "15.0 MB",
    timestamp: "42 mins ago",
    status: "investigating",
    cve: "CVE-2025-1082",
    mitre: { id: "T1550.001", name: "Application Access Token", tactic: "Defense Evasion" },
    sha256: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    destinationPort: 8443,
    protocol: "HTTPS",
    userAgent: "python-requests/2.31.0",
    rawEvent: `CEF:0|SecureNode|APIGateway|4.0|2009|TOKEN_REPLAY_ANOMALY|8|src=213.89.141.12 dst=10.0.18.22 spt=33102 dpt=8443 proto=TCP app=REST request=/v2/invoices/payout cs1Label=ReplayDelta cs1=14ms cs2Label=ASN cs2=AS1970 msg="HMAC signature reuse across geographically impossible ASN jump within 14ms window"`
  },
  {
    id: "SEC-9084",
    sourceIp: "109.224.8.115",
    targetService: "dns-recursive-resolver.eu.sec",
    risk: "low",
    reason: "Rapid DNS amplification query cycle anomaly",
    payloadSize: "1.2 MB",
    timestamp: "1 hour ago",
    status: "pending",
    cve: "CVE-2024-3918",
    mitre: { id: "T1498.001", name: "Direct Network Flood", tactic: "Impact" },
    sha256: "c18a221f78e470ad46714d6428c8de15a99577cda608c0ef0710fa53f20f6990",
    destinationPort: 53,
    protocol: "UDP",
    userAgent: "dnsperf/2.12.0",
    rawEvent: `CEF:0|SecureNode|DNS-Shield|1.8|5001|DNS_AMP_PROBE|3|src=109.224.8.115 dst=10.0.1.53 spt=60201 dpt=53 proto=UDP app=DNS cs1Label=RecordType cs1="ANY" cs2Label=Rate cs2="180 req/sec" msg="ANY query burst detected on open resolver endpoint"`
  },
  {
    id: "SEC-9085",
    sourceIp: "77.108.92.54",
    targetService: "api-gw-alpha.us.sec",
    risk: "high",
    reason: "Admin privilege escalation attempt via crafted HTTP header",
    payloadSize: "5.0 MB",
    timestamp: "3 hours ago",
    status: "resolved",
    cve: "CVE-2026-0928",
    mitre: { id: "T1068", name: "Exploitation for Privilege Escalation", tactic: "Privilege Escalation" },
    sha256: "7b52009b64fd0a2a49e6d8a939753077792b0554cac5245011df39c90c8a4527",
    destinationPort: 443,
    protocol: "HTTPS",
    userAgent: "curl/8.4.0",
    rawEvent: `CEF:0|SecureNode|WAF-Sensor|3.4|1014|HEADER_INJECTION_PRIV_ESC|8|src=77.108.92.54 dst=10.0.2.10 spt=44120 dpt=443 proto=TCP app=HTTPS request=/internal/cluster/config cs1Label=ForgedHeader cs1="X-Cluster-Internal-Admin: true" msg="Dropped spoofed cluster-internal administrative header on ingress boundary"`
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "LOG-4091",
    principal: "sys_backup_svc",
    type: "File Write",
    payloadSize: 2500,
    method: "REST",
    timestamp: "14:38:22",
    status: "success",
    clientIp: "10.0.99.12",
    details: "Automated snapshot write to /var/backups/pg_dump_eu1.bin"
  },
  {
    id: "LOG-4092",
    principal: "developer_alex",
    type: "SSH Access",
    payloadSize: 1200,
    method: "SSH",
    timestamp: "14:35:10",
    status: "success",
    clientIp: "192.168.10.45",
    details: "Public-key authenticated session opened on auth-node-01.eu.sec"
  },
  {
    id: "LOG-4093",
    principal: "anonymous_guest",
    type: "API Call",
    payloadSize: 500,
    method: "HTTPS",
    timestamp: "14:31:05",
    status: "success",
    clientIp: "85.143.20.91",
    details: "GET /api/v1/health ready probe verification"
  },
  {
    id: "LOG-4094",
    principal: "root_administrator",
    type: "SSH Access",
    payloadSize: 4500,
    method: "SSH",
    timestamp: "14:28:44",
    status: "pending",
    clientIp: "172.16.0.4",
    details: "Privilege elevation request (sudo su -) awaiting MFA confirmation"
  },
  {
    id: "LOG-4095",
    principal: "billing_worker",
    type: "API Call",
    payloadSize: 10000,
    method: "gRPC",
    timestamp: "14:19:15",
    status: "success",
    clientIp: "10.0.18.22",
    details: "ExecuteBatchReconciliation across stripe-webhook-events channel"
  },
  {
    id: "LOG-4096",
    principal: "developer_clara",
    type: "File Write",
    payloadSize: 300,
    method: "REST",
    timestamp: "14:15:00",
    status: "failed",
    clientIp: "192.168.10.82",
    details: "Unauthorized write attempt to /etc/security/limits.d/99-nofile.conf"
  },
  {
    id: "LOG-4097",
    principal: "sys_monitor_daemon",
    type: "API Call",
    payloadSize: 1500,
    method: "HTTPS",
    timestamp: "14:02:11",
    status: "success",
    clientIp: "10.0.1.53",
    details: "POST /metrics/push prometheus node-exporter ingest"
  }
];

export const initialLivePackets: NetworkPacket[] = [
  { id: 1, sourceIp: "185.90.11.23", endpoint: "/api/v1/auth/login", payloadSize: "142 B", port: 443, statusText: "200 OK", type: "allowed", timestamp: "14:40:02" },
  { id: 2, sourceIp: "92.140.231.8", endpoint: "/wp-admin/login.php", payloadSize: "89 B", port: 80, statusText: "403 Blocked", type: "blocked", timestamp: "14:40:01" },
  { id: 3, sourceIp: "10.0.8.22", endpoint: "/gateway/queries", payloadSize: "524 B", port: 443, statusText: "200 OK", type: "allowed", timestamp: "14:40:00" },
  { id: 4, sourceIp: "77.202.94.18", endpoint: "/api/v2/billing", payloadSize: "1.1 KB", port: 443, statusText: "200 OK", type: "allowed", timestamp: "14:39:59" },
  { id: 5, sourceIp: "185.220.101.9", endpoint: "/etc/passwd", payloadSize: "20 B", port: 22, statusText: "401 Blocked", type: "blocked", timestamp: "14:39:58" }
];

export const monitoredEndpoints: string[] = [
  "/api/v1/auth/login",
  "/gateway/queries",
  "/api/v2/billing",
  "/users/profile",
  "/cache/keys/flush",
  "/ssh/session/request",
  "/metrics/push",
  "/db/healthcheck"
];
