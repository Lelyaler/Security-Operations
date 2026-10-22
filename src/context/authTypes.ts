import { createContext } from 'react';

export type TimeRange = '15m' | '1h' | '6h' | '24h' | '7d';

export interface OperatorProfile {
  name: string;
  initials: string;
  callsign: string;
  email: string;
  role: string;
  clearanceLevel: string;
  clusterRegion: string;
  hsmToken: string;
  sessionStarted: string;
  activeCrtCn: string;
  sessionFingerprint: string;
  keyRotatedAt: string;
}

export interface AuthContextType {
  operator: OperatorProfile;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  rotateSessionKey: () => Promise<string>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
