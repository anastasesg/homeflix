'use client';

import { useQuery } from '@tanstack/react-query';

import { showEpisodeQueryOptions } from '@/options/queries/shows/detail';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Loading
// ============================================================================

function EpisodeSynopsisLoading() {
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

interface EpisodeSynopsisContentProps {
  overview: string;
}

function EpisodeSynopsisContent({ overview }: EpisodeSynopsisContentProps) {
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

interface EpisodeSynopsisProps {
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeSynopsis({ tmdbId, seasonNumber, episodeNumber }: EpisodeSynopsisProps) {
  const query = useQuery(showEpisodeQueryOptions(tmdbId, seasonNumber, episodeNumber));

  return (
    <Query
      result={query}
      callbacks={{
        loading: EpisodeSynopsisLoading,
        error: () => null,
        success: (episode) => (episode.overview ? <EpisodeSynopsisContent overview={episode.overview} /> : null),
      }}
    />
  );
}

export type { EpisodeSynopsisProps };
export { EpisodeSynopsis };
