'use client';

import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useQuery } from '@tanstack/react-query';

import type { MovieItem, ShowItem } from '@/api/entities';
import {
  nowPlayingMoviesQueryOptions,
  topRatedMoviesQueryOptions,
  trendingMoviesQueryOptions,
} from '@/options/queries/movies';
import { trendingShowsQueryOptions } from '@/options/queries/shows';

import { Query } from '@/components/query';

import type { FeaturedItem } from './_components/tv-hero';
import { TvFeaturedHero } from './_components/tv-hero';
import type { TvMediaItem } from './_components/tv-media-row';
import { TvMediaRow } from './_components/tv-media-row';

// ============================================================
// Utilities
// ============================================================

function movieToMediaItem(movie: MovieItem): TvMediaItem {
  return {
    id: movie.tmdbId,
    title: movie.title,
    year: movie.year,
    posterUrl: movie.posterUrl,
    mediaType: 'movie',
  };
}

function showToMediaItem(show: ShowItem): TvMediaItem {
  return {
    id: show.tmdbId,
    title: show.title,
    year: show.year,
    posterUrl: show.posterUrl,
    mediaType: 'show',
  };
}

function movieToFeaturedItem(movie: MovieItem): FeaturedItem {
  return {
    id: movie.tmdbId,
    title: movie.title,
    overview: movie.overview,
    year: movie.year,
    rating: movie.rating,
    backdropUrl: movie.backdropUrl,
    mediaType: 'movie',
  };
}

// ============================================================
// Sub-components
// ============================================================

function TvHomeHero() {
  const query = useQuery(trendingMoviesQueryOptions());

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => (
          <div className="flex aspect-video w-full items-center justify-center bg-muted/10">
            <p className="text-2xl text-muted-foreground">Loading...</p>
          </div>
        ),
        error: () => null,
        success: (movies) => <TvFeaturedHero items={movies.slice(0, 5).map(movieToFeaturedItem)} />,
      }}
    />
  );
}

function TvHomeTrendingMovies() {
  const query = useQuery(trendingMoviesQueryOptions());

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => <RowSkeleton title="Trending Movies" />,
        error: () => null,
        success: (movies) => (
          <TvMediaRow title="Trending Movies" items={movies.map(movieToMediaItem)} focusKey="trending-movies" />
        ),
      }}
    />
  );
}

function TvHomeTopRatedMovies() {
  const query = useQuery(topRatedMoviesQueryOptions());

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => <RowSkeleton title="Top Rated Movies" />,
        error: () => null,
        success: (movies) => (
          <TvMediaRow title="Top Rated Movies" items={movies.map(movieToMediaItem)} focusKey="top-rated-movies" />
        ),
      }}
    />
  );
}

function TvHomeNowPlaying() {
  const query = useQuery(nowPlayingMoviesQueryOptions());

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => <RowSkeleton title="Now Playing" />,
        error: () => null,
        success: (movies) => (
          <TvMediaRow title="Now Playing" items={movies.map(movieToMediaItem)} focusKey="now-playing" />
        ),
      }}
    />
  );
}

function TvHomeTrendingShows() {
  const query = useQuery(trendingShowsQueryOptions());

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => <RowSkeleton title="Trending Shows" />,
        error: () => null,
        success: (shows) => (
          <TvMediaRow title="Trending Shows" items={shows.map(showToMediaItem)} focusKey="trending-shows" />
        ),
      }}
    />
  );
}

function RowSkeleton({ title }: { title: string }) {
  return (
    <section className="flex flex-col gap-4 py-4">
      <h2 className="px-12 text-2xl font-semibold">{title}</h2>
      <div className="flex gap-4 px-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[300px] w-[200px] shrink-0 animate-pulse rounded-xl bg-muted/20" />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Main
// ============================================================

export default function TvHomePage() {
  const { ref, focusKey } = useFocusable({
    focusKey: 'tv-home',
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-col pb-12">
        <TvHomeHero />
        <TvHomeTrendingMovies />
        <TvHomeTopRatedMovies />
        <TvHomeNowPlaying />
        <TvHomeTrendingShows />
      </div>
    </FocusContext.Provider>
  );
}
