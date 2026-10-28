import type { CSSProperties } from 'react';

export const palette = {
  primary: '#0d9488',
  primarySoft: '#5eead4',
  slate: '#94a3b8',
  danger: '#dc2626',
  warning: '#d97706',
  success: '#16a34a',
  info: '#2563eb'
};

export const axisProps = {
  stroke: '#94a3b8',
  fontSize: 11,
  tickLine: false,
  axisLine: false
} as const;

export const gridProps = {
  strokeDasharray: '3 3',
  stroke: '#e2e8f0'
} as const;

export const tooltipStyle: CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  color: '#0f172a',
  fontSize: 12,
  boxShadow: '0 8px 20px -6px rgba(15, 23, 42, 0.12)'
};

export const tooltipLabelStyle: CSSProperties = {
  color: '#0f172a',
  fontWeight: 600,
  marginBottom: 4
};
