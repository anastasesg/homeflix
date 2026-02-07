'use client';

import { useQuery } from '@tanstack/react-query';

import { featuredShowQueryOptions } from '@/options/queries/shows';

import { FeaturedMediaCarousel, FeaturedMediaError, FeaturedMediaLoading } from '@/components/media';
import { Query } from '@/components/query';

// ============================================================================
// Main Component
// ============================================================================

function FeaturedShow() {
  const featured = useQuery(featuredShowQueryOptions());

  return (
    <Query
      result={featured}
      callbacks={{
        error: (error) => <FeaturedMediaError type="show" error={error} refetch={featured.refetch} />,
        loading: () => <FeaturedMediaLoading type="show" />,
        success: (shows) => <FeaturedMediaCarousel type="show" items={shows} />,
      }}
    />
  );
}

export { FeaturedShow };
