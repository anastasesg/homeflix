'use client';

import { Film, Star } from 'lucide-react';

import { MovieItem as MovieItemEntity } from '@/api/entities';
import { formatRuntime } from '@/utilities';

import { MediaItem, type StatusConfig } from '@/components/media';
import { Badge } from '@/components/ui/badge';

type MovieItemProps = {
  movie: MovieItemEntity;
  status: StatusConfig;
};

function MovieItem({ movie, status }: MovieItemProps) {
  return (
    <MediaItem
      key={movie.id}
      href={`/media/movies/${movie.tmdbId}`}
      title={movie.title}
      year={movie.year}
      posterUrl={movie.posterUrl}
      status={status}
      placeholderIcon={Film}
      metadataSlot={
        <>
          {movie.genres && movie.genres.length > 0 && (
            <span className="truncate">{movie.genres.slice(0, 3).join(', ')}</span>
          )}
          {movie.runtime && <span className="shrink-0">{formatRuntime(movie.runtime)}</span>}
        </>
      }
      statsSlot={
        movie.rating && (
          <div className="hidden shrink-0 items-center gap-1 text-yellow-500 sm:flex">
            <Star className="size-4 fill-current" />
            <span className="text-sm font-medium tabular-nums">{movie.rating.toFixed(1)}</span>
          </div>
        )
      }
      badgesSlot={
        movie.quality &&
        movie.status === 'downloaded' && (
          <Badge variant="secondary" className="hidden text-xs sm:inline-flex">
            {movie.quality}
          </Badge>
        )
      }
    />
  );
}

export type { MovieItemProps };
export { MovieItem };
