'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Clock, Film, Play, RefreshCw, Star } from 'lucide-react';

import { MovieItem } from '@/api/entities';
import { featuredMovieQueryOptions } from '@/options/queries/movies/library';

import { Query } from '@/components/query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type FeaturedMovieFailedProps = {
  error: Error;
  refetch: () => void;
};

type FeaturedMovieSuccessProps = {
  movie: MovieItem | undefined;
};

function FeaturedMovieFailed({ error, refetch }: FeaturedMovieFailedProps) {
  return (
    <section className="relative overflow-hidden rounded-xl">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[2.4/1]">
        {/* Moody gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-background to-background" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="size-8 text-destructive" />
          </div>

          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Unable to load featured movie
            </h2>
            <p className="text-sm text-muted-foreground">
              {error.message || 'Something went wrong. Please try again.'}
            </p>
          </div>

          <Button variant="outline" onClick={refetch} className="mt-2 gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeaturedMovieLoading() {
  return (
    <section className="relative overflow-hidden rounded-xl">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[2.4/1]">
        {/* Animated gradient background - simulates a cinematic shimmer */}
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted/80 to-muted" />

        {/* Sweeping light effect */}
        <div
          className="absolute inset-0 animate-[shimmer_2s_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />

        {/* Film grain texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient overlays matching the success state */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Content skeleton */}
        <div className="absolute inset-0 flex items-end p-4 sm:p-6 lg:p-8">
          <div className="flex max-w-2xl flex-col gap-3">
            {/* Tagline skeleton - hidden on mobile */}
            <div className="hidden h-4 w-48 animate-pulse rounded bg-white/5 sm:block" />

            {/* Title skeleton */}
            <div className="h-8 w-72 animate-pulse rounded bg-white/10 sm:h-10 sm:w-96" />

            {/* Meta info skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-4 w-12 animate-pulse rounded bg-white/5" />
              <div className="h-4 w-16 animate-pulse rounded bg-white/5" />
              <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
            </div>

            {/* Genres skeleton */}
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-white/5" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-white/5" />
              <div className="h-6 w-14 animate-pulse rounded-full bg-white/5" />
            </div>

            {/* Overview skeleton - hidden on mobile */}
            <div className="hidden space-y-2 sm:block">
              <div className="h-4 w-full max-w-xl animate-pulse rounded bg-white/5" />
              <div className="h-4 w-4/5 max-w-xl animate-pulse rounded bg-white/5" />
            </div>

            {/* Button skeleton */}
            <div className="pt-2">
              <div className="h-10 w-32 animate-pulse rounded-md bg-white/10 sm:w-40" />
            </div>
          </div>
        </div>

        {/* Floating film icon - adds character to loading state */}
        <div className="absolute right-6 top-6 hidden animate-pulse text-white/10 md:block lg:right-12 lg:top-12">
          <Film className="size-24 lg:size-32" strokeWidth={1} />
        </div>
      </div>
    </section>
  );
}

function FeaturedMovieSuccess({ movie }: FeaturedMovieSuccessProps) {
  const formatRuntime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  if (!movie) return null;
  return (
    <section className="relative overflow-hidden rounded-xl">
      {/* Backdrop Image */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[2.4/1]">
        {movie.backdropUrl && (
          <Image src={movie.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" fill />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Noise texture overlay for cinematic feel */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-end p-4 sm:p-6 lg:p-8">
          <div className="flex max-w-2xl flex-col gap-2 sm:gap-3">
            {/* Tagline - hidden on mobile for space */}
            {movie.tagline && (
              <p className="hidden font-serif text-sm italic text-muted-foreground/80 sm:block md:text-base">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Title */}
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
              {movie.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:text-sm">
              {movie.rating && (
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <Star className="size-4 fill-current" />
                  <span className="font-medium tabular-nums">{movie.rating.toFixed(1)}</span>
                </span>
              )}

              {movie.year && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="tabular-nums">{movie.year}</span>
                </>
              )}

              {movie.runtime && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {formatRuntime(movie.runtime)}
                  </span>
                </>
              )}

              {movie.quality && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    {movie.quality}
                  </Badge>
                </>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {movie.genres.slice(0, 3).map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="bg-white/10 px-2 py-0.5 text-[10px] backdrop-blur-sm hover:bg-white/20 sm:text-xs"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Overview - hidden on mobile */}
            {movie.overview && (
              <p className="hidden max-w-xl text-sm leading-relaxed text-muted-foreground sm:line-clamp-2 md:line-clamp-3 md:text-base">
                {movie.overview}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1 sm:pt-2">
              <Button asChild size="default" className="gap-2 shadow-lg shadow-primary/20 sm:size-lg">
                <Link href={`/media/movies/${movie.tmdbId}`}>
                  <Play className="size-4 fill-current" />
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Details</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedMovie() {
  const featuredMovie = useQuery(featuredMovieQueryOptions());

  return (
    <Query
      result={featuredMovie}
      callbacks={{
        error: (error) => <FeaturedMovieFailed error={error} refetch={featuredMovie.refetch} />,
        loading: () => <FeaturedMovieLoading />,
        success: (movie) => <FeaturedMovieSuccess movie={movie} />,
      }}
    />
  );
}

export { FeaturedMovie };
