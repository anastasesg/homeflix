import { ExternalLink, Film, Globe, Tv } from 'lucide-react';

import { type ShowBasic } from '@/api/entities';

import { Button } from '@/components/ui/button';

// ============================================================================
// Main
// ============================================================================

interface ExternalLinksSectionProps {
  show: ShowBasic;
}

function ExternalLinksSection({ show }: ExternalLinksSectionProps) {
  if (!show.tmdbId && !show.imdbId && !show.tvdbId && !show.homepage) return null;

  return (
    <section className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-6">
      <span className="text-xs uppercase tracking-wider text-muted-foreground/70">External Links</span>
      {show.tmdbId && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={`https://www.themoviedb.org/tv/${show.tmdbId}`} target="_blank" rel="noopener noreferrer">
            <Film className="size-3.5" />
            TMDB
            <ExternalLink className="size-3" />
          </a>
        </Button>
      )}
      {show.imdbId && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={`https://www.imdb.com/title/${show.imdbId}`} target="_blank" rel="noopener noreferrer">
            <Globe className="size-3.5" />
            IMDb
            <ExternalLink className="size-3" />
          </a>
        </Button>
      )}
      {show.tvdbId && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={`https://www.thetvdb.com/?id=${show.tvdbId}&tab=series`} target="_blank" rel="noopener noreferrer">
            <Tv className="size-3.5" />
            TVDB
            <ExternalLink className="size-3" />
          </a>
        </Button>
      )}
      {show.homepage && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={show.homepage} target="_blank" rel="noopener noreferrer">
            <Globe className="size-3.5" />
            Official Site
            <ExternalLink className="size-3" />
          </a>
        </Button>
      )}
    </section>
  );
}

export type { ExternalLinksSectionProps };
export { ExternalLinksSection };
