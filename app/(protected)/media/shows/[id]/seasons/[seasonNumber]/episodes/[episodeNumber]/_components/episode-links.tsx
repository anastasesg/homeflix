'use client';

import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Film, Globe } from 'lucide-react';

import type { ShowDetail } from '@/api/entities';
import { showDetailQueryOptions } from '@/options/queries/shows/detail';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';

// ============================================================================
// Success
// ============================================================================

interface EpisodeLinksSuccessProps {
  show: ShowDetail;
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeLinksSuccess({ show, tmdbId, seasonNumber, episodeNumber }: EpisodeLinksSuccessProps) {
  const tmdbUrl = `https://www.themoviedb.org/tv/${tmdbId}/season/${seasonNumber}/episode/${episodeNumber}`;

  return (
    <section className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-6">
      <span className="text-xs uppercase tracking-wider text-muted-foreground/70">External Links</span>
      <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
        <a href={tmdbUrl} target="_blank" rel="noopener noreferrer">
          <Film className="size-3.5" />
          TMDB
          <ExternalLink className="size-3" />
        </a>
      </Button>
      {show.imdbId && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={`https://www.imdb.com/title/${show.imdbId}`} target="_blank" rel="noopener noreferrer">
            <Globe className="size-3.5" />
            IMDb
            <ExternalLink className="size-3" />
          </a>
        </Button>
      )}
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface EpisodeLinksProps {
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeLinks({ tmdbId, seasonNumber, episodeNumber }: EpisodeLinksProps) {
  const showQuery = useQuery(showDetailQueryOptions(tmdbId));

  return (
    <Query
      result={showQuery}
      callbacks={{
        loading: () => null,
        error: () => null,
        success: (show) => (
          <EpisodeLinksSuccess show={show} tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
        ),
      }}
    />
  );
}

export type { EpisodeLinksProps };
export { EpisodeLinks };
