'use client';

import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { DiscoverShow } from '@/api/entities';

import { MediaRow, MediaRowError, MediaRowLoading } from '@/components/media';
import { Query } from '@/components/query';

// ============================================================================
// Types
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DiscoverShowQueryOptions = UseQueryOptions<DiscoverShow[], Error, DiscoverShow[], any>;

type ShowRowSize = 'default' | 'lg';

interface ShowRowProps {
  title: string;
  queryOptions: DiscoverShowQueryOptions;
  size?: ShowRowSize;
  onSeeAll?: () => void;
}

// ============================================================================
// Main Component
// ============================================================================

function ShowRow({ title, queryOptions: options, size = 'default', onSeeAll }: ShowRowProps) {
  const query = useQuery(options);

  return (
    <Query
      result={query}
      callbacks={{
        error: (error) => <MediaRowError type="show" error={error} refetch={query.refetch} />,
        loading: () => <MediaRowLoading type="show" />,
        success: (shows) => <MediaRow type="show" size={size} title={title} media={shows} onSeeAll={onSeeAll} />,
      }}
    />
  );
}

export type { ShowRowProps };
export { ShowRow };
