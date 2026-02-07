'use client';

import { useQuery } from '@tanstack/react-query';

import { trendingMoviesQueryOptions } from '@/options/queries/movies/discover';

import { FeaturedMediaCarousel, FeaturedMediaError, FeaturedMediaLoading } from '@/components/media';
import { Query } from '@/components/query';

// ============================================================================
// Main Component
// ============================================================================

function FeaturedMovie() {
  const trendingQuery = useQuery(trendingMoviesQueryOptions());

  return (
    <Query
      result={trendingQuery}
      callbacks={{
        error: (error) => <FeaturedMediaError type="movie" error={error} refetch={trendingQuery.refetch} />,
        loading: () => <FeaturedMediaLoading type="movie" />,
        success: (movies) => <FeaturedMediaCarousel type="movie" items={movies} />,
      }}
    />
  );
}

export { FeaturedMovie };
