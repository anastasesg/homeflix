'use client';

import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Film, Globe, Tv } from 'lucide-react';

import { showExternalLinksQueryOptions } from '@/options/queries/shows/detail';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';

// ============================================================================
// Main
// ============================================================================

interface ExternalLinksSectionProps {
  tmdbId: number;
}

function ExternalLinksSection({ tmdbId }: ExternalLinksSectionProps) {
  const query = useQuery(showExternalLinksQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => null,
        error: () => null,
        success: (links) => {
          if (!links.tmdbId && !links.imdbId && !links.tvdbId && !links.homepage) return null;

          return (
            <section className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-6">
              <span className="text-xs uppercase tracking-wider text-muted-foreground/70">External Links</span>
              {links.tmdbId && (
                <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
                  <a href={`https://www.themoviedb.org/tv/${links.tmdbId}`} target="_blank" rel="noopener noreferrer">
                    <Film className="size-3.5" />
                    TMDB
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              )}
              {links.imdbId && (
                <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
                  <a href={`https://www.imdb.com/title/${links.imdbId}`} target="_blank" rel="noopener noreferrer">
                    <Globe className="size-3.5" />
                    IMDb
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              )}
              {links.tvdbId && (
                <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
                  <a
                    href={`https://www.thetvdb.com/?id=${links.tvdbId}&tab=series`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Tv className="size-3.5" />
                    TVDB
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              )}
              {links.homepage && (
                <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
                  <a href={links.homepage} target="_blank" rel="noopener noreferrer">
                    <Globe className="size-3.5" />
                    Official Site
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              )}
            </section>
          );
        },
      }}
    />
  );
}

export type { ExternalLinksSectionProps };
export { ExternalLinksSection };
