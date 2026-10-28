import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { TrafficDataPoint } from '../../types/analytics';
import { axisProps, gridProps, palette, tooltipLabelStyle, tooltipStyle } from './chartTheme';

interface TrafficChartProps {
  data: TrafficDataPoint[];
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

export default function TrafficChart({ data }: TrafficChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.primary} stopOpacity={0.25} />
            <stop offset="100%" stopColor={palette.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey="label" {...axisProps} dy={6} />
        <YAxis yAxisId="requests" {...axisProps} tickFormatter={(v: number) => compact.format(v)} />
        <YAxis
          yAxisId="blocked"
          orientation="right"
          {...axisProps}
          tickFormatter={(v: number) => compact.format(v)}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={tooltipLabelStyle}
          formatter={(value) => (typeof value === 'number' ? value.toLocaleString('en') : String(value))}
        />
        <Legend verticalAlign="top" align="right" iconType="circle" iconSize={7} height={28} wrapperStyle={{ fontSize: 12 }} />
        <Area
          yAxisId="requests"
          type="monotone"
          dataKey="requests"
          name="Requests"
          stroke={palette.primary}
          strokeWidth={2}
          fill="url(#trafficFill)"
          isAnimationActive={false}
        />
        <Area
          yAxisId="blocked"
          type="monotone"
          dataKey="blocked"
          name="Blocked"
          stroke={palette.danger}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          fill="none"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
