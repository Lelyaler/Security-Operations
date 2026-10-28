import { describe, it, expect, beforeEach } from 'vitest';
import {
  filterIncidents,
  formatClock,
  nextPacket,
  seedPackets,
  loadPersistedIncidents,
  savePersistedIncidents,
  clearPersistedData
} from './analyticsHelpers';
import type { IncidentLog } from '../types/analytics';

describe('analyticsHelpers', () => {
  const sampleIncidents: IncidentLog[] = [
    {
      id: 'INC-101',
      sourceIp: '192.168.1.10',
      targetService: 'Auth Service',
      risk: 'high',
      reason: 'Rate limit exceeded',
      payloadSize: '5.2 MB',
      timestamp: '1m ago',
      status: 'pending',
      httpStatus: 429,
      endpoint: '/api/v1/auth/login'
    },
    {
      id: 'INC-102',
      sourceIp: '10.0.0.5',
      targetService: 'DB Service',
      risk: 'medium',
      reason: 'Gateway timeout',
      payloadSize: '1.2 MB',
      timestamp: '5m ago',
      status: 'resolved',
      httpStatus: 504,
      endpoint: '/api/v2/checkout'
    },
    {
      id: 'INC-103',
      sourceIp: '172.16.0.4',
      targetService: 'Gateway Edge',
      risk: 'low',
      reason: 'CORS failure',
      payloadSize: '0.4 MB',
      timestamp: '15m ago',
      status: 'investigating',
      httpStatus: 403,
      endpoint: '/graphql'
    }
  ];

  it('filters incidents by risk level correctly', () => {
    const highAlerts = filterIncidents(sampleIncidents, 'high', 'all');
    expect(highAlerts).toHaveLength(1);
    expect(highAlerts[0].id).toBe('INC-101');
  });

  it('filters incidents by status correctly', () => {
    const resolved = filterIncidents(sampleIncidents, 'all', 'resolved');
    expect(resolved).toHaveLength(1);
    expect(resolved[0].id).toBe('INC-102');
  });

  it('filters incidents by search query', () => {
    const byIp = filterIncidents(sampleIncidents, 'all', 'all', '  192.168  ');
    expect(byIp).toHaveLength(1);
    expect(byIp[0].id).toBe('INC-101');

    const byReason = filterIncidents(sampleIncidents, 'all', 'all', 'cors');
    expect(byReason).toHaveLength(1);
    expect(byReason[0].id).toBe('INC-103');
  });

  it('filters incidents by HTTP status code and endpoint', () => {
    const byStatus = filterIncidents(sampleIncidents, 'all', 'all', '504');
    expect(byStatus).toHaveLength(1);
    expect(byStatus[0].id).toBe('INC-102');

    const byEndpoint = filterIncidents(sampleIncidents, 'all', 'all', 'checkout');
    expect(byEndpoint).toHaveLength(1);
    expect(byEndpoint[0].id).toBe('INC-102');
  });

  it('formats clock time in UTC', () => {
    const ts = Date.UTC(2026, 0, 5, 7, 4, 9);
    expect(formatClock(ts, 'utc')).toBe('07:04:09');
  });

  it('cycles through packet samples with the given timestamp', () => {
    const first = nextPacket(1000);
    const second = nextPacket(2000);
    expect(first.receivedAt).toBe(1000);
    expect(second.receivedAt).toBe(2000);
    expect(first.id).not.toBe(second.id);
  });

  it('seeds packets newest first', () => {
    const packets = seedPackets(4, 1000, 10_000);
    expect(packets).toHaveLength(4);
    expect(packets.map((p) => p.receivedAt)).toEqual([10_000, 9_000, 8_000, 7_000]);
  });

  describe('Storage persistence', () => {
    beforeEach(() => {
      clearPersistedData();
    });

    it('loads fallback when storage is empty', () => {
      const loaded = loadPersistedIncidents(sampleIncidents);
      expect(loaded).toEqual(sampleIncidents);
    });

    it('saves and reloads incidents accurately', () => {
      const modified: IncidentLog[] = [{ ...sampleIncidents[0], status: 'resolved' }];
      savePersistedIncidents(modified);

      const reloaded = loadPersistedIncidents(sampleIncidents);
      expect(reloaded).toHaveLength(1);
      expect(reloaded[0].status).toBe('resolved');
      expect(reloaded[0].id).toBe('INC-101');
    });
  });
});
