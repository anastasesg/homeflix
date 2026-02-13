'use client';

import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useQuery } from '@tanstack/react-query';

import type { ShowItem } from '@/api/entities';
import { trendingShowsQueryOptions } from '@/options/queries/shows';

import { Query } from '@/components/query';

import { TvMediaCard } from '../_components/tv-media-card';

// ============================================================
// Sub-components
// ============================================================

function ShowGrid({ shows }: { shows: ShowItem[] }) {
  const { ref, focusKey } = useFocusable({
    focusKey: 'show-grid',
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-wrap gap-6 px-12 py-8">
        {shows.map((show) => (
          <TvMediaCard
            key={show.tmdbId}
            id={show.tmdbId}
            title={show.title}
            year={show.year}
            posterUrl={show.posterUrl}
            mediaType="show"
          />
        ))}
      </div>
    </FocusContext.Provider>
  );
}

function ShowGridSkeleton() {
  return (
    <div className="flex flex-wrap gap-6 px-12 py-8">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="h-[300px] w-[200px] animate-pulse rounded-xl bg-muted/20" />
      ))}
    </div>
  );
}

// ============================================================
// Main
// ============================================================

export default function TvShowBrowsePage() {
  const query = useQuery(trendingShowsQueryOptions());

  return (
    <div className="flex flex-col">
      <h1 className="px-12 pt-8 text-4xl font-bold">Shows</h1>
      <Query
        result={query}
        callbacks={{
          loading: () => <ShowGridSkeleton />,
          error: (error) => (
            <div className="flex items-center justify-center py-20">
              <p className="text-xl text-muted-foreground">{error.message}</p>
            </div>
          ),
          success: (shows) => <ShowGrid shows={shows} />,
        }}
      />
    </div>
  );
}
