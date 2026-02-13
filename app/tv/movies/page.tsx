'use client';

import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useQuery } from '@tanstack/react-query';

import type { MovieItem } from '@/api/entities';
import { trendingMoviesQueryOptions } from '@/options/queries/movies';

import { Query } from '@/components/query';

import { TvMediaCard } from '../_components/tv-card';

// ============================================================
// Sub-components
// ============================================================

function MovieGrid({ movies }: { movies: MovieItem[] }) {
  const { ref, focusKey } = useFocusable({
    focusKey: 'movie-grid',
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-wrap gap-6 px-12 py-8">
        {movies.map((movie) => (
          <TvMediaCard
            key={movie.tmdbId}
            id={movie.tmdbId}
            title={movie.title}
            year={movie.year}
            posterUrl={movie.posterUrl}
            mediaType="movie"
          />
        ))}
      </div>
    </FocusContext.Provider>
  );
}

function MovieGridSkeleton() {
  return (
    <div className="flex flex-wrap gap-6 px-12 py-8">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="h-[300px] w-[200px] animate-pulse rounded-xl bg-muted/20" />
      ))}
    </div>
  );
}

// ============================================================
// Main
// ============================================================

export default function TvMovieBrowsePage() {
  const query = useQuery(trendingMoviesQueryOptions());

  return (
    <div className="flex flex-col">
      <h1 className="px-12 pt-8 text-4xl font-bold">Movies</h1>
      <Query
        result={query}
        callbacks={{
          loading: () => <MovieGridSkeleton />,
          error: (error) => (
            <div className="flex items-center justify-center py-20">
              <p className="text-xl text-muted-foreground">{error.message}</p>
            </div>
          ),
          success: (movies) => <MovieGrid movies={movies} />,
        }}
      />
    </div>
  );
}
