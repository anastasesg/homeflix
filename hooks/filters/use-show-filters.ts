'use client';

import { parseAsStringLiteral, useQueryStates } from 'nuqs';

import type { ShowTabValue } from '@/api/utils';

export const showViewModes = ['grid', 'list'] as const;
export const showTabValues = ['all', 'continuing', 'complete', 'missing'] as const;

export type ShowViewMode = (typeof showViewModes)[number];
export type ShowTabValueType = ShowTabValue;

export interface ShowFilterState {
  tab: ShowTabValueType;
  view: ShowViewMode;
}

const filterParsers = {
  tab: parseAsStringLiteral(showTabValues).withDefault('all'),
  view: parseAsStringLiteral(showViewModes).withDefault('grid'),
};

export function useShowFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'replace',
    shallow: true,
  });
  const setTab = (tab: string) => setFilters({ tab: tab as ShowTabValueType });
  const setView = (view: string) => setFilters({ view: view as ShowViewMode });

  return {
    filters,
    setFilters,
    setTab,
    setView,
  };
}
