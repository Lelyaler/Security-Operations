// Mock Data Service for iGaming & Casino Analytics Dashboard

export const kpiStats = {
  ggr: { value: "$124,850", change: "+14.2%", isPositive: true },
  ngr: { value: "$98,420", change: "+12.8%", isPositive: true },
  activePlayers: { value: "3,284", change: "+8.4%", isPositive: true },
  vipBetsCount: { value: "148", change: "+24.1%", isPositive: true },
  pendingAlerts: { value: "7", change: "-2", isPositive: false, isWarning: true }
};

export const revenueHistory = [
  { name: "Mon", GGR: 15200, NGR: 11800, Bets: 34000 },
  { name: "Tue", GGR: 18400, NGR: 14200, Bets: 41000 },
  { name: "Wed", GGR: 16100, NGR: 12500, Bets: 38000 },
  { name: "Thu", GGR: 21900, NGR: 17300, Bets: 49000 },
  { name: "Fri", GGR: 24500, NGR: 19800, Bets: 56000 },
  { name: "Sat", GGR: 32000, NGR: 26500, Bets: 74000 },
  { name: "Sun", GGR: 28800, NGR: 22800, Bets: 65000 }
];

export const playerDistribution = [
  { name: "Slots", players: 1840, share: "56%" },
  { name: "Live Casino", players: 820, share: "25%" },
  { name: "Table Games", players: 390, share: "12%" },
  { name: "Crash Games", players: 234, share: "7%" }
];

export const mockGamesList = [
  { 
    id: 1, 
    name: "Book of Ra Deluxe", 
    category: "Slots", 
    provider: "Novomatic", 
    rtp: "95.10%", 
    spins: 42390, 
    ggr: 12450, 
    popularity: 98, 
    activePlayers: 480,
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 2, 
    name: "Crazy Time", 
    category: "Live Casino", 
    provider: "Evolution", 
    rtp: "96.08%", 
    spins: 28410, 
    ggr: 38100, 
    popularity: 99, 
    activePlayers: 820,
    image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 3, 
    name: "Gates of Olympus", 
    category: "Slots", 
    provider: "Pragmatic Play", 
    rtp: "96.50%", 
    spins: 54120, 
    ggr: 24900, 
    popularity: 97, 
    activePlayers: 340,
    image: "https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 4, 
    name: "Lightning Roulette", 
    category: "Live Casino", 
    provider: "Evolution", 
    rtp: "97.30%", 
    spins: 19480, 
    ggr: 18230, 
    popularity: 95, 
    activePlayers: 290,
    image: "https://images.unsplash.com/photo-1518133680790-3985350d8702?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 5, 
    name: "Sweet Bonanza", 
    category: "Slots", 
    provider: "Pragmatic Play", 
    rtp: "96.48%", 
    spins: 31200, 
    ggr: 14200, 
    popularity: 94, 
    activePlayers: 210,
    image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 6, 
    name: "Aviator", 
    category: "Crash Games", 
    provider: "Spribe", 
    rtp: "97.00%", 
    spins: 89450, 
    ggr: 34120, 
    popularity: 96, 
    activePlayers: 540,
    image: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 7, 
    name: "Blackjack VIP", 
    category: "Table Games", 
    provider: "NetEnt", 
    rtp: "99.59%", 
    spins: 5480, 
    ggr: 15400, 
    popularity: 88, 
    activePlayers: 90,
    image: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 8, 
    name: "Starburst", 
    category: "Slots", 
    provider: "NetEnt", 
    rtp: "96.09%", 
    spins: 22400, 
    ggr: 8900, 
    popularity: 85, 
    activePlayers: 120,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 9, 
    name: "Baccarat Control", 
    category: "Table Games", 
    provider: "Evolution", 
    rtp: "98.94%", 
    spins: 11200, 
    ggr: 9540, 
    popularity: 82, 
    activePlayers: 75,
    image: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 10, 
    name: "Gonzo's Quest", 
    category: "Slots", 
    provider: "NetEnt", 
    rtp: "95.97%", 
    spins: 18450, 
    ggr: 7200, 
    popularity: 80, 
    activePlayers: 85,
    image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 11, 
    name: "Mega Moolah", 
    category: "Slots", 
    provider: "Microgaming", 
    rtp: "88.12%", 
    spins: 45100, 
    ggr: 31200, 
    popularity: 91, 
    activePlayers: 190,
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&auto=format&fit=crop&q=80" 
  },
  { 
    id: 12, 
    name: "Plinko Neon", 
    category: "Crash Games", 
    provider: "BGaming", 
    rtp: "99.00%", 
    spins: 62400, 
    ggr: 11450, 
    popularity: 89, 
    activePlayers: 230,
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&auto=format&fit=crop&q=80" 
  }
];

export const mockFraudAlerts = [
  { id: "FL-9081", player: "Alexander K.", country: "DE", risk: "high", reason: "Multiple account activity (Same IP)", amount: "$8,500", time: "10 mins ago", status: "pending" },
  { id: "FL-9082", player: "Sophia M.", country: "SE", risk: "medium", reason: "Opposite betting in Roulette", amount: "$3,200", time: "25 mins ago", status: "pending" },
  { id: "FL-9083", player: "Dimitri V.", country: "GR", risk: "high", reason: "Sudden high-stakes slot spin pattern", amount: "$15,000", time: "42 mins ago", status: "investigating" },
  { id: "FL-9084", player: "Jean L.", country: "FR", risk: "low", reason: "Frequent deposit/withdrawal cycles", amount: "$1,200", time: "1 hour ago", status: "pending" },
  { id: "FL-9085", player: "Marcus T.", country: "UK", risk: "high", reason: "Carding attempt (chargeback risk)", amount: "$5,000", time: "3 hours ago", status: "resolved" }
];

export const mockTransactions = [
  { id: "TX-4091", player: "John D.", type: "Deposit", amount: 2500, method: "Visa", time: "14:38:22", status: "success" },
  { id: "TX-4092", player: "Sarah W.", type: "Withdrawal", amount: 1200, method: "Bitcoin", time: "14:35:10", status: "success" },
  { id: "TX-4093", player: "Mike R.", type: "Deposit", amount: 500, method: "Mastercard", time: "14:31:05", status: "success" },
  { id: "TX-4094", player: "Elena P.", type: "Withdrawal", amount: 4500, method: "Bank Transfer", time: "14:28:44", status: "pending" },
  { id: "TX-4095", player: "Arthur K.", type: "Deposit", amount: 10000, method: "Ethereum", time: "14:19:15", status: "success" },
  { id: "TX-4096", player: "Lucas B.", type: "Withdrawal", amount: 300, method: "Skrill", time: "14:15:00", status: "failed" },
  { id: "TX-4097", player: "Nadia S.", type: "Deposit", amount: 1500, method: "Neteller", time: "14:02:11", status: "success" }
];

export const initialLiveBets = [
  { id: 1, player: "User-893", game: "Crazy Time", amount: "$50", multiplier: "2x", win: "$100", type: "win" },
  { id: 2, player: "User-114", game: "Gates of Olympus", amount: "$10", multiplier: "0x", win: "$0", type: "loss" },
  { id: 3, player: "User-542", game: "Aviator", amount: "$100", multiplier: "1.45x", win: "$145", type: "win" },
  { id: 4, player: "User-209", game: "Blackjack VIP", amount: "$500", multiplier: "2.5x", win: "$1,250", type: "win" },
  { id: 5, player: "User-773", game: "Book of Ra", amount: "$25", multiplier: "0x", win: "$0", type: "loss" }
];

export const liveGamesList = [
  "Crazy Time", "Gates of Olympus", "Aviator", "Blackjack VIP", "Book of Ra Deluxe",
  "Sweet Bonanza", "Lightning Roulette", "Starburst", "Space XY"
];
