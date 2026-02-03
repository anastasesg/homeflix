'use client';

import Link from 'next/link';

import { Clock, Play, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { EnrichedMovie } from './types';

interface FeaturedMovieProps {
  movie: EnrichedMovie;
}

function FeaturedMovie({ movie }: FeaturedMovieProps) {
  const formatRuntime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <section className="relative overflow-hidden rounded-xl">
      {/* Backdrop Image */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[2.4/1]">
        {movie.backdropUrl && (
          <img src={movie.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
                <Link href={`/library/movies/${movie.id}`}>
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

export { FeaturedMovie };
