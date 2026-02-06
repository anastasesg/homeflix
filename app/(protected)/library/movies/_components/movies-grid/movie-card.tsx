'use client';

import { Film, Star } from 'lucide-react';

import { MovieItem } from '@/api/entities';
import { formatRuntime } from '@/utilities';

import { MediaCard, StatusConfig } from '@/components/media';
import { Badge } from '@/components/ui/badge';

type MovieCardProps = {
  movie: MovieItem;
  status: StatusConfig;
};

function MovieCard({ movie, status }: MovieCardProps) {
  return (
    <MediaCard
      key={movie.id}
      href={`/media/movies/${movie.tmdbId}`}
      title={movie.title}
      posterUrl={movie.posterUrl}
      status={status}
      qualityBadge={movie.quality}
      showQualityBadge={movie.status === 'downloaded'}
      placeholderIcon={Film}
      overlaySlot={
        movie.rating && (
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

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {movie.year && <span className="text-[11px] font-medium tabular-nums text-white/70">{movie.year}</span>}

        {movie.runtime && (
          <>
            <span className="text-white/30">·</span>
            <span className="text-[11px] text-white/70">{formatRuntime(movie.runtime)}</span>
          </>
        )}
      </div>

      {movie.genres && movie.genres.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {movie.genres.slice(0, 2).map((genre) => (
            <Badge
              key={genre}
              variant="outline"
              className="h-4 border-white/20 bg-white/5 px-1.5 text-[9px] text-white/80"
            >
              {genre}
            </Badge>
          ))}
        </div>
      )}
    </MediaCard>
  );
}

export type { MovieCardProps };
export { MovieCard };
