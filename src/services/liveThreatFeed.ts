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

    return vulns.map((v, idx) => ({
      id: v.cveID,
      sourceIp: `cisa.gov/${v.vendorProject.toLowerCase().replace(/\s+/g, '-')}`,
      targetService: `${v.vendorProject} ${v.product}`,
      risk: (v.knownRansomwareCampaignUse && v.knownRansomwareCampaignUse !== 'Unknown') ? 'critical' : 'high',
      reason: v.vulnerabilityName,
      payloadSize: 'Exploit signature',
      timestamp: `${v.dateAdded}`,
      status: idx < 3 ? 'pending' : (idx < 7 ? 'investigating' : 'resolved'),
      httpStatus: 403,
      endpoint: `/cve/${v.cveID.toLowerCase()}`,
      userAgent: 'CISA KEV Feed (Automated Ingest)',
      rawEvent: JSON.stringify(v, null, 2)
    }));
  } catch (err) {
    console.warn('Failed to fetch live CISA feed:', err);
    return [];
  }
}
