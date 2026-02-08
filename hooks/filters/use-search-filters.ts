'use client';

import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

// ============================================================================
// Constants
// ============================================================================

export const searchMediaTypes = ['all', 'movies', 'shows'] as const;
export const searchSortDirections = ['asc', 'desc'] as const;
export const searchViewModes = ['grid', 'list'] as const;

/** Sort fields valid for movies and 'all' mode */
export const searchMovieSortFields = ['popularity', 'rating', 'release_date', 'title', 'revenue'] as const;

/** Sort fields valid for shows */
export const searchShowSortFields = ['popularity', 'rating', 'first_air_date', 'name'] as const;

// ============================================================================
// Types
// ============================================================================

export type SearchMediaType = (typeof searchMediaTypes)[number];
export type SearchSortDirection = (typeof searchSortDirections)[number];
export type SearchViewMode = (typeof searchViewModes)[number];
export type SearchMovieSortField = (typeof searchMovieSortFields)[number];
export type SearchShowSortField = (typeof searchShowSortFields)[number];

export interface SearchFilterState {
  q: string;
  type: SearchMediaType;
  sort: string;
  dir: SearchSortDirection;
  view: SearchViewMode;
  // Shared filters
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
  region: string;
  // Movie-specific filters
  certifications: string[];
  cast: number[];
  crew: number[];
  // Show-specific filters
  networks: number[];
  status: string[];
}

// ============================================================================
// Parsers
// ============================================================================

const filterParsers = {
  q: parseAsString.withDefault(''),
  type: parseAsStringLiteral(searchMediaTypes).withDefault('all'),
  sort: parseAsString.withDefault('popularity'),
  dir: parseAsStringLiteral(searchSortDirections).withDefault('desc'),
  view: parseAsStringLiteral(searchViewModes).withDefault('grid'),
  // Shared filters
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
  region: parseAsString.withDefault('US'),
  // Movie-specific filters
  certifications: parseAsArrayOf(parseAsString).withDefault([]),
  cast: parseAsArrayOf(parseAsInteger).withDefault([]),
  crew: parseAsArrayOf(parseAsInteger).withDefault([]),
  // Show-specific filters
  networks: parseAsArrayOf(parseAsInteger).withDefault([]),
  status: parseAsArrayOf(parseAsString).withDefault([]),
};

// ============================================================================
// Utilities
// ============================================================================

function isValidSortForType(sort: string, type: SearchMediaType): boolean {
  if (type === 'shows') {
    return (searchShowSortFields as readonly string[]).includes(sort);
  }
  // 'movies' and 'all' share the same valid sorts
  return (searchMovieSortFields as readonly string[]).includes(sort);
}

// ============================================================================
// Hook
// ============================================================================

export function useSearchFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'replace',
    shallow: true,
  });

  // --- Setters ---------------------------------------------------------------

  const setSearch = (q: string) => setFilters({ q });

  const setType = (newType: SearchMediaType) => {
    const updates: Partial<SearchFilterState> = { type: newType };

    // Reset sort if it's not valid for the new type
    if (!isValidSortForType(filters.sort, newType)) {
      updates.sort = 'popularity';
    }

    // Clear type-specific filters that don't apply to the new type
    if (newType === 'movies') {
      updates.networks = [];
      updates.status = [];
    } else if (newType === 'shows') {
      updates.certifications = [];
      updates.cast = [];
      updates.crew = [];
    } else {
      // 'all' — clear all type-specific filters
      updates.certifications = [];
      updates.cast = [];
      updates.crew = [];
      updates.networks = [];
      updates.status = [];
    }

    setFilters(updates);
  };

  const setSort = (sort: string) => setFilters({ sort });
  const setSortDirection = (dir: SearchSortDirection) => setFilters({ dir });
  const toggleSortDirection = () => setFilters({ dir: filters.dir === 'asc' ? 'desc' : 'asc' });
  const setView = (view: SearchViewMode) => setFilters({ view });

  // Shared filter setters
  const setGenres = (genres: number[]) => setFilters({ genres });
  const setYearRange = (yearMin: number | null, yearMax: number | null) => setFilters({ yearMin, yearMax });
  const setRatingMin = (ratingMin: number | null) => setFilters({ ratingMin });
  const setRuntimeRange = (runtimeMin: number | null, runtimeMax: number | null) =>
    setFilters({ runtimeMin, runtimeMax });
  const setLanguage = (language: string) => setFilters({ language });
  const setVoteCountMin = (voteCountMin: number | null) => setFilters({ voteCountMin });
  const setProviders = (providers: number[]) => setFilters({ providers });
  const setKeywords = (keywords: number[]) => setFilters({ keywords });
  const setRegion = (region: string) => setFilters({ region });

  // Movie-specific filter setters
  const setCertifications = (certifications: string[]) => setFilters({ certifications });
  const setCast = (cast: number[]) => setFilters({ cast });
  const setCrew = (crew: number[]) => setFilters({ crew });

  // Show-specific filter setters
  const setNetworks = (networks: number[]) => setFilters({ networks });
  const setStatus = (status: string[]) => setFilters({ status });

  // --- Clear / counts --------------------------------------------------------

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
      certifications: [],
      cast: [],
      crew: [],
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
    filters.certifications.length > 0 ||
    filters.cast.length > 0 ||
    filters.crew.length > 0 ||
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
    (filters.certifications.length > 0 ? 1 : 0) +
    (filters.cast.length > 0 ? 1 : 0) +
    (filters.crew.length > 0 ? 1 : 0) +
    (filters.networks.length > 0 ? 1 : 0) +
    (filters.status.length > 0 ? 1 : 0);

  // --- Return ----------------------------------------------------------------

  return {
    filters,
    setFilters,
    setSearch,
    setType,
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
    setRegion,
    setCertifications,
    setCast,
    setCrew,
    setNetworks,
    setStatus,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
