import { queryOptions } from '@tanstack/react-query';

import { fetchShowGenres, fetchShowNetworks, fetchShowWatchProviders } from '@/api/functions';

export function showGenresQueryOptions() {
  return queryOptions({
    queryKey: ['shows', 'metadata', 'genres'] as const,
    queryFn: fetchShowGenres,
    staleTime: 30 * 60 * 1000,
  });
}

export function showWatchProvidersQueryOptions(region: string = 'US') {
  return queryOptions({
    queryKey: ['shows', 'metadata', 'watch-providers', region] as const,
    queryFn: () => fetchShowWatchProviders(region),
    staleTime: 60 * 60 * 1000,
  });
}

export function showNetworksQueryOptions() {
  return queryOptions({
    queryKey: ['shows', 'metadata', 'networks'] as const,
    queryFn: fetchShowNetworks,
    staleTime: 60 * 60 * 1000,
  });
}
