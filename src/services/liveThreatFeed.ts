import type { IncidentLog } from '../types/analytics';

interface CisaItem {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  knownRansomwareCampaignUse?: string;
}

export async function fetchCisaIncidents(): Promise<IncidentLog[]> {
  try {
    const res = await fetch('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    const vulns: CisaItem[] = data.vulnerabilities?.slice(0, 15) || [];

    return vulns.map((v, idx) => {
      const hash = v.cveID.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const ip = `198.51.${100 + (hash % 10)}.${(hash % 240) + 10}`;

      return {
        id: v.cveID,
        sourceIp: ip,
        targetService: `${v.vendorProject} ${v.product}`,
        risk: (v.knownRansomwareCampaignUse && v.knownRansomwareCampaignUse !== 'Unknown') ? 'critical' : 'high',
        reason: v.vulnerabilityName,
        payloadSize: `${((hash % 45) / 10 + 1.2).toFixed(1)} KB`,
        timestamp: `${v.dateAdded}`,
        status: idx < 3 ? 'pending' : (idx < 7 ? 'investigating' : 'resolved'),
        httpStatus: 403,
        endpoint: `/api/v1/probes/${v.cveID.toLowerCase()}`,
        userAgent: `Scanner/2.4 (${v.vendorProject} Probe)`,
        rawEvent: JSON.stringify(v, null, 2)
      };
    });
  } catch (err) {
    console.warn('Failed to fetch live CISA feed:', err);
    return [];
  }
}
