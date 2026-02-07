'use client';

import { useQuery } from '@tanstack/react-query';

import { trendingShowsQueryOptions } from '@/options/queries/shows/discover';

import { FeaturedMediaCarousel, FeaturedMediaError, FeaturedMediaLoading } from '@/components/media';
import { Query } from '@/components/query';

// ============================================================================
// Main Component
// ============================================================================

function FeaturedShow() {
  const trendingQuery = useQuery(trendingShowsQueryOptions());

  return (
    <Query
      result={trendingQuery}
      callbacks={{
        error: (error) => <FeaturedMediaError type="show" error={error} refetch={trendingQuery.refetch} />,
        loading: () => <FeaturedMediaLoading type="show" />,
        success: (shows) => <FeaturedMediaCarousel type="show" items={shows} />,
      }}
    />
  );
}

export { FeaturedShow };
