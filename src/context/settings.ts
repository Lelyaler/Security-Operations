import { createContext } from 'react';
import type { ClockMode } from '../utils/analyticsHelpers';

export interface Operator {
  name: string;
  initials: string;
  email: string;
  role: string;
}

export interface Preferences {
  refreshSeconds: 1 | 3 | 5;
  clock: ClockMode;
}

export interface SettingsContextValue {
  operator: Operator;
  preferences: Preferences;
  updatePreferences: (patch: Partial<Preferences>) => void;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);
