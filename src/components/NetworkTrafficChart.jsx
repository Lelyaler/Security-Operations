import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function NetworkTrafficChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
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
        <Area type="monotone" dataKey="Traffic" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
        <Area type="monotone" dataKey="Threats" stroke="var(--secondary)" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
