import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchCisaIncidents } from './liveThreatFeed';

describe('liveThreatFeed', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles network failure gracefully without crashing', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network offline'));
    const result = await fetchCisaIncidents();
    expect(result).toEqual([]);
  });

  it('parses valid CISA feed items into IncidentLog format', async () => {
    const mockFeed = {
      vulnerabilities: [
        {
          cveID: 'CVE-2026-9999',
          vendorProject: 'Linux',
          product: 'Kernel',
          vulnerabilityName: 'Buffer overflow vulnerability in network stack',
          dateAdded: '2026-10-28',
          shortDescription: 'Critical issue',
          requiredAction: 'Patch now',
          knownRansomwareCampaignUse: 'Known'
        }
      ]
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockFeed
    } as Response);

    const result = await fetchCisaIncidents();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('CVE-2026-9999');
    expect(result[0].risk).toBe('critical');
    expect(result[0].targetService).toBe('Linux Kernel');
  });
});
