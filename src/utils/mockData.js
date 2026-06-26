// Mock Data Service for Cybersecurity Operations Center (SOC Dashboard)

export const kpiStats = {
  ggr: { value: "12.4M", change: "+14.2%", isPositive: true }, // Total network packets
  ngr: { value: "98.4K", change: "+12.8%", isPositive: true }, // Blocked threats
  activePlayers: { value: "3,284", change: "+8.4%", isPositive: true }, // Active socket connections
  vipBetsCount: { value: "148", change: "+24.1%", isPositive: true }, // Security audits
  pendingAlerts: { value: "7", change: "-2", isPositive: false, isWarning: true } // Intrusion alerts
};

export const revenueHistory = [
  { name: "Mon", Traffic: 15200, Threats: 1180, Connections: 3400 },
  { name: "Tue", Traffic: 18400, Threats: 1420, Connections: 4100 },
  { name: "Wed", Traffic: 16100, Threats: 1250, Connections: 3800 },
  { name: "Thu", Traffic: 21900, Threats: 1730, Connections: 4900 },
  { name: "Fri", Traffic: 24500, Threats: 1980, Connections: 5600 },
  { name: "Sat", Traffic: 32000, Threats: 2650, Connections: 7400 },
  { name: "Sun", Traffic: 28800, Threats: 2280, Connections: 6500 }
];

export const playerDistribution = [
  { name: "Web (HTTPS)", players: 1840, share: "56%" },
  { name: "API Gateway", players: 820, share: "25%" },
  { name: "DB Queries", players: 390, share: "12%" },
  { name: "SSH Terminal", players: 234, share: "7%" }
];

export const mockGamesList = [
  { 
    id: 1, 
    name: "Auth Node-01", 
    category: "Microservice", 
    provider: "EU-WEST", 
    rtp: "14.20%", // CPU load
    spins: 423900, // Total Requests
    ggr: 124, // Data Sent (GB)
    popularity: 98, // Health status
    activePlayers: 480, // Active threads
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 2, 
    name: "API Gateway Alpha", 
    category: "Gateway", 
    provider: "US-EAST", 
    rtp: "38.10%", 
    spins: 284100, 
    ggr: 381, 
    popularity: 99, 
    activePlayers: 820,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 3, 
    name: "Database Primary", 
    category: "Database", 
    provider: "EU-WEST", 
    rtp: "24.90%", 
    spins: 541200, 
    ggr: 249, 
    popularity: 97, 
    activePlayers: 340,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 4, 
    name: "Caching Redis-02", 
    category: "Caching", 
    provider: "AP-SOUTH", 
    rtp: "18.23%", 
    spins: 194800, 
    ggr: 182, 
    popularity: 95, 
    activePlayers: 290,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 5, 
    name: "CDN Edge-03", 
    category: "Gateway", 
    provider: "US-WEST", 
    rtp: "14.20%", 
    spins: 312000, 
    ggr: 142, 
    popularity: 94, 
    activePlayers: 210,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 6, 
    name: "Billing API Secure", 
    category: "Microservice", 
    provider: "EU-WEST", 
    rtp: "34.12%", 
    spins: 894500, 
    ggr: 341, 
    popularity: 96, 
    activePlayers: 540,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 7, 
    name: "Load Balancer Main", 
    category: "Load Balancer", 
    provider: "EU-WEST", 
    rtp: "15.40%", 
    spins: 54800, 
    ggr: 154, 
    popularity: 88, 
    activePlayers: 90,
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 8, 
    name: "Message Queue Rabbit", 
    category: "Microservice", 
    provider: "US-EAST", 
    rtp: "8.90%", 
    spins: 224000, 
    ggr: 89, 
    popularity: 85, 
    activePlayers: 120,
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 9, 
    name: "Backup Vault Storage", 
    category: "Backup", 
    provider: "AP-SOUTH", 
    rtp: "9.54%", 
    spins: 112000, 
    ggr: 954, 
    popularity: 82, 
    activePlayers: 75,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 10, 
    name: "DNS Resolver Primary", 
    category: "Gateway", 
    provider: "EU-WEST", 
    rtp: "7.20%", 
    spins: 184500, 
    ggr: 72, 
    popularity: 80, 
    activePlayers: 85,
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 11, 
    name: "Web Server Front", 
    category: "Microservice", 
    provider: "US-WEST", 
    rtp: "31.20%", 
    spins: 451000, 
    ggr: 312, 
    popularity: 91, 
    activePlayers: 190,
    image: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 12, 
    name: "Caching Redis-01", 
    category: "Caching", 
    provider: "US-EAST", 
    rtp: "11.45%", 
    spins: 624000, 
    ggr: 114, 
    popularity: 89, 
    activePlayers: 230,
    image: "https://images.unsplash.com/photo-1601597111158-2fceff270190?w=400&auto=format&fit=crop&q=80" 
  }
];

export const mockFraudAlerts = [
  { id: "SEC-9081", player: "185.220.101.42", country: "Auth Node-01", risk: "high", reason: "Brute force login wave detected", amount: "8.5 MB", time: "10 mins ago", status: "pending" },
  { id: "SEC-9082", player: "94.130.49.201", country: "Database Primary", risk: "medium", reason: "SQL injection signature matched", amount: "3.2 MB", time: "25 mins ago", status: "pending" },
  { id: "SEC-9083", player: "213.89.141.12", country: "Billing API Secure", risk: "high", reason: "Suspicious API request sequence", amount: "15.0 MB", time: "42 mins ago", status: "investigating" },
  { id: "SEC-9084", player: "109.224.8.115", country: "DNS Resolver Primary", risk: "low", reason: "Rapid DNS lookup cycle anomaly", amount: "1.2 MB", time: "1 hour ago", status: "pending" },
  { id: "SEC-9085", player: "77.108.92.54", country: "API Gateway Alpha", risk: "high", reason: "Admin privilege escalation attempt", amount: "5.0 MB", time: "3 hours ago", status: "resolved" }
];

export const mockTransactions = [
  { id: "LOG-4091", player: "sys_backup_svc", type: "File Write", amount: 2500, method: "REST", time: "14:38:22", status: "success" },
  { id: "LOG-4092", player: "developer_alex", type: "SSH Access", amount: 1200, method: "SSH", time: "14:35:10", status: "success" },
  { id: "LOG-4093", player: "anonymous_guest", type: "API Call", amount: 500, method: "HTTPS", time: "14:31:05", status: "success" },
  { id: "LOG-4094", player: "root_administrator", type: "SSH Access", amount: 4500, method: "SSH", time: "14:28:44", status: "pending" },
  { id: "LOG-4095", player: "billing_worker", type: "API Call", amount: 10000, method: "gRPC", time: "14:19:15", status: "success" },
  { id: "LOG-4096", player: "developer_clara", type: "File Write", amount: 300, method: "REST", time: "14:15:00", status: "failed" },
  { id: "LOG-4097", player: "sys_monitor_daemon", type: "API Call", amount: 1500, method: "HTTPS", time: "14:02:11", status: "success" }
];

export const initialLiveBets = [
  { id: 1, player: "185.90.11.23", game: "/api/v1/auth/login", amount: "142", multiplier: "443", win: "200 OK", type: "win" }, // allowed
  { id: 2, player: "92.140.231.8", game: "/wp-admin/login.php", amount: "89", multiplier: "80", win: "403 Blocked", type: "loss" }, // blocked
  { id: 3, player: "10.0.8.22", game: "/gateway/queries", amount: "524", multiplier: "443", win: "200 OK", type: "win" },
  { id: 4, player: "77.202.94.18", game: "/api/v2/billing", amount: "1124", multiplier: "443", win: "200 OK", type: "win" },
  { id: 5, player: "185.220.101.9", game: "/etc/passwd", amount: "20", multiplier: "22", win: "401 Blocked", type: "loss" }
];

export const liveGamesList = [
  "/api/v1/auth/login", "/gateway/queries", "/api/v2/billing", "/users/profile",
  "/cache/keys/flush", "/ssh/session/request", "/metrics/push", "/db/healthcheck"
];
