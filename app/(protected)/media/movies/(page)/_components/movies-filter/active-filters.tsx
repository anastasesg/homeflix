'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useDiscoverFilters } from '@/hooks/filters';
import { tmdbGenresQueryOptions, tmdbWatchProvidersQueryOptions } from '@/options/queries/tmdb';

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

// ============================================================================
// Main Component
// ============================================================================

function ActiveFilters() {
  const {
    filters,
    hasActiveFilters,
    setSearch,
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
    clearFilters,
  } = useDiscoverFilters();

  const genresQuery = useQuery(tmdbGenresQueryOptions());
  const genreMap = useMemo(() => new Map(genresQuery.data?.map((g) => [g.id, g.name]) ?? []), [genresQuery.data]);

  const providersQuery = useQuery(tmdbWatchProvidersQueryOptions(filters.region));
  const providerMap = useMemo(
    () => new Map(providersQuery.data?.map((p) => [p.id, p.name]) ?? []),
    [providersQuery.data]
  );

  if (!hasActiveFilters) return null;

  const hasYear = filters.yearMin !== null || filters.yearMax !== null;
  const hasRuntime = filters.runtimeMin !== null || filters.runtimeMax !== null;

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

      {/* Certifications */}
      {filters.certifications.map((cert) => (
        <FilterBadge key={cert} onRemove={() => setCertifications(filters.certifications.filter((c) => c !== cert))}>
          Rated {cert}
        </FilterBadge>
      ))}

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

      {/* Cast */}
      {filters.cast.length > 0 && (
        <FilterBadge onRemove={() => setCast([])}>
          {filters.cast.length} actor{filters.cast.length > 1 ? 's' : ''}
        </FilterBadge>
      )}

      {/* Crew */}
      {filters.crew.length > 0 && <FilterBadge onRemove={() => setCrew([])}>{filters.crew.length} crew</FilterBadge>}

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

export { ActiveFilters };
