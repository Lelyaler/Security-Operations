import type { TrafficDataPoint, NetworkPacket, TimeRange } from '../types/analytics';
import { trafficHistory24h, trafficHistory7d, trafficHistory30d } from '../utils/mockData';
import { nextPacket } from '../utils/analyticsHelpers';

const trafficByRange: Record<TimeRange, TrafficDataPoint[]> = {
  '24h': trafficHistory24h,
  '7d': trafficHistory7d,
  '30d': trafficHistory30d
};

export const apiClient = {
  async getTrafficMetrics(range: TimeRange): Promise<TrafficDataPoint[]> {
    return trafficByRange[range];
  },

  async fetchLivePacket(): Promise<NetworkPacket> {
    return nextPacket();
  }
};
