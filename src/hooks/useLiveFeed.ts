import { useEffect, useState } from 'react';
import type { NetworkPacket } from '../types/analytics';
import { apiClient } from '../services/apiClient';
import { seedPackets } from '../utils/analyticsHelpers';

const BUFFER_SIZE = 8;

export function useLiveFeed(intervalMs: number) {
  const [packets, setPackets] = useState<NetworkPacket[]>(() => seedPackets(BUFFER_SIZE, intervalMs));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    let cancelled = false;
    const id = setInterval(async () => {
      const packet = await apiClient.fetchLivePacket();
      if (!cancelled) {
        setPackets((prev) => [packet, ...prev].slice(0, BUFFER_SIZE));
      }
    }, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [paused, intervalMs]);

  return {
    packets,
    paused,
    togglePaused: () => setPaused((p) => !p),
    clear: () => setPackets([])
  };
}
