'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { SearchFilterState } from '@/hooks/filters';
import { movieGenresQueryOptions, movieWatchProvidersQueryOptions } from '@/options/queries/movies/metadata';
import {
  showGenresQueryOptions,
  showNetworksQueryOptions,
  showWatchProvidersQueryOptions,
} from '@/options/queries/shows/metadata';

import { Button } from '@/components/ui/button';

import { FilterBadge } from './filter-badge';

// ============================================================================
// Constants
// ============================================================================

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ko: 'Korean',
  ja: 'Japanese',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  zh: 'Chinese',
  hi: 'Hindi',
  ru: 'Russian',
  th: 'Thai',
  sv: 'Swedish',
  da: 'Danish',
  no: 'Norwegian',
  pl: 'Polish',
  tr: 'Turkish',
  ar: 'Arabic',
};

const STATUS_LABELS: Record<string, string> = {
  '0': 'Returning Series',
  '1': 'Planned',
  '2': 'In Production',
  '3': 'Ended',
  '4': 'Cancelled',
  '5': 'Pilot',
};

// ============================================================================
// Types
// ============================================================================

interface ActiveFiltersProps {
  filters: SearchFilterState;
  mediaType: 'all' | 'movies' | 'shows';
  hasActiveFilters: boolean;
  setSearch: (q: string) => void;
  setGenres: (genres: number[]) => void;
  setYearRange: (yearMin: number | null, yearMax: number | null) => void;
  setRatingMin: (ratingMin: number | null) => void;
  setRuntimeRange: (runtimeMin: number | null, runtimeMax: number | null) => void;
  setLanguage: (language: string) => void;
  setVoteCountMin: (voteCountMin: number | null) => void;
  setProviders: (providers: number[]) => void;
  setKeywords: (keywords: number[]) => void;
  setCertifications: (certifications: string[]) => void;
  setCast: (cast: number[]) => void;
  setCrew: (crew: number[]) => void;
  setNetworks: (networks: number[]) => void;
  setStatus: (status: string[]) => void;
  clearFilters: () => void;
}

// ============================================================================
// Main Component
// ============================================================================

function ActiveFilters({
  filters,
  mediaType,
  hasActiveFilters,
  setSearch,
  setGenres,
  setYearRange,
  setRatingMin,
  setRuntimeRange,
  setLanguage,
  setVoteCountMin,
  setProviders,
  setKeywords,
  setCertifications,
  setCast,
  setCrew,
  setNetworks,
  setStatus,
  clearFilters,
}: ActiveFiltersProps) {
  // --- Queries for lookup maps ------------------------------------------------

  const movieGenresQuery = useQuery(movieGenresQueryOptions());
  const showGenresQuery = useQuery(showGenresQueryOptions());
  const genreData = mediaType === 'shows' ? showGenresQuery.data : movieGenresQuery.data;
  const genreMap = useMemo(() => new Map(genreData?.map((g) => [g.id, g.name]) ?? []), [genreData]);

  const movieProvidersQuery = useQuery(movieWatchProvidersQueryOptions(filters.region));
  const showProvidersQuery = useQuery(showWatchProvidersQueryOptions(filters.region));
  const providerData = mediaType === 'shows' ? showProvidersQuery.data : movieProvidersQuery.data;
  const providerMap = useMemo(() => new Map(providerData?.map((p) => [p.id, p.name]) ?? []), [providerData]);

  const networksQuery = useQuery(showNetworksQueryOptions());
  const networkMap = useMemo(() => new Map(networksQuery.data?.map((n) => [n.id, n.name]) ?? []), [networksQuery.data]);

  // --- Early return -----------------------------------------------------------

  if (!hasActiveFilters) return null;

  // --- Derived state ----------------------------------------------------------

  const hasYear = filters.yearMin !== null || filters.yearMax !== null;
  const hasRuntime = filters.runtimeMin !== null || filters.runtimeMax !== null;

  // --- Render -----------------------------------------------------------------

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      {filters.q && <FilterBadge onRemove={() => setSearch('')}>Search: &ldquo;{filters.q}&rdquo;</FilterBadge>}

      {/* Genres */}
      {filters.genres.map((genreId) => (
        <FilterBadge key={genreId} onRemove={() => setGenres(filters.genres.filter((g) => g !== genreId))}>
          {genreMap.get(genreId) ?? `Genre #${genreId}`}
        </FilterBadge>
      ))}

      {/* Year Range */}
      {hasYear && (
        <FilterBadge onRemove={() => setYearRange(null, null)}>
          {filters.yearMin && filters.yearMax
            ? `${filters.yearMin}–${filters.yearMax}`
            : filters.yearMin
              ? `≥${filters.yearMin}`
              : `≤${filters.yearMax}`}
        </FilterBadge>
      )}

      {/* Rating */}
      {filters.ratingMin !== null && (
        <FilterBadge onRemove={() => setRatingMin(null)}>≥{filters.ratingMin}★</FilterBadge>
      )}

      {/* Runtime */}
      {hasRuntime && (
        <FilterBadge onRemove={() => setRuntimeRange(null, null)}>
          {filters.runtimeMin && filters.runtimeMax
            ? `${filters.runtimeMin}–${filters.runtimeMax}min`
            : filters.runtimeMin
              ? `≥${filters.runtimeMin}min`
              : `≤${filters.runtimeMax}min`}
        </FilterBadge>
      )}

      {/* Language */}
      {filters.language && (
        <FilterBadge onRemove={() => setLanguage('')}>
          {LANGUAGE_NAMES[filters.language] ?? filters.language}
        </FilterBadge>
      )}

      {/* Vote Count */}
      {filters.voteCountMin !== null && (
        <FilterBadge onRemove={() => setVoteCountMin(null)}>≥{filters.voteCountMin} votes</FilterBadge>
      )}

      {/* Watch Providers */}
      {filters.providers.map((providerId) => (
        <FilterBadge key={providerId} onRemove={() => setProviders(filters.providers.filter((p) => p !== providerId))}>
          {providerMap.get(providerId) ?? `Provider #${providerId}`}
        </FilterBadge>
      ))}

      {/* Keywords */}
      {filters.keywords.length > 0 && (
        <FilterBadge onRemove={() => setKeywords([])}>
          {filters.keywords.length} keyword{filters.keywords.length > 1 ? 's' : ''}
        </FilterBadge>
      )}

      {/* Movie-specific: Certifications */}
      {mediaType === 'movies' &&
        filters.certifications.map((cert) => (
          <FilterBadge key={cert} onRemove={() => setCertifications(filters.certifications.filter((c) => c !== cert))}>
            Rated {cert}
          </FilterBadge>
        ))}

      {/* Movie-specific: Cast */}
      {mediaType === 'movies' && filters.cast.length > 0 && (
        <FilterBadge onRemove={() => setCast([])}>
          {filters.cast.length} actor{filters.cast.length > 1 ? 's' : ''}
        </FilterBadge>
      )}

      {/* Movie-specific: Crew */}
      {mediaType === 'movies' && filters.crew.length > 0 && (
        <FilterBadge onRemove={() => setCrew([])}>{filters.crew.length} crew</FilterBadge>
      )}

      {/* Show-specific: Networks */}
      {mediaType === 'shows' &&
        filters.networks.map((networkId) => (
          <FilterBadge key={networkId} onRemove={() => setNetworks(filters.networks.filter((n) => n !== networkId))}>
            {networkMap.get(networkId) ?? `Network #${networkId}`}
          </FilterBadge>
        ))}

      {/* Show-specific: Status */}
      {mediaType === 'shows' &&
        filters.status.map((s) => (
          <FilterBadge key={s} onRemove={() => setStatus(filters.status.filter((v) => v !== s))}>
            {STATUS_LABELS[s] ?? `Status ${s}`}
          </FilterBadge>
        ))}

      {/* Clear all */}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
        onClick={clearFilters}
      >
        Clear all
      </Button>
    </div>
  );
}

export type { ActiveFiltersProps };
export { ActiveFilters };
