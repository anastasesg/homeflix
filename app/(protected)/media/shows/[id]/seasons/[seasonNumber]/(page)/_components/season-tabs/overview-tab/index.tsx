'use client';

import { useQuery } from '@tanstack/react-query';

import type { SeasonDetail } from '@/api/entities';
import { tmdbTVSeasonQueryOptions } from '@/options/queries/tmdb';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

import { CastSection } from './cast-section';
import { CrewSection } from './crew-section';
import { GallerySection } from './gallery-section';
import { OverviewSection } from './overview-section';

// ============================================================================
// Loading
// ============================================================================

function OverviewTabLoading() {
  return (
    <div className="flex flex-col space-y-8">
      <section className="relative">
        <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-transparent" />
        <div className="flex flex-col gap-2 pl-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// Content
// ============================================================================

interface OverviewTabContentProps {
  season: SeasonDetail;
}

function OverviewTabContent({ season }: OverviewTabContentProps) {
  return (
    <div className="flex flex-col space-y-8">
      {season.overview && <OverviewSection overview={season.overview} />}
      <GallerySection season={season} />
      <CastSection season={season} />
      <CrewSection season={season} />
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface OverviewTabProps {
  tmdbId: number;
  seasonNumber: number;
}

function OverviewTab({ tmdbId, seasonNumber }: OverviewTabProps) {
  const seasonQuery = useQuery(tmdbTVSeasonQueryOptions(tmdbId, seasonNumber));

  return (
    <Query
      result={seasonQuery}
      callbacks={{
        loading: OverviewTabLoading,
        error: () => null,
        success: (season) => <OverviewTabContent season={season} />,
      }}
    />
  );
}

export type { OverviewTabProps };
export { OverviewTab };
