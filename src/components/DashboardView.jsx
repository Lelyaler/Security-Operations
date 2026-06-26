import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Coins, Percent, AlertCircle } from 'lucide-react';
import { kpiStats, revenueHistory, playerDistribution, initialLiveBets, liveGamesList } from '../utils/mockData';

export default function DashboardView() {
  const [liveBets, setLiveBets] = useState(initialLiveBets);

  // Live simulation of active casino bets
  useEffect(() => {
    const interval = setInterval(() => {
      const isWin = Math.random() > 0.5;
      const amount = [10, 20, 50, 100, 500, 1000][Math.floor(Math.random() * 6)];
      const multiplier = isWin ? (Math.random() * 4 + 1.2).toFixed(2) : "0.00";
      const winVal = isWin ? Math.round(amount * parseFloat(multiplier)) : 0;
      
      const newBet = {
        id: Date.now(),
        player: `Player-${Math.floor(Math.random() * 900) + 100}`,
        game: liveGamesList[Math.floor(Math.random() * liveGamesList.length)],
        amount: `$${amount}`,
        multiplier: isWin ? `${multiplier}x` : "0x",
        win: `$${winVal}`,
        type: isWin ? 'win' : 'loss'
      };

      setLiveBets(prev => [newBet, ...prev.slice(0, 4)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#10b981', '#8b5cf6', '#fbbf24', '#3b82f6'];

  return (
    <div className="dashboard-view animate-fade-in">
      {/* KPI Stats Grid */}
      <div className="kpi-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Gross Gaming Revenue (GGR)</span>
            <Coins className="kpi-icon text-primary" size={20} />
          </div>
          <div className="kpi-value">{kpiStats.ggr.value}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              <TrendingUp size={12} /> {kpiStats.ggr.change}
            </span>
            <span className="trend-label">vs last week</span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Net Gaming Revenue (NGR)</span>
            <Percent className="kpi-icon text-secondary" size={20} />
          </div>
          <div className="kpi-value">{kpiStats.ngr.value}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              <TrendingUp size={12} /> {kpiStats.ngr.change}
            </span>
            <span className="trend-label">vs last week</span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Players Today</span>
            <Users className="kpi-icon text-accent" size={20} />
          </div>
          <div className="kpi-value">{kpiStats.activePlayers.value}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              <TrendingUp size={12} /> {kpiStats.activePlayers.change}
            </span>
            <span className="trend-label">vs yesterday</span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Fraud Risk Alerts</span>
            <AlertCircle className="kpi-icon text-danger" size={20} />
          </div>
          <div className="kpi-value text-danger">{kpiStats.pendingAlerts.value}</div>
          <div className="kpi-footer">
            <span className="trend-badge negative">
              {kpiStats.pendingAlerts.change}
            </span>
            <span className="trend-label">unresolved files</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Live Feed Section */}
      <div className="dashboard-content-layout">
        {/* Analytics Chart */}
        <div className="glass-card main-chart-card">
          <h3 className="card-heading">Revenue Comparison (GGR vs NGR)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGgr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNgr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-dark)', 
                    border: '1px solid var(--card-border)', 
                    borderRadius: '8px',
                    color: 'var(--text-main)' 
                  }} 
                />
                <Area type="monotone" dataKey="GGR" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorGgr)" />
                <Area type="monotone" dataKey="NGR" stroke="var(--secondary)" strokeWidth={2} fillOpacity={1} fill="url(#colorNgr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Feed Panel */}
        <div className="glass-card live-feed-card">
          <div className="live-feed-header">
            <div className="live-pulse-container">
              <span className="live-dot pulse-primary"></span>
              <h3 className="card-heading">Live Casino Bets</h3>
            </div>
            <span className="badge badge-success">Simulated Feed</span>
          </div>

          <div className="live-bets-container">
            {liveBets.map((bet) => (
              <div key={bet.id} className={`live-bet-row ${bet.type} animate-slide-in`}>
                <div className="bet-row-left">
                  <span className="bet-player">{bet.player}</span>
                  <span className="bet-game text-muted">{bet.game}</span>
                </div>
                <div className="bet-row-center">
                  <span className="bet-amount">{bet.amount}</span>
                  <span className="bet-multiplier badge">{bet.multiplier}</span>
                </div>
                <div className="bet-row-right">
                  <span className={`bet-win ${bet.type === 'win' ? 'text-success' : 'text-muted'}`}>
                    {bet.win}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Metrics Section */}
      <div className="secondary-metrics-layout">
        {/* Game Distribution Chart */}
        <div className="glass-card dist-chart-card">
          <h3 className="card-heading">Active Players by Vertical</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={playerDistribution} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} width={85} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-dark)', 
                    border: '1px solid var(--card-border)', 
                    borderRadius: '8px' 
                  }} 
                />
                <Bar dataKey="players" radius={[0, 4, 4, 0]}>
                  {playerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Operations Logs */}
        <div className="glass-card system-logs-card">
          <h3 className="card-heading">System Operator Log</h3>
          <div className="logs-container">
            <div className="log-item">
              <span className="log-time">[14:38:12]</span>
              <span className="log-text">GeoIP verification updated for <strong>SE region</strong>.</span>
            </div>
            <div className="log-item">
              <span className="log-time">[14:29:45]</span>
              <span className="log-text text-warning">Compliance: Flagged transaction TX-4096 (Skrill, Failed).</span>
            </div>
            <div className="log-item">
              <span className="log-time">[14:15:30]</span>
              <span className="log-text">RTP checks completed for <strong>Evolution Gaming</strong>. Variance: 0.02% (Healthy).</span>
            </div>
            <div className="log-item">
              <span className="log-time">[13:58:02]</span>
              <span className="log-text text-success">Main wallet cluster reconciliation completed successfully.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
