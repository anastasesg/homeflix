'use client';

import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

import type { ShowSortField, ShowTabValue } from '@/api/utils';

export const showSortFields = ['added', 'title', 'year', 'rating', 'nextAiring'] as const;
export const showSortDirections = ['asc', 'desc'] as const;
export const showTabValues = ['all', 'continuing', 'complete', 'missing'] as const;
export const showViewModes = ['grid', 'list'] as const;

export type ShowSortFieldType = ShowSortField;
export type ShowSortDirection = (typeof showSortDirections)[number];
export type ShowTabValueType = ShowTabValue;
export type ShowViewMode = (typeof showViewModes)[number];

export interface ShowFilterState {
  q: string;
  sort: ShowSortFieldType;
  dir: ShowSortDirection;
  tab: ShowTabValueType;
  view: ShowViewMode;
  genres: string[];
  networks: string[];
  yearMin: number | null;
  yearMax: number | null;
  ratingMin: number | null;
}

const filterParsers = {
  q: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(showSortFields).withDefault('added'),
  dir: parseAsStringLiteral(showSortDirections).withDefault('desc'),
  tab: parseAsStringLiteral(showTabValues).withDefault('all'),
  view: parseAsStringLiteral(showViewModes).withDefault('grid'),
  genres: parseAsArrayOf(parseAsString).withDefault([]),
  networks: parseAsArrayOf(parseAsString).withDefault([]),
  yearMin: parseAsInteger,
  yearMax: parseAsInteger,
  ratingMin: parseAsInteger,
};

export function useShowFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'replace',
    shallow: true,
  });

  const setSearch = (q: string) => setFilters({ q });
  const setSort = (sort: ShowSortFieldType) => setFilters({ sort });
  const setSortDirection = (dir: ShowSortDirection) => setFilters({ dir });
  const toggleSortDirection = () => setFilters({ dir: filters.dir === 'asc' ? 'desc' : 'asc' });
  const setTab = (tab: ShowTabValueType) => setFilters({ tab });
  const setView = (view: ShowViewMode) => setFilters({ view });
  const setGenres = (genres: string[]) => setFilters({ genres });
  const setNetworks = (networks: string[]) => setFilters({ networks });
  const setYearRange = (yearMin: number | null, yearMax: number | null) => setFilters({ yearMin, yearMax });
  const setRatingMin = (ratingMin: number | null) => setFilters({ ratingMin });

  const clearFilters = () =>
    setFilters({
      q: '',
      genres: [],
      networks: [],
      yearMin: null,
      yearMax: null,
      ratingMin: null,
    });

  const hasActiveFilters =
    filters.q !== '' ||
    filters.genres.length > 0 ||
    filters.networks.length > 0 ||
    filters.yearMin !== null ||
    filters.yearMax !== null ||
    filters.ratingMin !== null;

  const activeFilterCount =
    (filters.q !== '' ? 1 : 0) +
    (filters.genres.length > 0 ? 1 : 0) +
    (filters.networks.length > 0 ? 1 : 0) +
    (filters.yearMin !== null || filters.yearMax !== null ? 1 : 0) +
    (filters.ratingMin !== null ? 1 : 0);

  return {
    filters,
    setFilters,
    setSearch,
    setSort,
    setSortDirection,
    toggleSortDirection,
    setTab,
    setView,
    setGenres,
    setNetworks,
    setYearRange,
    setRatingMin,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
