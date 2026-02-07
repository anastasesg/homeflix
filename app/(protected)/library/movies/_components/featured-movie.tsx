'use client';

import { useQuery } from '@tanstack/react-query';

import { featuredMovieQueryOptions } from '@/options/queries/movies';

import { FeaturedMediaCarousel, FeaturedMediaError, FeaturedMediaLoading } from '@/components/media';
import { Query } from '@/components/query';

// ============================================================================
// Main Component
// ============================================================================

function FeaturedMovie() {
  const featuredQuery = useQuery(featuredMovieQueryOptions());

  return (
    <Query
      result={featuredQuery}
      callbacks={{
        error: (error) => <FeaturedMediaError type="movie" error={error} refetch={featuredQuery.refetch} />,
        loading: () => <FeaturedMediaLoading type="movie" />,
        success: (movies) => <FeaturedMediaCarousel type="movie" items={movies} />,
      }}
    />
  );
}

export { FeaturedMovie };
