'use client';

import Link from 'next/link';

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Film,
  type LucideIcon,
  Star,
} from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { EnrichedMovie, MediaStatus } from './types';

interface MovieGridProps {
  movies: EnrichedMovie[];
  isLoading?: boolean;
}

const statusConfig: Record<
  MediaStatus,
  { icon: LucideIcon; label: string; color: string; bg: string; glow: string }
> = {
  downloaded: {
    icon: CheckCircle2,
    label: 'Downloaded',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    glow: 'shadow-emerald-500/20',
  },
  downloading: {
    icon: Download,
    label: 'Downloading',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    glow: 'shadow-blue-500/20',
  },
  missing: {
    icon: AlertCircle,
    label: 'Missing',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    glow: 'shadow-amber-500/20',
  },
  wanted: {
    icon: Clock,
    label: 'Wanted',
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    glow: '',
  },
};

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl bg-muted/50"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <AspectRatio ratio={2 / 3}>
            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50" />
          </AspectRatio>
        </div>
      ))}
    </div>
  );
}

function MovieGridEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/20 py-20">
      <div className="rounded-full bg-muted/50 p-4">
        <Film className="size-10 text-muted-foreground/50" />
      </div>
      <h3 className="mt-4 text-lg font-medium">No movies found</h3>
      <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
    </div>
  );
}

interface MovieCardProps {
  movie: EnrichedMovie;
  index: number;
}

function MovieCard({ movie, index }: MovieCardProps) {
  const status = statusConfig[movie.status];
  const StatusIcon = status.icon;

  return (
    <Link
      href={`/library/movies/${movie.id}`}
      className="group relative block overflow-hidden rounded-xl ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-primary/40 hover:shadow-xl hover:shadow-primary/10"
      style={{
        animationDelay: `${index * 30}ms`,
      }}
    >
      <AspectRatio ratio={2 / 3}>
        {/* Poster image or placeholder */}
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-850 to-zinc-900">
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
              <Film className="size-8 text-muted-foreground/30" />
              <span className="text-xs font-medium text-muted-foreground">{movie.title}</span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute left-2 top-2 z-10">
              <Badge
                variant="secondary"
                className={cn(
                  'size-6 p-0 shadow-md backdrop-blur-sm transition-transform duration-200 group-hover:scale-110',
                  status.bg,
                  status.glow && `shadow-lg ${status.glow}`
                )}
              >
                <StatusIcon className={cn('size-3.5', status.color)} />
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {status.label}
          </TooltipContent>
        </Tooltip>

        {/* Quality badge (if downloaded) */}
        {movie.quality && movie.status === 'downloaded' && (
          <div className="absolute right-2 top-2 z-10">
            <Badge
              variant="secondary"
              className="h-5 bg-black/70 px-1.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md"
            >
              {movie.quality}
            </Badge>
          </div>
        )}

        {/* Rating badge */}
        {movie.rating && (
          <div className="absolute bottom-2 right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-black/70 px-1.5 text-yellow-400 backdrop-blur-md"
            >
              <Star className="size-3 fill-current" />
              <span className="text-[10px] font-semibold tabular-nums">{movie.rating.toFixed(1)}</span>
            </Badge>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="p-3">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white">
              {movie.title}
            </h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {movie.year && (
                <span className="text-[11px] font-medium tabular-nums text-white/70">
                  {movie.year}
                </span>
              )}

              {movie.runtime && (
                <>
                  <span className="text-white/30">·</span>
                  <span className="text-[11px] text-white/70">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                </>
              )}
            </div>

            {/* Genres */}
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
          </div>
        </div>

        {/* Subtle top gradient for status badges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
      </AspectRatio>
    </Link>
  );
}

function MovieGrid({ movies, isLoading }: MovieGridProps) {
  if (isLoading) {
    return <MovieGridSkeleton />;
  }

  if (movies.length === 0) {
    return <MovieGridEmpty />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} index={index} />
      ))}
    </div>
  );
}

export { MovieGrid, MovieGridEmpty, MovieGridSkeleton };
