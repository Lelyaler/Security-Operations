import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import type { ProtocolShare } from '../types/security';

const COLORS = ['#a82d46', '#c06c4b', '#9f1239', '#d97706'];

interface ProtocolDistributionChartProps {
  data: ProtocolShare[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ProtocolShare;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div className="protocol-chart-tooltip">
      <div className="protocol-tooltip-header">
        <span className="protocol-tooltip-title">{item.name}</span>
        <span className="protocol-tooltip-share font-mono">{item.share}</span>
      </div>
      <div className="protocol-tooltip-row">
        <span className="protocol-tooltip-label">Active Sockets:</span>
        <span className="protocol-tooltip-value font-mono">{item.connections.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function ProtocolDistributionChart({ data }: ProtocolDistributionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        layout="vertical"
        barSize={18}
        margin={{ top: 8, right: 16, left: 4, bottom: 4 }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 235, 240, 0.05)" horizontal={false} />
        <XAxis type="number" stroke="#826f75" fontSize={11} tickLine={false} />
        <YAxis dataKey="name" type="category" stroke="#b59da3" fontSize={11} tickLine={false} width={100} />
        <Tooltip
          cursor={{ fill: 'rgba(255, 235, 240, 0.04)', rx: 4, ry: 4 }}
          content={<CustomTooltip />}
        />
        <Bar dataKey="connections" radius={[0, 4, 4, 0]}>
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.55}
              style={{ transition: 'opacity 0.2s ease', cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(index)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
