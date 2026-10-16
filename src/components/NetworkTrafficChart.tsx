import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { TrafficDataPoint } from '../types/security';

interface NetworkTrafficChartProps {
  data: TrafficDataPoint[];
}

export default function NetworkTrafficChart({ data }: NetworkTrafficChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a82d46" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#a82d46" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 235, 240, 0.05)" />
        <XAxis dataKey="name" stroke="#826f75" fontSize={11} tickLine={false} />
        <YAxis stroke="#826f75" fontSize={11} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: '#281b20',
            border: 'none',
            borderRadius: '8px',
            color: '#fdf2f4',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
          }}
        />
        <Area type="monotone" dataKey="Traffic" stroke="#a82d46" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
        <Area type="monotone" dataKey="Threats" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
