import { queryOptions } from '@tanstack/react-query';

import { fetchFeaturedMovie, fetchMovieItems, MovieItemsRequest } from '@/api/functions';

export type MovieQueryProps = MovieItemsRequest;

/**
 * Query options for fetching all movies from Radarr.
 * Returns MovieItem[] ready for UI consumption.
 */
export function moviesQueryOptions(props: MovieQueryProps) {
  return queryOptions({
    queryKey: ['movies', props],
    queryFn: async () => await fetchMovieItems(props),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Query options for fetching the featured movie from Radarr.
 * Returns MovieItem ready for UI consumption.
 */
export function featuredMovieQuery() {
  return queryOptions({
    queryKey: ['movies', 'featured'],
    queryFn: async () => await fetchFeaturedMovie(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
