'use client';

import { useQuery } from '@tanstack/react-query';

import { type MovieBasic } from '@/api/entities';
import { tmdbMovieQueryOptions } from '@/options/queries/tmdb';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

import { CastSection } from './cast-section';
import { CrewSection } from './crew-section';
import { DetailsSection } from './details-section';
import { ExternalLinksSection } from './external-links-section';
import { GallerySection } from './gallery-section';
import { OverviewSection } from './overview-section';
import { ProductionSection } from './production-section';

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
// Error
// ============================================================================

function OverviewTabError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <h2 className="text-lg font-semibold text-destructive">Failed to load overview</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// ============================================================================
// Content
// ============================================================================

interface OverviewTabContentProps {
  movie: MovieBasic;
  tmdbId: number;
}

function OverviewTabContent({ movie, tmdbId }: OverviewTabContentProps) {
  return (
    <div className="flex flex-col space-y-8">
      <OverviewSection overview={movie.overview} />
      <GallerySection tmdbId={tmdbId} movieTitle={movie.title} />
      <CastSection tmdbId={tmdbId} />
      <CrewSection tmdbId={tmdbId} />
      <DetailsSection movie={movie} tmdbId={tmdbId} />
      <ProductionSection movie={movie} />
      <ExternalLinksSection movie={movie} />
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface OverviewTabProps {
  tmdbId: number;
}

function OverviewTab({ tmdbId }: OverviewTabProps) {
  const movieQuery = useQuery(tmdbMovieQueryOptions(tmdbId));

  return (
    <Query
      result={movieQuery}
      callbacks={{
        loading: OverviewTabLoading,
        error: (error) => <OverviewTabError error={error} />,
        success: (movie) => <OverviewTabContent movie={movie} tmdbId={tmdbId} />,
      }}
    />
  );
}

export type { OverviewTabProps };
export { OverviewTab };
