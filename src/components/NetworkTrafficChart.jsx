import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function NetworkTrafficChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
        <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
        <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: '#191d27',
            border: 'none',
            borderRadius: '8px',
            color: '#f4f4f5',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
          }}
        />
        <Area type="monotone" dataKey="Traffic" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" name="Network Packets" />
        <Area type="monotone" dataKey="Threats" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" name="Blocked Threats" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
