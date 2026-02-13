import { queryOptions } from '@tanstack/react-query';

import type { DiscoverMovieFilters } from '@/api/dtos';
import { fetchContextualMovies } from '@/api/functions';

export function contextualMoviesQueryOptions(ruleId: string, filters: DiscoverMovieFilters) {
  return queryOptions({
    queryKey: ['movies', 'contextual', ruleId, filters] as const,
    queryFn: () => fetchContextualMovies(filters),
    staleTime: 10 * 60 * 1000,
  });
}
