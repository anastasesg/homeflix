'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, Tv } from 'lucide-react';

import { useTVDiscoverFilters } from '@/hooks/filters/use-tv-discover-filters';
import { filteredShowsInfiniteQueryOptions, searchShowsInfiniteQueryOptions } from '@/options/queries/shows/discover';

import { MediaCard, MediaCardError, MediaGrid, MediaItem } from '@/components/media';

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
      sortBy: getSortBy(sort, dir),
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
        renderCard={(show, index) => <MediaCard key={show.tmdbId} type="show" data={show} index={index} />}
        renderListItem={(show) => <MediaItem key={show.tmdbId} type="show" data={show} />}
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
