import { ExternalLink, Film, Globe } from 'lucide-react';

import { type MovieBasic } from '@/api/entities';

import { Button } from '@/components/ui/button';

// ============================================================================
// Main
// ============================================================================

interface ExternalLinksSectionProps {
  movie: MovieBasic;
}

function ExternalLinksSection({ movie }: ExternalLinksSectionProps) {
  if (!movie.imdbId && !movie.tmdbId && !movie.homepage) return null;

  return (
    <section className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-6">
      <span className="text-xs uppercase tracking-wider text-muted-foreground/70">External Links</span>
      {movie.imdbId && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={`https://www.imdb.com/title/${movie.imdbId}`} target="_blank" rel="noopener noreferrer">
            <Globe className="size-3.5" />
            IMDb
            <ExternalLink className="size-3" />
          </a>
        </Button>
      )}
      {movie.tmdbId && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={`https://www.themoviedb.org/movie/${movie.tmdbId}`} target="_blank" rel="noopener noreferrer">
            <Film className="size-3.5" />
            TMDB
            <ExternalLink className="size-3" />
          </a>
        </Button>
      )}
      {movie.homepage && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
          <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
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
