import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { LatencyDataPoint } from '../../types/analytics';
import { axisProps, gridProps, palette, tooltipLabelStyle, tooltipStyle } from './chartTheme';

interface LatencyChartProps {
  data: LatencyDataPoint[];
}

const series = [
  { key: 'p50', color: palette.primary, width: 2 },
  { key: 'p95', color: palette.warning, width: 1.5 },
  { key: 'p99', color: palette.danger, width: 1.5 }
] as const;

export default function LatencyChart({ data }: LatencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey="time" {...axisProps} dy={6} />
        <YAxis {...axisProps} unit=" ms" width={56} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={tooltipLabelStyle}
          formatter={(value) => `${value} ms`}
        />
        <Legend verticalAlign="top" align="right" iconType="circle" iconSize={7} height={28} wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            stroke={s.color}
            strokeWidth={s.width}
            dot={false}
            activeDot={{ r: 3 }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
