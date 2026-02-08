'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { ArrowRight, Film, Loader2, Tv } from 'lucide-react';

import type { SearchFilterState } from '@/hooks/filters';
import {
  filteredMoviesInfiniteQueryOptions,
  searchMoviesInfiniteQueryOptions,
} from '@/options/queries/movies/discover';
import { filteredShowsInfiniteQueryOptions, searchShowsInfiniteQueryOptions } from '@/options/queries/shows/discover';

import { MediaCard, MediaCardError, MediaGrid, MediaItem } from '@/components/media';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

interface SearchGridProps {
  mediaType: 'movies' | 'shows';
  filters: SearchFilterState;
  /** When true, shows only the first page with a "View all" button instead of infinite scroll */
  preview?: boolean;
  /** Called when user clicks "View all" in preview mode */
  onViewAll?: () => void;
}

// ============================================================================
// Utilities
// ============================================================================

function getMovieSortBy(sort: string, dir: string): string {
  const sortMap: Record<string, string> = {
    title: 'original_title',
    rating: 'vote_average',
    release_date: 'primary_release_date',
    revenue: 'revenue',
    popularity: 'popularity',
  };
  return `${sortMap[sort] ?? sort}.${dir}`;
}

function getShowSortBy(sort: string, dir: string): string {
  const sortMap: Record<string, string> = {
    name: 'name',
    rating: 'vote_average',
    first_air_date: 'first_air_date',
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

interface MediaTypeGridProps {
  filters: SearchFilterState;
  preview?: boolean;
  onViewAll?: () => void;
}

function MovieSearchGrid({ filters, preview, onViewAll }: MediaTypeGridProps) {
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
      sortBy: getMovieSortBy(sort, dir),
    }),
    enabled: !isSearch,
  });

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
    return <MediaCardError type="movie" error={activeQuery.error} />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {totalResults.toLocaleString()} {totalResults === 1 ? 'result' : 'results'}
      </p>
      <MediaGrid
        items={movies}
        viewMode={view}
        emptyIcon={Film}
        emptyTitle="No movies found"
        emptyDescription="Try adjusting your filters or search terms"
        renderCard={(movie, index) => <MediaCard type="movie" data={movie} index={index} />}
        renderListItem={(movie) => <MediaItem type="movie" data={movie} />}
      />
      {preview ? (
        totalResults > movies.length && (
          <Button variant="outline" className="w-full" onClick={onViewAll}>
            View all {totalResults.toLocaleString()} movies
            <ArrowRight className="ml-2 size-4" />
          </Button>
        )
      ) : (
        <LoadMoreTrigger
          hasNextPage={activeQuery.hasNextPage}
          isFetchingNextPage={activeQuery.isFetchingNextPage}
          fetchNextPage={activeQuery.fetchNextPage}
        />
      )}
    </div>
  );
}

function ShowSearchGrid({ filters, preview, onViewAll }: MediaTypeGridProps) {
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
    networks,
    status,
    providers,
    keywords,
    region,
  } = filters;
  const isSearch = search.length > 0;

  const searchQuery = useInfiniteQuery({
    ...searchShowsInfiniteQueryOptions(search),
    enabled: isSearch,
  });

  const discoverQuery = useInfiniteQuery({
    ...filteredShowsInfiniteQueryOptions({
      genres: genres.length > 0 ? genres : undefined,
      yearMin: yearMin ?? undefined,
      yearMax: yearMax ?? undefined,
      ratingMin: ratingMin ?? undefined,
      runtimeMin: runtimeMin ?? undefined,
      runtimeMax: runtimeMax ?? undefined,
      language: language || undefined,
      voteCountMin: voteCountMin ?? undefined,
      networks: networks.length > 0 ? networks : undefined,
      status: status.length > 0 ? status : undefined,
      watchProviders: providers.length > 0 ? providers : undefined,
      watchRegion: providers.length > 0 ? region : undefined,
      keywords: keywords.length > 0 ? keywords : undefined,
      sortBy: getShowSortBy(sort, dir),
    }),
    enabled: !isSearch,
  });

  const activeQuery = isSearch ? searchQuery : discoverQuery;
  const shows = useMemo(() => activeQuery.data?.pages.flatMap((p) => p.shows) ?? [], [activeQuery.data]);
  const totalResults = activeQuery.data?.pages[0]?.totalResults ?? 0;

  if (activeQuery.isLoading) {
    return (
      <MediaGrid
        items={[]}
        viewMode={view}
        isLoading
        emptyIcon={Tv}
        renderCard={() => null}
        renderListItem={() => null}
      />
    );
  }

  if (activeQuery.isError) {
    return <MediaCardError type="show" error={activeQuery.error} />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {totalResults.toLocaleString()} {totalResults === 1 ? 'result' : 'results'}
      </p>
      <MediaGrid
        items={shows}
        viewMode={view}
        emptyIcon={Tv}
        emptyTitle="No shows found"
        emptyDescription="Try adjusting your filters or search terms"
        renderCard={(show, index) => <MediaCard type="show" data={show} index={index} />}
        renderListItem={(show) => <MediaItem type="show" data={show} />}
      />
      {preview ? (
        totalResults > shows.length && (
          <Button variant="outline" className="w-full" onClick={onViewAll}>
            View all {totalResults.toLocaleString()} shows
            <ArrowRight className="ml-2 size-4" />
          </Button>
        )
      ) : (
        <LoadMoreTrigger
          hasNextPage={activeQuery.hasNextPage}
          isFetchingNextPage={activeQuery.isFetchingNextPage}
          fetchNextPage={activeQuery.fetchNextPage}
        />
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function SearchGrid({ mediaType, filters, preview, onViewAll }: SearchGridProps) {
  if (mediaType === 'movies') {
    return <MovieSearchGrid filters={filters} preview={preview} onViewAll={onViewAll} />;
  }
  return <ShowSearchGrid filters={filters} preview={preview} onViewAll={onViewAll} />;
}

export type { SearchGridProps };
export { SearchGrid };
