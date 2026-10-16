import { ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import type { ProtocolShare } from '../types/security';

const COLORS = ['#a82d46', '#c06c4b', '#9f1239', '#d97706'];

interface ProtocolDistributionChartProps {
  data: ProtocolShare[];
}

export default function ProtocolDistributionChart({ data }: ProtocolDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" barSize={12}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 235, 240, 0.05)" horizontal={false} />
        <XAxis type="number" stroke="#826f75" fontSize={11} tickLine={false} />
        <YAxis dataKey="name" type="category" stroke="#b59da3" fontSize={11} tickLine={false} width={100} />
        <Tooltip
          contentStyle={{
            background: '#281b20',
            border: 'none',
            borderRadius: '8px',
            color: '#fdf2f4',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
          }}
          formatter={(value: any) => [`${Number(value).toLocaleString()} active sockets`, 'Connections']}
        />
        <Bar dataKey="connections" radius={[0, 4, 4, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
