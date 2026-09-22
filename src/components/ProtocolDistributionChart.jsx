import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#8b5cf6', '#fbbf24', '#3b82f6'];

export default function ProtocolDistributionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
        <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
        <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} width={100} />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-dark)',
            border: '1px solid var(--card-border)',
            borderRadius: '8px'
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
