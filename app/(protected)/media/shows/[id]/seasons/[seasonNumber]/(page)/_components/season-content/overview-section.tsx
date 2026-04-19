'use client';

import { useQuery } from '@tanstack/react-query';

import { seasonOverviewQueryOptions } from '@/options/queries/shows/detail';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Loading
// ============================================================================

function OverviewSectionLoading() {
  return (
    <section className="relative">
      <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-transparent" />
      <div className="flex flex-col gap-2 pl-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface OverviewSectionContentProps {
  overview: string;
}

function OverviewSectionContent({ overview }: OverviewSectionContentProps) {
  return (
    <section className="relative">
      <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent" />
      <p className="pl-2 text-[15px] leading-relaxed text-muted-foreground/90">{overview}</p>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface OverviewSectionProps {
  tmdbId: number;
  seasonNumber: number;
}

function OverviewSection({ tmdbId, seasonNumber }: OverviewSectionProps) {
  const query = useQuery(seasonOverviewQueryOptions(tmdbId, seasonNumber));

  return (
    <Query
      result={query}
      callbacks={{
        loading: OverviewSectionLoading,
        error: () => null,
        success: (overview) => (overview ? <OverviewSectionContent overview={overview} /> : null),
      }}
    />
  );
}

export type { OverviewSectionProps };
export { OverviewSection };
