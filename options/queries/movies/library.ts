import { queryOptions } from '@tanstack/react-query';

import type { MovieItemsRequest } from '@/api/dtos';
import { fetchFeaturedMovie, fetchMovieHistory, fetchMovieItems, fetchMovieLibraryInfo } from '@/api/functions';

export type MovieQueryProps = MovieItemsRequest;

export function movieItemsQueryOptions(props: MovieQueryProps) {
  return queryOptions({
    queryKey: ['movies', 'library', 'items', props] as const,
    queryFn: () => fetchMovieItems(props),
    staleTime: 2 * 60 * 1000,
  });
}

export function featuredMovieQueryOptions() {
  return queryOptions({
    queryKey: ['movies', 'library', 'featured'] as const,
    queryFn: fetchFeaturedMovie,
    staleTime: 2 * 60 * 1000,
  });
}

export function movieLibraryInfoQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'library', 'info', tmdbId] as const,
    queryFn: () => fetchMovieLibraryInfo(tmdbId),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function movieHistoryQueryOptions(radarrId: number) {
  return queryOptions({
    queryKey: ['movies', 'library', 'history', radarrId] as const,
    queryFn: () => fetchMovieHistory(radarrId),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
