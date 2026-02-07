'use client';

import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { MovieItem } from '@/api/entities';

import { MediaRow, MediaRowError, MediaRowLoading } from '@/components/media';
import { Query } from '@/components/query';

// ============================================================================
// Types
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DiscoverQueryOptions = UseQueryOptions<MovieItem[], Error, MovieItem[], any>;

type MovieRowSize = 'default' | 'lg';

interface MovieRowProps {
  title: string;
  queryOptions: DiscoverQueryOptions;
  size?: MovieRowSize;
  onSeeAll?: () => void;
}

// ============================================================================
// Main Component
// ============================================================================

function MovieRow({ title, queryOptions: options, size = 'default', onSeeAll }: MovieRowProps) {
  const query = useQuery(options);

  return (
    <Query
      result={query}
      callbacks={{
        error: (error) => <MediaRowError type="movie" error={error} refetch={query.refetch} />,
        loading: () => <MediaRowLoading type="movie" />,
        success: (movies) => <MediaRow type="movie" size={size} title={title} media={movies} onSeeAll={onSeeAll} />,
      }}
    />
  );
}

export type { MovieRowProps };
export { MovieRow };
