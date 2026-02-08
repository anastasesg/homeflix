'use client';

import { parseAsStringLiteral, useQueryStates } from 'nuqs';

export const viewModes = ['grid', 'list'] as const;
export const tabValues = ['all', 'downloaded', 'downloading', 'missing', 'wanted'] as const;

export type ViewMode = (typeof viewModes)[number];
export type TabValue = (typeof tabValues)[number];

export interface MovieFilterState {
  tab: TabValue;
  view: ViewMode;
}

const filterParsers = {
  tab: parseAsStringLiteral(tabValues).withDefault('all'),
  view: parseAsStringLiteral(viewModes).withDefault('grid'),
};

export function useMovieFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'replace',
    shallow: true,
  });
  const setTab = (tab: string) => setFilters({ tab: tab as TabValue });
  const setView = (view: string) => setFilters({ view: view as ViewMode });

  return {
    filters,
    setFilters,
    setTab,
    setView,
  };
}
