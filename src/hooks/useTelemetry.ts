import { useState, useCallback } from 'react';
import type { NetworkPacket } from '../types/security';
import { initialLivePackets } from '../utils/mockData';

export interface BreachAlertInfo {
  sourceIp: string;
  endpoint: string;
  rule: string;
  cve?: string;
}

export function useTelemetry() {
  const [isDdosActive, setIsDdosActive] = useState(false);
  const [isFeedFrozen, setIsFeedFrozen] = useState(false);
  const [livePackets, setLivePackets] = useState<NetworkPacket[]>(initialLivePackets);
  const [breachEvent, setBreachEvent] = useState<BreachAlertInfo | null>(null);

  const triggerBreachSimulation = useCallback(() => {
    const randomOctet = Math.floor(Math.random() * 80) + 10;
    const ip = `185.220.101.${randomOctet}`;
    const newPacket: NetworkPacket = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sourceIp: ip,
      endpoint: '/etc/security/limits.conf',
      payloadSize: '24.2 KB',
      port: 443,
      statusText: '403 Blocked',
      type: 'blocked',
      timestamp: new Date().toTimeString().slice(0, 8),
      latencyMs: 12,
      protocol: 'TLS 1.3',
      method: 'GET'
    };

    setLivePackets((prev) => [newPacket, ...prev.slice(0, 5)]);
    setBreachEvent({
      sourceIp: ip,
      endpoint: '/etc/security/limits.conf',
      rule: 'CVE-2026-0928 (Header Injection)',
      cve: 'CVE-2026-0928'
    });

    setTimeout(() => {
      setBreachEvent(null);
    }, 6000);
  }, []);

  const dismissBreach = useCallback(() => {
    setBreachEvent(null);
  }, []);

  return {
    isDdosActive,
    setIsDdosActive,
    isFeedFrozen,
    setIsFeedFrozen,
    livePackets,
    setLivePackets,
    breachEvent,
    triggerBreachSimulation,
    dismissBreach
  };
}
