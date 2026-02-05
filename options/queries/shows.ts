import { queryOptions } from '@tanstack/react-query';

import { fetchFeaturedShow, fetchShowItems, ShowItemsRequest } from '@/api/functions';

export type ShowQueryProps = ShowItemsRequest;

/**
 * Query options for fetching all shows from Sonarr.
 * Returns ShowItemsResponse with stats and filtered shows array.
 */
export function showsQueryOptions(props: ShowQueryProps) {
  return queryOptions({
    queryKey: ['shows', props],
    queryFn: async () => await fetchShowItems(props),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Query options for fetching the featured show from Sonarr.
 * Returns ShowItem ready for UI consumption.
 */
export function featuredShowQuery() {
  return queryOptions({
    queryKey: ['shows', 'featured'],
    queryFn: async () => await fetchFeaturedShow(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
