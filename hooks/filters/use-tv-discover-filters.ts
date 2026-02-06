'use client';

import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

export const tvDiscoverSortFields = ['popularity', 'rating', 'first_air_date', 'name'] as const;
export const tvDiscoverSortDirections = ['asc', 'desc'] as const;
export const tvDiscoverViewModes = ['grid', 'list'] as const;

export type TVDiscoverSortField = (typeof tvDiscoverSortFields)[number];
export type TVDiscoverSortDirection = (typeof tvDiscoverSortDirections)[number];
export type TVDiscoverViewMode = (typeof tvDiscoverViewModes)[number];

export interface TVDiscoverFilterState {
  q: string;
  sort: TVDiscoverSortField;
  dir: TVDiscoverSortDirection;
  view: TVDiscoverViewMode;
  genres: number[];
  yearMin: number | null;
  yearMax: number | null;
  ratingMin: number | null;
  runtimeMin: number | null;
  runtimeMax: number | null;
  language: string;
  voteCountMin: number | null;
  providers: number[];
  keywords: number[];
  networks: number[];
  status: string[];
  region: string;
}

const filterParsers = {
  q: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(tvDiscoverSortFields).withDefault('popularity'),
  dir: parseAsStringLiteral(tvDiscoverSortDirections).withDefault('desc'),
  view: parseAsStringLiteral(tvDiscoverViewModes).withDefault('grid'),
  genres: parseAsArrayOf(parseAsInteger).withDefault([]),
  yearMin: parseAsInteger,
  yearMax: parseAsInteger,
  ratingMin: parseAsFloat,
  runtimeMin: parseAsInteger,
  runtimeMax: parseAsInteger,
  language: parseAsString.withDefault(''),
  voteCountMin: parseAsInteger,
  providers: parseAsArrayOf(parseAsInteger).withDefault([]),
  keywords: parseAsArrayOf(parseAsInteger).withDefault([]),
  networks: parseAsArrayOf(parseAsInteger).withDefault([]),
  status: parseAsArrayOf(parseAsString).withDefault([]),
  region: parseAsString.withDefault('US'),
};

export function useTVDiscoverFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'replace',
    shallow: true,
  });

  const setSearch = (q: string) => setFilters({ q });
  const setSort = (sort: TVDiscoverSortField) => setFilters({ sort });
  const setSortDirection = (dir: TVDiscoverSortDirection) => setFilters({ dir });
  const toggleSortDirection = () => setFilters({ dir: filters.dir === 'asc' ? 'desc' : 'asc' });
  const setView = (view: TVDiscoverViewMode) => setFilters({ view });
  const setGenres = (genres: number[]) => setFilters({ genres });
  const setYearRange = (yearMin: number | null, yearMax: number | null) => setFilters({ yearMin, yearMax });
  const setRatingMin = (ratingMin: number | null) => setFilters({ ratingMin });
  const setRuntimeRange = (runtimeMin: number | null, runtimeMax: number | null) =>
    setFilters({ runtimeMin, runtimeMax });
  const setLanguage = (language: string) => setFilters({ language });
  const setVoteCountMin = (voteCountMin: number | null) => setFilters({ voteCountMin });
  const setProviders = (providers: number[]) => setFilters({ providers });
  const setKeywords = (keywords: number[]) => setFilters({ keywords });
  const setNetworks = (networks: number[]) => setFilters({ networks });
  const setStatus = (status: string[]) => setFilters({ status });
  const setRegion = (region: string) => setFilters({ region });

  const clearFilters = () =>
    setFilters({
      q: '',
      genres: [],
      yearMin: null,
      yearMax: null,
      ratingMin: null,
      runtimeMin: null,
      runtimeMax: null,
      language: '',
      voteCountMin: null,
      providers: [],
      keywords: [],
      networks: [],
      status: [],
    });

  const hasActiveFilters =
    filters.q !== '' ||
    filters.genres.length > 0 ||
    filters.yearMin !== null ||
    filters.yearMax !== null ||
    filters.ratingMin !== null ||
    filters.runtimeMin !== null ||
    filters.runtimeMax !== null ||
    filters.language !== '' ||
    filters.voteCountMin !== null ||
    filters.providers.length > 0 ||
    filters.keywords.length > 0 ||
    filters.networks.length > 0 ||
    filters.status.length > 0;

  const activeFilterCount =
    (filters.q !== '' ? 1 : 0) +
    (filters.genres.length > 0 ? 1 : 0) +
    (filters.yearMin !== null || filters.yearMax !== null ? 1 : 0) +
    (filters.ratingMin !== null ? 1 : 0) +
    (filters.runtimeMin !== null || filters.runtimeMax !== null ? 1 : 0) +
    (filters.language !== '' ? 1 : 0) +
    (filters.voteCountMin !== null ? 1 : 0) +
    (filters.providers.length > 0 ? 1 : 0) +
    (filters.keywords.length > 0 ? 1 : 0) +
    (filters.networks.length > 0 ? 1 : 0) +
    (filters.status.length > 0 ? 1 : 0);

  return {
    filters,
    setFilters,
    setSearch,
    setSort,
    setSortDirection,
    toggleSortDirection,
    setView,
    setGenres,
    setYearRange,
    setRatingMin,
    setRuntimeRange,
    setLanguage,
    setVoteCountMin,
    setProviders,
    setKeywords,
    setNetworks,
    setStatus,
    setRegion,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
