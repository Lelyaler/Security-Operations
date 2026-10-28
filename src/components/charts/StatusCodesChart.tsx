import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { HttpStatusShare } from '../../types/analytics';
import { tooltipStyle } from './chartTheme';

interface StatusCodesChartProps {
  data: HttpStatusShare[];
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

export default function StatusCodesChart({ data }: StatusCodesChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="status-chart">
      <div className="status-chart-donut">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => (typeof value === 'number' ? value.toLocaleString('en') : String(value))}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="status-chart-total">
          <span className="font-mono">{compact.format(total)}</span>
          <small>requests</small>
        </div>
      </div>

      <ul className="status-legend">
        {data.map((item) => (
          <li key={item.status}>
            <i style={{ background: item.color }} />
            <span>{item.status}</span>
            <b className="font-mono">{item.share}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
