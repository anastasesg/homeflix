'use client';

import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

export const discoverSortFields = ['popularity', 'rating', 'release_date', 'title', 'revenue'] as const;
export const discoverSortDirections = ['asc', 'desc'] as const;
export const discoverViewModes = ['grid', 'list'] as const;

export type DiscoverSortField = (typeof discoverSortFields)[number];
export type DiscoverSortDirection = (typeof discoverSortDirections)[number];
export type DiscoverViewMode = (typeof discoverViewModes)[number];

export interface DiscoverFilterState {
  q: string;
  sort: DiscoverSortField;
  dir: DiscoverSortDirection;
  view: DiscoverViewMode;
  genres: number[];
  yearMin: number | null;
  yearMax: number | null;
  ratingMin: number | null;
  runtimeMin: number | null;
  runtimeMax: number | null;
  language: string;
  voteCountMin: number | null;
  certifications: string[];
  providers: number[];
  keywords: number[];
  cast: number[];
  crew: number[];
  region: string;
}

const filterParsers = {
  q: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(discoverSortFields).withDefault('popularity'),
  dir: parseAsStringLiteral(discoverSortDirections).withDefault('desc'),
  view: parseAsStringLiteral(discoverViewModes).withDefault('grid'),
  genres: parseAsArrayOf(parseAsInteger).withDefault([]),
  yearMin: parseAsInteger,
  yearMax: parseAsInteger,
  ratingMin: parseAsFloat,
  runtimeMin: parseAsInteger,
  runtimeMax: parseAsInteger,
  language: parseAsString.withDefault(''),
  voteCountMin: parseAsInteger,
  certifications: parseAsArrayOf(parseAsString).withDefault([]),
  providers: parseAsArrayOf(parseAsInteger).withDefault([]),
  keywords: parseAsArrayOf(parseAsInteger).withDefault([]),
  cast: parseAsArrayOf(parseAsInteger).withDefault([]),
  crew: parseAsArrayOf(parseAsInteger).withDefault([]),
  region: parseAsString.withDefault('US'),
};

export function useDiscoverFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'replace',
    shallow: true,
  });

  const setSearch = (q: string) => setFilters({ q });
  const setSort = (sort: DiscoverSortField) => setFilters({ sort });
  const setSortDirection = (dir: DiscoverSortDirection) => setFilters({ dir });
  const toggleSortDirection = () => setFilters({ dir: filters.dir === 'asc' ? 'desc' : 'asc' });
  const setView = (view: DiscoverViewMode) => setFilters({ view });
  const setGenres = (genres: number[]) => setFilters({ genres });
  const setYearRange = (yearMin: number | null, yearMax: number | null) => setFilters({ yearMin, yearMax });
  const setRatingMin = (ratingMin: number | null) => setFilters({ ratingMin });
  const setRuntimeRange = (runtimeMin: number | null, runtimeMax: number | null) =>
    setFilters({ runtimeMin, runtimeMax });
  const setLanguage = (language: string) => setFilters({ language });
  const setVoteCountMin = (voteCountMin: number | null) => setFilters({ voteCountMin });
  const setCertifications = (certifications: string[]) => setFilters({ certifications });
  const setProviders = (providers: number[]) => setFilters({ providers });
  const setKeywords = (keywords: number[]) => setFilters({ keywords });
  const setCast = (cast: number[]) => setFilters({ cast });
  const setCrew = (crew: number[]) => setFilters({ crew });
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
      certifications: [],
      providers: [],
      keywords: [],
      cast: [],
      crew: [],
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
    filters.certifications.length > 0 ||
    filters.providers.length > 0 ||
    filters.keywords.length > 0 ||
    filters.cast.length > 0 ||
    filters.crew.length > 0;

  const activeFilterCount =
    (filters.q !== '' ? 1 : 0) +
    (filters.genres.length > 0 ? 1 : 0) +
    (filters.yearMin !== null || filters.yearMax !== null ? 1 : 0) +
    (filters.ratingMin !== null ? 1 : 0) +
    (filters.runtimeMin !== null || filters.runtimeMax !== null ? 1 : 0) +
    (filters.language !== '' ? 1 : 0) +
    (filters.voteCountMin !== null ? 1 : 0) +
    (filters.certifications.length > 0 ? 1 : 0) +
    (filters.providers.length > 0 ? 1 : 0) +
    (filters.keywords.length > 0 ? 1 : 0) +
    (filters.cast.length > 0 ? 1 : 0) +
    (filters.crew.length > 0 ? 1 : 0);

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
    setCertifications,
    setProviders,
    setKeywords,
    setCast,
    setCrew,
    setRegion,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
