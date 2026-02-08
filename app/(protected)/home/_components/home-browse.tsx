'use client';

import { useRouter } from 'next/navigation';

import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { trendingMoviesQueryOptions } from '@/options/queries/movies/discover';
import { trendingShowsQueryOptions } from '@/options/queries/shows/discover';

import type { MediaRowProps } from '@/components/media';
import { MediaRow, MediaRowError, MediaRowLoading } from '@/components/media';
import { Query } from '@/components/query';

import { StubRow } from './stub-row';

// ============================================================================
// Types
// ============================================================================

type MediaType = 'movie' | 'show';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BrowseQueryOptions = UseQueryOptions<any[], Error, any[], any>;

interface BrowseRowProps {
  type: MediaType;
  title: string;
  queryOptions: BrowseQueryOptions;
  onSeeAll?: () => void;
}

type HomeBrowseProps = object;

// ============================================================================
// Sub-components
// ============================================================================

function BrowseRow({ type, title, queryOptions: options, onSeeAll }: BrowseRowProps) {
  const query = useQuery(options);

  return (
    <Query
      result={query}
      callbacks={{
        error: (error) => <MediaRowError type={type} error={error} refetch={query.refetch} />,
        loading: () => <MediaRowLoading type={type} />,
        success: (data) => <MediaRow {...({ type, size: 'lg', title, media: data, onSeeAll } as MediaRowProps)} />,
      }}
    />
  );
}

// ============================================================================
// Main Component
// ============================================================================

function HomeBrowse(_props: HomeBrowseProps) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <StubRow title="Continue Watching" />
      <StubRow title="Recently Added" />
      <BrowseRow
        type="movie"
        title="Trending Movies"
        queryOptions={trendingMoviesQueryOptions()}
        onSeeAll={() => router.push('/media/movies')}
      />
      <BrowseRow
        type="show"
        title="Trending Shows"
        queryOptions={trendingShowsQueryOptions()}
        onSeeAll={() => router.push('/media/shows')}
      />
      <StubRow title="Recommended for You" />
    </div>
  );
}

export type { HomeBrowseProps };
export { HomeBrowse };
