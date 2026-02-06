'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Loader2, Tv } from 'lucide-react';

import { useTVDiscoverFilters } from '@/hooks/filters/use-tv-discover-filters';
import {
  tmdbTVDiscoverInfiniteQueryOptions,
  tmdbTVGenresQueryOptions,
  tmdbTVSearchInfiniteQueryOptions,
} from '@/options/queries/tmdb/tmdb-tv-discover';

import { MediaGrid } from '@/components/media';

import { DiscoverShowCard } from './show-card';
import { DiscoverShowItem } from './show-item';

// ============================================================================
// Utilities
// ============================================================================

function getSortBy(sort: string, dir: string): string {
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

// ============================================================================
// Main Component
// ============================================================================

function ShowsGrid() {
  const { filters } = useTVDiscoverFilters();
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
    providers,
    keywords,
    networks,
    status,
    region,
  } = filters;

  const isSearch = search.length > 0;

  const searchQuery = useInfiniteQuery({
    ...tmdbTVSearchInfiniteQueryOptions(search),
    enabled: isSearch,
  });

  const discoverQuery = useInfiniteQuery({
    ...tmdbTVDiscoverInfiniteQueryOptions({
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
      sortBy: getSortBy(sort, dir),
    }),
    enabled: !isSearch,
  });

  const genresQuery = useQuery(tmdbTVGenresQueryOptions());
  const genreMap = useMemo(() => new Map(genresQuery.data?.map((g) => [g.id, g.name]) ?? []), [genresQuery.data]);

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
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <h2 className="text-lg font-semibold text-destructive">Failed to load shows</h2>
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
        items={shows}
        viewMode={view}
        emptyIcon={Tv}
        emptyTitle="No shows found"
        emptyDescription="Try adjusting your filters or search terms"
        renderCard={(show, index) => <DiscoverShowCard key={show.id} show={show} index={index} />}
        renderListItem={(show) => <DiscoverShowItem key={show.id} show={show} genreMap={genreMap} />}
      />

      <LoadMoreTrigger
        hasNextPage={activeQuery.hasNextPage}
        isFetchingNextPage={activeQuery.isFetchingNextPage}
        fetchNextPage={activeQuery.fetchNextPage}
      />
    </div>
  );
}

export { ShowsGrid };
