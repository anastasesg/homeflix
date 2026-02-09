import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { DiscoverMovieFilters, DiscoverMoviePage } from '@/api/dtos';
import {
  fetchFilteredMovies,
  fetchFilteredMoviesInfinite,
  fetchHiddenGemMovies,
  fetchMoviesByGenre,
  fetchNowPlayingMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
  searchMovies,
  searchMoviesInfinite,
} from '@/api/functions';

export type { DiscoverMovieFilters, DiscoverMoviePage };

export function trendingMoviesQueryOptions() {
  return queryOptions({
    queryKey: ['movies', 'discover', 'trending'] as const,
    queryFn: fetchTrendingMovies,
    staleTime: 10 * 60 * 1000,
  });
}

export function topRatedMoviesQueryOptions() {
  return queryOptions({
    queryKey: ['movies', 'discover', 'top-rated'] as const,
    queryFn: fetchTopRatedMovies,
    staleTime: 10 * 60 * 1000,
  });
}

export function nowPlayingMoviesQueryOptions() {
  return queryOptions({
    queryKey: ['movies', 'discover', 'now-playing'] as const,
    queryFn: fetchNowPlayingMovies,
    staleTime: 10 * 60 * 1000,
  });
}

export function upcomingMoviesQueryOptions() {
  return queryOptions({
    queryKey: ['movies', 'discover', 'upcoming'] as const,
    queryFn: fetchUpcomingMovies,
    staleTime: 10 * 60 * 1000,
  });
}

export function hiddenGemMoviesQueryOptions() {
  return queryOptions({
    queryKey: ['movies', 'discover', 'hidden-gems'] as const,
    queryFn: fetchHiddenGemMovies,
    staleTime: 10 * 60 * 1000,
  });
}

export function moviesByGenreQueryOptions(genreId: number) {
  return queryOptions({
    queryKey: ['movies', 'discover', 'genre', genreId] as const,
    queryFn: () => fetchMoviesByGenre(genreId),
    staleTime: 10 * 60 * 1000,
  });
}

export function filteredMoviesQueryOptions(filters: DiscoverMovieFilters) {
  return queryOptions({
    queryKey: ['movies', 'discover', 'filtered', filters] as const,
    queryFn: () => fetchFilteredMovies(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function searchMoviesQueryOptions(query: string, page?: number) {
  return queryOptions({
    queryKey: ['movies', 'discover', 'search', query, page] as const,
    queryFn: () => searchMovies(query, page),
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0,
  });
}

export function searchMoviesInfiniteQueryOptions(query: string) {
  return infiniteQueryOptions({
    queryKey: ['movies', 'discover', 'search', 'infinite', query] as const,
    queryFn: ({ pageParam }) => searchMoviesInfinite(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0,
  });
}

export function filteredMoviesInfiniteQueryOptions(filters: DiscoverMovieFilters) {
  return infiniteQueryOptions({
    queryKey: ['movies', 'discover', 'infinite', filters] as const,
    queryFn: ({ pageParam }) => fetchFilteredMoviesInfinite(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });
}
