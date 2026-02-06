'use client';

import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ChevronRight, RefreshCw } from 'lucide-react';

import type { DiscoverMovie } from '@/api/entities';
import { cn } from '@/lib/utils';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { MovieCarousel } from '../movie-carousel';
import { DiscoverMovieCard } from '../movies-grid/movie-card';

// ============================================================================
// Types
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DiscoverQueryOptions = UseQueryOptions<DiscoverMovie[], Error, DiscoverMovie[], any>;

type MovieRowSize = 'default' | 'lg';

interface MovieRowProps {
  title: string;
  queryOptions: DiscoverQueryOptions;
  size?: MovieRowSize;
  onSeeAll?: () => void;
}

// ============================================================================
// Sub-components
// ============================================================================

const cardWidthClass: Record<MovieRowSize, string> = {
  default: 'w-[140px] sm:w-[160px] md:w-[180px]',
  lg: 'w-[160px] sm:w-[180px] md:w-[200px]',
};

interface MovieRowLoadingProps {
  size: MovieRowSize;
}

function MovieRowLoading({ size }: MovieRowLoadingProps) {
  return (
    <div className="flex gap-3 overflow-hidden px-2 sm:gap-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('aspect-[2/3] shrink-0 rounded-xl', cardWidthClass[size])}
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
}

interface MovieRowErrorProps {
  error: Error;
  refetch: () => void;
}

function MovieRowError({ error, refetch }: MovieRowErrorProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
      <AlertCircle className="size-4 shrink-0 text-destructive" />
      <p className="flex-1 text-sm text-muted-foreground">{error.message}</p>
      <Button variant="ghost" size="sm" onClick={refetch} className="shrink-0 gap-1.5">
        <RefreshCw className="size-3" />
        Retry
      </Button>
    </div>
  );
}

interface MovieRowSuccessProps {
  movies: DiscoverMovie[];
  size: MovieRowSize;
}

function MovieRowSuccess({ movies, size }: MovieRowSuccessProps) {
  if (movies.length === 0) return null;

  return (
    <MovieCarousel>
      {movies.map((movie, index) => (
        <div key={movie.id} className={cn('shrink-0', cardWidthClass[size])} style={{ scrollSnapAlign: 'start' }}>
          <DiscoverMovieCard movie={movie} index={index} />
        </div>
      ))}
    </MovieCarousel>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function MovieRow({ title, queryOptions: options, size = 'default', onSeeAll }: MovieRowProps) {
  const query = useQuery(options);

  return (
    <section className="space-y-3">
      {/* Row header */}
      <div className="flex items-center justify-between">
        <h2
          className={cn(
            'tracking-tight',
            size === 'lg' ? 'border-l-2 border-primary pl-3 text-xl font-bold' : 'text-lg font-semibold'
          )}
        >
          {title}
        </h2>
        {onSeeAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSeeAll}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            See All
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>

      {/* Row content */}
      <Query
        result={query}
        callbacks={{
          loading: () => <MovieRowLoading size={size} />,
          error: (error) => <MovieRowError error={error} refetch={query.refetch} />,
          success: (movies) => <MovieRowSuccess movies={movies} size={size} />,
        }}
      />
    </section>
  );
}

export type { MovieRowProps };
export { MovieRow };
