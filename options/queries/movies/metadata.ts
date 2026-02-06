import { queryOptions } from '@tanstack/react-query';

import { fetchMovieCertifications, fetchMovieGenres, fetchMovieWatchProviders } from '@/api/functions';

export function movieGenresQueryOptions() {
  return queryOptions({
    queryKey: ['movies', 'metadata', 'genres'] as const,
    queryFn: fetchMovieGenres,
    staleTime: 30 * 60 * 1000,
  });
}

export function movieWatchProvidersQueryOptions(region: string = 'US') {
  return queryOptions({
    queryKey: ['movies', 'metadata', 'watch-providers', region] as const,
    queryFn: () => fetchMovieWatchProviders(region),
    staleTime: 60 * 60 * 1000,
  });
}

export function movieCertificationsQueryOptions(country: string = 'US') {
  return queryOptions({
    queryKey: ['movies', 'metadata', 'certifications', country] as const,
    queryFn: () => fetchMovieCertifications(country),
    staleTime: 60 * 60 * 1000,
  });
}
