import { describe, it, expect, beforeEach } from 'vitest';
import {
  filterIncidents,
  filterAuditLogs,
  exportLogsToCsv,
  calculateInfrastructureHealth,
  generateSyntheticPacket,
  loadPersistedIncidents,
  savePersistedIncidents,
  clearPersistedData
} from './securityHelpers';
import type { SecurityIncident, AuditLog, InfrastructureNode } from '../types/security';

describe('securityHelpers', () => {
  const sampleIncidents: SecurityIncident[] = [
    {
      id: 'SEC-101',
      sourceIp: '192.168.1.10',
      targetService: 'Auth Node',
      risk: 'high',
      reason: 'Brute force wave',
      payloadSize: '5.2 MB',
      timestamp: '1m ago',
      status: 'pending',
      cve: 'CVE-2025-2411',
      mitre: { id: 'T1110.001', name: 'Password Guessing', tactic: 'Credential Access' }
    },
    {
      id: 'SEC-102',
      sourceIp: '10.0.0.5',
      targetService: 'DB Node',
      risk: 'medium',
      reason: 'SQL syntax error',
      payloadSize: '1.2 MB',
      timestamp: '5m ago',
      status: 'resolved'
    },
    {
      id: 'SEC-103',
      sourceIp: '172.16.0.4',
      targetService: 'Gateway',
      risk: 'low',
      reason: 'Port scan',
      payloadSize: '0.4 MB',
      timestamp: '15m ago',
      status: 'investigating'
    }
  ];

  it('filters incidents by risk level correctly', () => {
    const highAlerts = filterIncidents(sampleIncidents, 'high', 'all');
    expect(highAlerts).toHaveLength(1);
    expect(highAlerts[0].id).toBe('SEC-101');
  });

  it('filters incidents by status correctly', () => {
    const resolved = filterIncidents(sampleIncidents, 'all', 'resolved');
    expect(resolved).toHaveLength(1);
    expect(resolved[0].id).toBe('SEC-102');
  });

  it('filters incidents by search query', () => {
    const found = filterIncidents(sampleIncidents, 'all', 'all', 'brute');
    expect(found).toHaveLength(1);
    expect(found[0].sourceIp).toBe('192.168.1.10');
  });

  it('filters incidents by MITRE technique and CVE', () => {
    const byMitre = filterIncidents(sampleIncidents, 'all', 'all', 'T1110');
    expect(byMitre).toHaveLength(1);
    expect(byMitre[0].id).toBe('SEC-101');

    const byCve = filterIncidents(sampleIncidents, 'all', 'all', 'CVE-2025');
    expect(byCve).toHaveLength(1);
    expect(byCve[0].id).toBe('SEC-101');
  });

  const sampleLogs: AuditLog[] = [
    {
      id: 'LOG-01',
      principal: 'alex_admin',
      type: 'SSH Access',
      payloadSize: 1200,
      method: 'SSH',
      timestamp: '12:00:00',
      status: 'success',
      clientIp: '192.168.1.5',
      details: 'Shell login ok'
    },
    {
      id: 'LOG-02',
      principal: 'guest_user',
      type: 'API Call',
      payloadSize: 400,
      method: 'HTTPS',
      timestamp: '12:05:00',
      status: 'failed',
      clientIp: '85.143.20.91',
      details: 'Denied 403'
    }
  ];

  it('filters audit logs by type and status', () => {
    const sshLogs = filterAuditLogs(sampleLogs, 'SSH Access', 'all');
    expect(sshLogs).toHaveLength(1);
    expect(sshLogs[0].principal).toBe('alex_admin');

    const failedLogs = filterAuditLogs(sampleLogs, 'all', 'failed');
    expect(failedLogs).toHaveLength(1);
    expect(failedLogs[0].id).toBe('LOG-02');
  });

  it('exports audit logs into valid CSV format', () => {
    const csv = exportLogsToCsv(sampleLogs);
    expect(csv).toContain('Log ID,Principal,Event Type');
    expect(csv).toContain('LOG-01,"alex_admin","SSH Access"');
  });

  it('calculates infrastructure health score accurately', () => {
    const nodes: InfrastructureNode[] = [
      {
        id: 1,
        name: 'Node 1',
        category: 'Microservice',
        region: 'EU-WEST-1',
        ipAddress: '10.0.1.1',
        cpuLoad: '10%',
        memoryUsage: '2 GB / 8 GB',
        threads: 50,
        dataTransferred: '10 GB',
        uptime: '99.9%',
        status: 'healthy',
        requestsPerSec: 100
      },
      {
        id: 2,
        name: 'Node 2',
        category: 'Gateway',
        region: 'US-EAST-1',
        ipAddress: '10.0.2.1',
        cpuLoad: '20%',
        memoryUsage: '4 GB / 8 GB',
        threads: 80,
        dataTransferred: '20 GB',
        uptime: '99.9%',
        status: 'healthy',
        requestsPerSec: 200
      }
    ];

    const score = calculateInfrastructureHealth(nodes, 2);
    expect(score).toBe(95);
  });

  it('generates synthetic packet properly', () => {
    const packet = generateSyntheticPacket(99, true);
    expect(packet.id).toBe(99);
    expect(packet.type).toBe('blocked');
    expect(packet.statusText).toMatch(/Blocked|Unauthorized/);
    expect(packet.sourceIp).toBeDefined();
  });

  describe('Storage persistence', () => {
    beforeEach(() => {
      clearPersistedData();
    });

    it('loads fallback when storage is empty', () => {
      const result = loadPersistedIncidents(sampleIncidents);
      expect(result).toEqual(sampleIncidents);
    });

    it('saves and reloads incidents accurately', () => {
      const modified = [{ ...sampleIncidents[0], status: 'resolved' as const }];
      savePersistedIncidents(modified);
      const reloaded = loadPersistedIncidents(sampleIncidents);
      expect(reloaded).toHaveLength(1);
      expect(reloaded[0].status).toBe('resolved');
    });
  });
});
