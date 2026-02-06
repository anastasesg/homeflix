'use client';

import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  hiddenGemMoviesQueryOptions,
  moviesByGenreQueryOptions,
  nowPlayingMoviesQueryOptions,
  topRatedMoviesQueryOptions,
  trendingMoviesQueryOptions,
  upcomingMoviesQueryOptions,
} from '@/options/queries/movies/discover';
import { movieGenresQueryOptions } from '@/options/queries/movies/metadata';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

import { MovieRow } from './movie-row';

// ============================================================================
// Types
// ============================================================================

interface MoviesBrowseProps {
  onApplyGenreFilter?: (genreId: number) => void;
}

// ============================================================================
// Sub-components
// ============================================================================

interface LazyMovieRowProps {
  title: string;
  genreId: number;
  onSeeAll?: () => void;
}

function LazyMovieRow({ title, genreId, onSeeAll }: LazyMovieRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        <MovieRow title={title} queryOptions={moviesByGenreQueryOptions(genreId)} onSeeAll={onSeeAll} />
      ) : (
        <section className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-3 overflow-hidden px-2 sm:gap-4">
            {Array.from({ length: 7 }).map((_, j) => (
              <Skeleton key={j} className="aspect-[2/3] w-[140px] shrink-0 rounded-xl sm:w-[160px] md:w-[180px]" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function GenreRowsLoading() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-3 overflow-hidden px-2 sm:gap-4">
            {Array.from({ length: 7 }).map((_, j) => (
              <Skeleton key={j} className="aspect-[2/3] w-[140px] shrink-0 rounded-xl sm:w-[160px] md:w-[180px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface GenreRowsProps {
  onApplyGenreFilter?: (genreId: number) => void;
}

function GenreRows({ onApplyGenreFilter }: GenreRowsProps) {
  const genresQuery = useQuery(movieGenresQueryOptions());

  return (
    <Query
      result={genresQuery}
      callbacks={{
        loading: () => <GenreRowsLoading />,
        error: () => null,
        success: (genres) => (
          <div className="space-y-8">
            {genres.map((genre) => (
              <LazyMovieRow
                key={genre.id}
                title={genre.name}
                genreId={genre.id}
                onSeeAll={onApplyGenreFilter ? () => onApplyGenreFilter(genre.id) : undefined}
              />
            ))}
          </div>
        ),
      }}
    />
  );
}

// ============================================================================
// Main Component
// ============================================================================

function MoviesBrowse({ onApplyGenreFilter }: MoviesBrowseProps) {
  return (
    <div className="space-y-8">
      {/* Smart rows — elevated treatment */}
      <MovieRow title="Trending This Week" queryOptions={trendingMoviesQueryOptions()} size="lg" />
      <MovieRow title="Top Rated" queryOptions={topRatedMoviesQueryOptions()} size="lg" />
      <MovieRow title="Now Playing" queryOptions={nowPlayingMoviesQueryOptions()} size="lg" />
      <MovieRow title="Upcoming" queryOptions={upcomingMoviesQueryOptions()} size="lg" />
      <MovieRow title="Hidden Gems" queryOptions={hiddenGemMoviesQueryOptions()} size="lg" />

      {/* Separator */}
      <div className="border-t border-border/40" />

      {/* Genre rows — lazy loaded on scroll */}
      <GenreRows onApplyGenreFilter={onApplyGenreFilter} />
    </div>
  );
}

export type { MoviesBrowseProps };
export { MoviesBrowse };
