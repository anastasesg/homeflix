'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Film, Loader2 } from 'lucide-react';

import { useDiscoverFilters } from '@/hooks/filters';
import {
  filteredMoviesInfiniteQueryOptions,
  searchMoviesInfiniteQueryOptions,
} from '@/options/queries/movies/discover';
import { movieGenresQueryOptions } from '@/options/queries/movies/metadata';

import { MediaGrid } from '@/components/media';

import { DiscoverMovieCard } from './movie-card';
import { DiscoverMovieItem } from './movie-item';

// ============================================================================
// Utilities
// ============================================================================

function getSortBy(sort: string, dir: string): string {
  const sortMap: Record<string, string> = {
    title: 'original_title',
    rating: 'vote_average',
    release_date: 'primary_release_date',
    revenue: 'revenue',
    popularity: 'popularity',
  };
  return `${sortMap[sort] ?? sort}.${dir}`;
}

// ============================================================================
// Sub-components
// ============================================================================

interface LoadMoreTriggerProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

function LoadMoreTrigger({ hasNextPage, isFetchingNextPage, fetchNextPage }: LoadMoreTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, { rootMargin: '400px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div ref={triggerRef} className="flex justify-center py-8">
      {isFetchingNextPage && <Loader2 className="size-6 animate-spin text-muted-foreground" />}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function MoviesGrid() {
  const { filters } = useDiscoverFilters();
  const {
    q: search,
    sort,
    dir,
    view,
    genres,
    yearMin,
    yearMax,
    ratingMin,
    runtimeMin,
    runtimeMax,
    language,
    voteCountMin,
    certifications,
    providers,
    keywords,
    cast,
    crew,
    region,
  } = filters;

  const isSearch = search.length > 0;

  const searchQuery = useInfiniteQuery({
    ...searchMoviesInfiniteQueryOptions(search),
    enabled: isSearch,
  });

  const discoverQuery = useInfiniteQuery({
    ...filteredMoviesInfiniteQueryOptions({
      genres: genres.length > 0 ? genres : undefined,
      yearMin: yearMin ?? undefined,
      yearMax: yearMax ?? undefined,
      ratingMin: ratingMin ?? undefined,
      runtimeMin: runtimeMin ?? undefined,
      runtimeMax: runtimeMax ?? undefined,
      language: language || undefined,
      voteCountMin: voteCountMin ?? undefined,
      certifications: certifications.length > 0 ? certifications : undefined,
      certificationCountry: certifications.length > 0 ? 'US' : undefined,
      watchProviders: providers.length > 0 ? providers : undefined,
      watchRegion: providers.length > 0 ? region : undefined,
      keywords: keywords.length > 0 ? keywords : undefined,
      castIds: cast.length > 0 ? cast : undefined,
      crewIds: crew.length > 0 ? crew : undefined,
      sortBy: getSortBy(sort, dir),
    }),
    enabled: !isSearch,
  });

  const genresQuery = useQuery(movieGenresQueryOptions());
  const genreMap = useMemo(() => new Map(genresQuery.data?.map((g) => [g.id, g.name]) ?? []), [genresQuery.data]);

  const activeQuery = isSearch ? searchQuery : discoverQuery;

  const movies = useMemo(() => activeQuery.data?.pages.flatMap((p) => p.movies) ?? [], [activeQuery.data]);

  const totalResults = activeQuery.data?.pages[0]?.totalResults ?? 0;

  if (activeQuery.isLoading) {
    return (
      <MediaGrid
        items={[]}
        viewMode={view}
        isLoading
        emptyIcon={Film}
        renderCard={() => null}
        renderListItem={() => null}
      />
    );
  }

  if (activeQuery.isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <h2 className="text-lg font-semibold text-destructive">Failed to load movies</h2>
        <p className="mt-2 text-sm text-muted-foreground">{activeQuery.error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        {totalResults.toLocaleString()} {totalResults === 1 ? 'result' : 'results'}
      </p>

      <MediaGrid
        items={movies}
        viewMode={view}
        emptyIcon={Film}
        emptyTitle="No movies found"
        emptyDescription="Try adjusting your filters or search terms"
        renderCard={(movie, index) => <DiscoverMovieCard key={movie.id} movie={movie} index={index} />}
        renderListItem={(movie) => <DiscoverMovieItem key={movie.id} movie={movie} genreMap={genreMap} />}
      />

      <LoadMoreTrigger
        hasNextPage={activeQuery.hasNextPage}
        isFetchingNextPage={activeQuery.isFetchingNextPage}
        fetchNextPage={activeQuery.fetchNextPage}
      />
    </div>
  );
}

export { MoviesGrid };
