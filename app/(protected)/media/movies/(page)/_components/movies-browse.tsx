'use client';

import { useDiscoverFilters } from '@/hooks/filters';
import {
  hiddenGemMoviesQueryOptions,
  moviesByGenreQueryOptions,
  nowPlayingMoviesQueryOptions,
  topRatedMoviesQueryOptions,
  trendingMoviesQueryOptions,
  upcomingMoviesQueryOptions,
} from '@/options/queries/movies/discover';
import { movieGenresQueryOptions } from '@/options/queries/movies/metadata';

import type { FeaturedRowConfig } from '@/components/media';
import { MediaBrowse } from '@/components/media';

// ============================================================================
// Constants
// ============================================================================

const FEATURED_ROWS: FeaturedRowConfig[] = [
  { title: 'Trending This Week', queryOptions: trendingMoviesQueryOptions() },
  { title: 'Top Rated', queryOptions: topRatedMoviesQueryOptions() },
  { title: 'Now Playing', queryOptions: nowPlayingMoviesQueryOptions() },
  { title: 'Upcoming', queryOptions: upcomingMoviesQueryOptions() },
  { title: 'Hidden Gems', queryOptions: hiddenGemMoviesQueryOptions() },
];

// ============================================================================
// Main Component
// ============================================================================

type MoviesBrowseProps = object;

function MoviesBrowse(_props: MoviesBrowseProps) {
  const { setGenres } = useDiscoverFilters();

  const handleApplyGenreFilter = (genreId: number) => {
    setGenres([genreId]);
  };

  return (
    <MediaBrowse
      type="movie"
      featuredRows={FEATURED_ROWS}
      genresQueryOptions={movieGenresQueryOptions()}
      byGenreQueryOptions={moviesByGenreQueryOptions}
      onApplyGenreFilter={handleApplyGenreFilter}
    />
  );
}

export type { MoviesBrowseProps };
export { MoviesBrowse };
