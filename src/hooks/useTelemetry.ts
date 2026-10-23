import { useState } from 'react';
import type { NetworkPacket } from '../types/security';
import { initialLivePackets } from '../utils/mockData';

export function useTelemetry() {
  const [isDdosActive, setIsDdosActive] = useState(false);
  const [isFeedFrozen, setIsFeedFrozen] = useState(false);
  const [livePackets, setLivePackets] = useState<NetworkPacket[]>(initialLivePackets);

  return {
    isDdosActive,
    setIsDdosActive,
    isFeedFrozen,
    setIsFeedFrozen,
    livePackets,
    setLivePackets
  };
}
