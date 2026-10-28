import type { ProtocolShare } from '../../types/analytics';

interface ProtocolChartProps {
  data: ProtocolShare[];
}

export default function ProtocolChart({ data }: ProtocolChartProps) {
  const max = Math.max(...data.map((item) => item.connections));

  return (
    <ul className="protocol-list">
      {data.map((item) => (
        <li key={item.name}>
          <div className="protocol-row">
            <span>{item.name}</span>
            <span className="font-mono">
              {item.connections.toLocaleString('en')} <em>{item.share}</em>
            </span>
          </div>
          <div className="protocol-bar">
            <div style={{ width: `${(item.connections / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
