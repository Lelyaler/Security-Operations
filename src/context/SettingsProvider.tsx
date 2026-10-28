import { useState, type ReactNode } from 'react';
import { SettingsContext, type Operator, type Preferences } from './settings';

const operator: Operator = {
  name: 'Valeriya Cherniavskaya',
  initials: 'VC',
  email: 'lelyaler@gmail.com',
  role: 'Security Operations Engineer'
};

const STORAGE_KEY = 'secops_prefs_v2';
const defaults: Preferences = { refreshSeconds: 3, clock: 'local' };

function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(loadPreferences);

  const updatePreferences = (patch: Partial<Preferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
      }
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ operator, preferences, updatePreferences }}>
      {children}
    </SettingsContext.Provider>
  );
}
