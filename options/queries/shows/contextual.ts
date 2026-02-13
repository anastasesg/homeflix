import { queryOptions } from '@tanstack/react-query';

import type { DiscoverShowFilters } from '@/api/dtos';
import { fetchContextualShows } from '@/api/functions';

export function contextualShowsQueryOptions(ruleId: string, filters: DiscoverShowFilters) {
  return queryOptions({
    queryKey: ['shows', 'contextual', ruleId, filters] as const,
    queryFn: () => fetchContextualShows(filters),
    staleTime: 10 * 60 * 1000,
  });
}
