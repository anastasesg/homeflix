'use client';

import { Film, Star } from 'lucide-react';

import type { DiscoverMovie } from '@/api/entities';

import { MediaListItem, type StatusConfig } from '@/components/media';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// Utilities
// ============================================================================

const movieStatus: StatusConfig = {
  icon: Film,
  label: 'Movie',
  color: 'text-muted-foreground',
  bg: 'bg-muted',
};

// ============================================================================
// Types
// ============================================================================

interface DiscoverMovieItemProps {
  movie: DiscoverMovie;
  genreMap: Map<number, string>;
}

// ============================================================================
// Main Component
// ============================================================================

function DiscoverMovieItem({ movie, genreMap }: DiscoverMovieItemProps) {
  const genreNames = movie.genreIds
    .map((id) => genreMap.get(id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <MediaListItem
      href={`/media/movies/${movie.id}`}
      title={movie.title}
      year={movie.year > 0 ? movie.year : undefined}
      posterUrl={movie.posterUrl}
      status={movieStatus}
      placeholderIcon={Film}
      metadataSlot={
        genreNames.length > 0 && <span className="truncate text-muted-foreground">{genreNames.join(', ')}</span>
      }
      statsSlot={
        movie.rating > 0 && (
          <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium tabular-nums">{movie.rating.toFixed(1)}</span>
          </div>
        )
      }
      badgesSlot={
        movie.rating >= 8 && (
          <Badge variant="secondary" className="hidden bg-amber-500/10 text-amber-400 sm:inline-flex">
            Top Rated
          </Badge>
        )
      }
    />
  );
}

export type { DiscoverMovieItemProps };
export { DiscoverMovieItem };
