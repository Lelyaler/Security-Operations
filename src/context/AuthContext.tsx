import { useState, ReactNode } from 'react';
import { AuthContext, OperatorProfile, TimeRange } from './authTypes';

export type { OperatorProfile, TimeRange };

const defaultProfile: OperatorProfile = {
  name: 'Alexander K.',
  initials: 'AK',
  callsign: '#8841-SEC',
  email: 'ops-alexander@corp.internal.sec',
  role: 'Tier 3 Lead Analyst',
  clearanceLevel: 'RESTRICTED // INCIDENT COMMANDER',
  clusterRegion: 'Cluster PROD · SEC-EU-1',
  hsmToken: 'YubiKey 5 NFC (FIDO2) · Serial #18492041',
  sessionStarted: 'Today at 08:30:14 UTC',
  activeCrtCn: 'secops-lead-alexander.crt',
  sessionFingerprint: 'A4:8F:D2:71:09:BB:6E:91:3C:7A:45:90:E1:FA:32:04:99:BC:21:4E',
  keyRotatedAt: 'Today at 08:30:14 UTC'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [operator, setOperator] = useState<OperatorProfile>(defaultProfile);
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');

  const rotateSessionKey = async (): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const hex = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .toUpperCase()
        .padStart(2, '0')
    ).join(':');

    const rotatedTime = `Just now (${new Date().toTimeString().slice(0, 8)} UTC)`;

    setOperator((prev) => ({
      ...prev,
      sessionFingerprint: hex,
      keyRotatedAt: rotatedTime
    }));

    return hex;
  };

  return (
    <AuthContext.Provider
      value={{
        operator,
        timeRange,
        setTimeRange,
        rotateSessionKey
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
