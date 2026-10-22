import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  tab: 'dashboard' | 'infrastructure' | 'threats' | 'logs';
  params: Record<string, string>;
}

function parseHash(hash: string): RouteState {
  const cleanHash = hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = cleanHash.split('?');

  const validTabs: Array<RouteState['tab']> = ['dashboard', 'infrastructure', 'threats', 'logs'];
  const tab = validTabs.includes(pathPart as RouteState['tab'])
    ? (pathPart as RouteState['tab'])
    : 'dashboard';

  const params: Record<string, string> = {};
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    searchParams.forEach((val, key) => {
      params[key] = val;
    });
  }

  return { tab, params };
}

function stringifyRoute(route: RouteState): string {
  const searchParams = new URLSearchParams();
  Object.entries(route.params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      searchParams.set(key, val);
    }
  });

  const queryStr = searchParams.toString();
  return `#/${route.tab}${queryStr ? `?${queryStr}` : ''}`;
}

export function useNavigationState() {
  const [route, setRoute] = useState<RouteState>(() => {
    if (typeof window !== 'undefined') {
      return parseHash(window.location.hash);
    }
    return { tab: 'dashboard', params: {} };
  });

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      setRoute(parsed);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTab = useCallback((tab: RouteState['tab'], newParams: Record<string, string> = {}) => {
    const nextRoute: RouteState = { tab, params: newParams };
    setRoute(nextRoute);
    window.location.hash = stringifyRoute(nextRoute);
  }, []);

  const updateParams = useCallback((newParams: Record<string, string | null>) => {
    setRoute((prev) => {
      const mergedParams = { ...prev.params };
      Object.entries(newParams).forEach(([k, v]) => {
        if (v === null || v === '') {
          delete mergedParams[k];
        } else {
          mergedParams[k] = v;
        }
      });

      const nextRoute: RouteState = { ...prev, params: mergedParams };
      const newHash = stringifyRoute(nextRoute);
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
      return nextRoute;
    });
  }, []);

  return {
    tab: route.tab,
    params: route.params,
    navigateTab,
    updateParams
  };
}
