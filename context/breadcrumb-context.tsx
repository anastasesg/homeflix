'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface BreadcrumbContextValue {
  overrides: Map<string, string>;
  setOverride: (segment: string, label: string) => void;
  clearOverride: (segment: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const [overrides, setOverrides] = useState<Map<string, string>>(new Map());

  const setOverride = useCallback((segment: string, label: string) => {
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(segment, label);
      return next;
    });
  }, []);

  const clearOverride = useCallback((segment: string) => {
    setOverrides((prev) => {
      const next = new Map(prev);
      next.delete(segment);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ overrides, setOverride, clearOverride }), [overrides, setOverride, clearOverride]);

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>;
}

export function useBreadcrumbOverride() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbOverride must be used within a BreadcrumbProvider');
  }
  return context;
}

/**
 * Hook for detail pages to set their breadcrumb label.
 * Key is the full href (e.g. "/media/shows/1399") to avoid collisions
 * between segments with the same name at different depths.
 * Automatically cleans up when the component unmounts.
 */
export function useSetBreadcrumb(href: string | undefined, label: string | undefined) {
  const { setOverride, clearOverride } = useBreadcrumbOverride();

  useEffect(() => {
    if (href && label) {
      setOverride(href, label);
    }
    return () => {
      if (href) {
        clearOverride(href);
      }
    };
  }, [href, label, setOverride, clearOverride]);
}
