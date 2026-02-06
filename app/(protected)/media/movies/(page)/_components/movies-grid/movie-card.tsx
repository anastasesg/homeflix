'use client';

import { Film, Star } from 'lucide-react';

import type { DiscoverMovie } from '@/api/entities';

import { MediaCard, type StatusConfig } from '@/components/media';
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

interface DiscoverMovieCardProps {
  movie: DiscoverMovie;
  index?: number;
}

// ============================================================================
// Main Component
// ============================================================================

function DiscoverMovieCard({ movie, index = 0 }: DiscoverMovieCardProps) {
  return (
    <MediaCard
      href={`/media/movies/${movie.id}`}
      title={movie.title}
      posterUrl={movie.posterUrl}
      status={movieStatus}
      placeholderIcon={Film}
      animationDelay={index * 30}
      overlaySlot={
        movie.rating > 0 && (
          <div className="absolute bottom-2 right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-black/70 px-1.5 text-yellow-400 backdrop-blur-md"
            >
              <Star className="size-3 fill-current" />
              <span className="text-[10px] font-semibold tabular-nums">{movie.rating.toFixed(1)}</span>
            </Badge>
          </div>
        )
      }
    >
      <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white">{movie.title}</h3>

      {movie.year > 0 && (
        <div className="mt-1.5">
          <span className="text-[11px] font-medium tabular-nums text-white/70">{movie.year}</span>
        </div>
      )}
    </MediaCard>
  );
}

export type { DiscoverMovieCardProps };
export { DiscoverMovieCard };
