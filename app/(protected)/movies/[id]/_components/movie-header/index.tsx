'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Clock, Play, Star } from 'lucide-react';

import { type MovieBasic, type MovieVideos } from '@/api/entities';
import { useSetBreadcrumb } from '@/app/(protected)/_components/breadcrumb-context';
import { tmdbMovieQueryOptions, tmdbVideosQueryOptions } from '@/options/queries/tmdb';
import { formatRuntime } from '@/utilities';

import { Queries } from '@/components/query';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import { LibraryStatusBadge } from './library-status-badge';

// ============================================================================
// Error
// ============================================================================

interface MovieHeaderErrorProps {
  error: unknown;
}

function MovieHeaderError({ error }: MovieHeaderErrorProps) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';

  return (
    <section className="relative overflow-hidden rounded-xl border border-destructive/20 bg-destructive/5">
      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Poster placeholder */}
          <div className="shrink-0 sm:w-44 md:w-52">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl bg-destructive/10">
              <div className="flex h-full items-center justify-center">
                <Star className="size-10 text-destructive/30" />
              </div>
            </AspectRatio>
          </div>

          {/* Error info */}
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="text-lg font-semibold text-destructive">Failed to load movie</h2>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Loading
// ============================================================================

function MovieHeaderLoading() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-accent/30">
      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Poster skeleton */}
          <div className="shrink-0 sm:w-44 md:w-52">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl">
              <Skeleton className="h-full w-full" />
            </AspectRatio>
          </div>

          {/* Info skeleton */}
          <div className="flex flex-1 flex-col justify-end gap-2">
            <Skeleton className="h-10 w-3/4 sm:h-12" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="mt-1 h-4 w-48" />

            {/* Metadata row */}
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-4 w-px" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-px" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface MovieHeaderSuccessProps {
  movie: MovieBasic;
  videos: MovieVideos;
  tmdbId: number;
}

function MovieHeaderSuccess({ movie, videos, tmdbId }: MovieHeaderSuccessProps) {
  useSetBreadcrumb(String(tmdbId), movie?.title);

  const trailerUrl = videos.trailerUrl;

  return (
    <section className="relative flex min-h-[420px] overflow-hidden rounded-xl sm:min-h-[500px] lg:min-h-[560px]">
      {/* Backdrop Image */}
      {movie.backdropUrl && (
        <Image
          src={movie.backdropUrl}
          alt=""
          fill
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
        />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content — pinned to bottom */}
      <div className="relative mt-auto px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-24 lg:px-8 lg:pb-10 lg:pt-28">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Poster */}
          <div className="shrink-0 sm:w-44 md:w-52">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-foreground/10">
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="h-full w-full object-cover"
                  sizes="(min-width: 768px) 208px, (min-width: 640px) 176px, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80 p-4 text-center text-sm text-muted-foreground">
                  {movie.title}
                </div>
              )}
            </AspectRatio>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col justify-end">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{movie.title}</h1>
            <p className="mt-1 text-lg text-muted-foreground">{movie.year}</p>

            {movie.tagline && (
              <p className="mt-2 text-sm italic text-muted-foreground/80">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            {/* Metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {movie.rating > 0 && (
                <div className="flex items-center gap-1.5 rounded-lg bg-foreground/10 px-2.5 py-1.5 backdrop-blur-sm">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold tabular-nums">{movie.rating.toFixed(1)}</span>
                </div>
              )}

              <Separator orientation="vertical" className="h-4 bg-foreground/20" />

              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="size-4" />
                {formatRuntime(movie.runtime)}
              </span>

              <Separator orientation="vertical" className="h-4 bg-foreground/20" />

              <span className="text-muted-foreground">{movie.genres.slice(0, 3).join(' / ')}</span>
            </div>

            {/* Library Status + Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <LibraryStatusBadge tmdbId={tmdbId} />

              {trailerUrl && (
                <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90" asChild>
                  <a href={trailerUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="size-4 fill-current" />
                    Watch Trailer
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface MovieHeaderProps {
  tmdbId: number;
}

function MovieHeader({ tmdbId }: MovieHeaderProps) {
  const movieQuery = useQuery(tmdbMovieQueryOptions(tmdbId));
  const videosQuery = useQuery(tmdbVideosQueryOptions(tmdbId));

  return (
    <Queries
      results={[movieQuery, videosQuery] as const}
      callbacks={{
        loading: MovieHeaderLoading,
        error: (error) => <MovieHeaderError error={error} />,
        success: ([movie, videos]) => <MovieHeaderSuccess movie={movie} videos={videos} tmdbId={tmdbId} />,
      }}
    />
  );
}

export type { MovieHeaderProps };
export { MovieHeader };
