'use client';

import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Film, Globe } from 'lucide-react';

import { movieExternalLinksQueryOptions } from '@/options/queries/movies/detail';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';

// ============================================================================
// Success
// ============================================================================

interface ExternalLinksData {
  imdbId?: string;
  tmdbId: number;
  homepage?: string;
}

function ExternalLinksSectionSuccess({ data }: { data: ExternalLinksData }) {
  if (!data.imdbId && !data.tmdbId && !data.homepage) return null;

  return (
    <section className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-6">
      <span className="text-xs uppercase tracking-wider text-muted-foreground/70">External Links</span>
      {data.imdbId && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={`https://www.imdb.com/title/${data.imdbId}`} target="_blank" rel="noopener noreferrer">
            <Globe className="size-3.5" />
            IMDb
            <ExternalLink className="size-3" />
          </a>
        </Button>
      )}
      {data.tmdbId && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={`https://www.themoviedb.org/movie/${data.tmdbId}`} target="_blank" rel="noopener noreferrer">
            <Film className="size-3.5" />
            TMDB
            <ExternalLink className="size-3" />
          </a>
        </Button>
      )}
      {data.homepage && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={data.homepage} target="_blank" rel="noopener noreferrer">
            <Globe className="size-3.5" />
            Official Site
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

interface ExternalLinksSectionProps {
  tmdbId: number;
}

function ExternalLinksSection({ tmdbId }: ExternalLinksSectionProps) {
  const query = useQuery(movieExternalLinksQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => null,
        error: () => null,
        success: (data) => <ExternalLinksSectionSuccess data={data} />,
      }}
    />
  );
}

export type { ExternalLinksSectionProps };
export { ExternalLinksSection };
