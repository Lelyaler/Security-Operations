import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

export default function ProtocolDistributionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" barSize={12}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" horizontal={false} />
        <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
        <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={100} />
        <Tooltip
          contentStyle={{
            background: '#1a202e',
            border: 'none',
            borderRadius: '8px',
            color: '#f8fafc',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
          }}
        />
        <Bar dataKey="players" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
