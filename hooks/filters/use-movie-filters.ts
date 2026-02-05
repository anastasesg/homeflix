'use client';

import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

export const sortFields = ['added', 'title', 'year', 'rating'] as const;
export const sortDirections = ['asc', 'desc'] as const;
export const tabValues = ['all', 'downloaded', 'downloading', 'missing', 'wanted'] as const;
export const viewModes = ['grid', 'list'] as const;

export type SortField = (typeof sortFields)[number];
export type SortDirection = (typeof sortDirections)[number];
export type TabValue = (typeof tabValues)[number];
export type ViewMode = (typeof viewModes)[number];

export interface MovieFilterState {
  q: string;
  sort: SortField;
  dir: SortDirection;
  tab: TabValue;
  view: ViewMode;
  genres: string[];
  yearMin: number | null;
  yearMax: number | null;
  ratingMin: number | null;
}

const filterParsers = {
  q: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(sortFields).withDefault('title'),
  dir: parseAsStringLiteral(sortDirections).withDefault('asc'),
  tab: parseAsStringLiteral(tabValues).withDefault('all'),
  view: parseAsStringLiteral(viewModes).withDefault('grid'),
  genres: parseAsArrayOf(parseAsString).withDefault([]),
  yearMin: parseAsInteger,
  yearMax: parseAsInteger,
  ratingMin: parseAsInteger,
};

export function useMovieFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'replace',
    shallow: true,
  });

  const setSearch = (q: string) => setFilters({ q });
  const setSort = (sort: SortField) => setFilters({ sort });
  const setSortDirection = (dir: SortDirection) => setFilters({ dir });
  const toggleSortDirection = () => setFilters({ dir: filters.dir === 'asc' ? 'desc' : 'asc' });
  const setTab = (tab: string) => setFilters({ tab: tab as TabValue });
  const setView = (view: ViewMode) => setFilters({ view });
  const setGenres = (genres: string[]) => setFilters({ genres });
  const setYearRange = (yearMin: number | null, yearMax: number | null) => setFilters({ yearMin, yearMax });
  const setRatingMin = (ratingMin: number | null) => setFilters({ ratingMin });

  const clearFilters = () =>
    setFilters({
      q: '',
      genres: [],
      yearMin: null,
      yearMax: null,
      ratingMin: null,
    });

  const hasActiveFilters =
    filters.q !== '' ||
    filters.genres.length > 0 ||
    filters.yearMin !== null ||
    filters.yearMax !== null ||
    filters.ratingMin !== null;

  const activeFilterCount =
    (filters.q !== '' ? 1 : 0) +
    (filters.genres.length > 0 ? 1 : 0) +
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
    setYearRange,
    setRatingMin,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
