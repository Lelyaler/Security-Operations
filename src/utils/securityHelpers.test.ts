import { describe, it, expect } from 'vitest';
import {
  filterAlerts,
  filterAuditLogs,
  exportLogsToCsv,
  calculateInfrastructureHealth,
  generateSyntheticPacket
} from './securityHelpers';
import type { SecurityAlert, AuditLog, ServerNode } from '../types/security';

describe('securityHelpers', () => {
  const sampleAlerts: SecurityAlert[] = [
    {
      id: 'SEC-101',
      player: '192.168.1.10',
      country: 'Auth Node',
      risk: 'high',
      reason: 'Brute force wave',
      amount: '5.2 MB',
      time: '1m ago',
      status: 'pending'
    },
    {
      id: 'SEC-102',
      player: '10.0.0.5',
      country: 'DB Node',
      risk: 'medium',
      reason: 'SQL syntax error',
      amount: '1.2 MB',
      time: '5m ago',
      status: 'resolved'
    },
    {
      id: 'SEC-103',
      player: '172.16.0.4',
      country: 'Gateway',
      risk: 'low',
      reason: 'Port scan',
      amount: '0.4 MB',
      time: '15m ago',
      status: 'investigating'
    }
  ];

  it('filters alerts by risk level correctly', () => {
    const highAlerts = filterAlerts(sampleAlerts, 'high', 'all');
    expect(highAlerts).toHaveLength(1);
    expect(highAlerts[0].id).toBe('SEC-101');
  });

  it('filters alerts by status correctly', () => {
    const resolved = filterAlerts(sampleAlerts, 'all', 'resolved');
    expect(resolved).toHaveLength(1);
    expect(resolved[0].id).toBe('SEC-102');
  });

  it('filters alerts by search query', () => {
    const found = filterAlerts(sampleAlerts, 'all', 'all', 'brute');
    expect(found).toHaveLength(1);
    expect(found[0].player).toBe('192.168.1.10');
  });

  const sampleLogs: AuditLog[] = [
    {
      id: 'LOG-01',
      player: 'alex_admin',
      type: 'SSH Access',
      amount: 1200,
      method: 'SSH',
      time: '12:00:00',
      status: 'success'
    },
    {
      id: 'LOG-02',
      player: 'guest_user',
      type: 'API Call',
      amount: 400,
      method: 'HTTPS',
      time: '12:05:00',
      status: 'failed'
    }
  ];

  it('filters audit logs by type and status', () => {
    const sshLogs = filterAuditLogs(sampleLogs, 'SSH Access', 'all');
    expect(sshLogs).toHaveLength(1);
    expect(sshLogs[0].player).toBe('alex_admin');

    const failedLogs = filterAuditLogs(sampleLogs, 'all', 'failed');
    expect(failedLogs).toHaveLength(1);
    expect(failedLogs[0].id).toBe('LOG-02');
  });

  it('exports audit logs into valid CSV format', () => {
    const csv = exportLogsToCsv(sampleLogs);
    expect(csv).toContain('Log ID,Principal,Event Type');
    expect(csv).toContain('LOG-01,"alex_admin","SSH Access",1200,SSH,12:00:00,success');
  });

  it('calculates infrastructure health score accurately', () => {
    const nodes: ServerNode[] = [
      {
        id: 1,
        name: 'Node 1',
        category: 'Microservice',
        provider: 'EU',
        rtp: '10%',
        spins: 100,
        ggr: 10,
        popularity: 96,
        activePlayers: 50,
        image: ''
      },
      {
        id: 2,
        name: 'Node 2',
        category: 'Gateway',
        provider: 'US',
        rtp: '20%',
        spins: 200,
        ggr: 20,
        popularity: 94,
        activePlayers: 80,
        image: ''
      }
    ];

    const score = calculateInfrastructureHealth(nodes, 2);
    expect(score).toBe(90);
  });

  it('generates synthetic packet properly', () => {
    const packet = generateSyntheticPacket(99, true);
    expect(packet.id).toBe(99);
    expect(packet.type).toBe('loss');
    expect(packet.win).toBe('403 Blocked');
    expect(packet.multiplier).toBe('80');
  });
});
