import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = ['#f59e0b', '#10b981', '#f97316', '#a1a1aa'];

export default function ProtocolDistributionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" barSize={12}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
        <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} />
        <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={11} tickLine={false} width={100} />
        <Tooltip
          contentStyle={{
            background: '#191d27',
            border: 'none',
            borderRadius: '8px',
            color: '#f4f4f5',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
          }}
        />
        <Bar dataKey="players" radius={[0, 4, 4, 0]} name="Active Sockets">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
