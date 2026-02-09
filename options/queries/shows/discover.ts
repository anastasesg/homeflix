import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { DiscoverShowFilters, DiscoverShowPage } from '@/api/dtos';
import {
  fetchAiringTodayShows,
  fetchFilteredShows,
  fetchFilteredShowsInfinite,
  fetchHiddenGemShows,
  fetchOnTheAirShows,
  fetchShowsByGenre,
  fetchTopRatedShows,
  fetchTrendingShows,
  searchShows,
  searchShowsInfinite,
} from '@/api/functions';

export type { DiscoverShowFilters, DiscoverShowPage };

export function trendingShowsQueryOptions() {
  return queryOptions({
    queryKey: ['shows', 'discover', 'trending'] as const,
    queryFn: fetchTrendingShows,
    staleTime: 10 * 60 * 1000,
  });
}

export function topRatedShowsQueryOptions() {
  return queryOptions({
    queryKey: ['shows', 'discover', 'top-rated'] as const,
    queryFn: fetchTopRatedShows,
    staleTime: 10 * 60 * 1000,
  });
}

export function onTheAirShowsQueryOptions() {
  return queryOptions({
    queryKey: ['shows', 'discover', 'on-the-air'] as const,
    queryFn: fetchOnTheAirShows,
    staleTime: 10 * 60 * 1000,
  });
}

export function airingTodayShowsQueryOptions() {
  return queryOptions({
    queryKey: ['shows', 'discover', 'airing-today'] as const,
    queryFn: fetchAiringTodayShows,
    staleTime: 10 * 60 * 1000,
  });
}

export function hiddenGemShowsQueryOptions() {
  return queryOptions({
    queryKey: ['shows', 'discover', 'hidden-gems'] as const,
    queryFn: fetchHiddenGemShows,
    staleTime: 10 * 60 * 1000,
  });
}

export function showsByGenreQueryOptions(genreId: number) {
  return queryOptions({
    queryKey: ['shows', 'discover', 'genre', genreId] as const,
    queryFn: () => fetchShowsByGenre(genreId),
    staleTime: 10 * 60 * 1000,
  });
}

export function filteredShowsQueryOptions(filters: DiscoverShowFilters) {
  return queryOptions({
    queryKey: ['shows', 'discover', 'filtered', filters] as const,
    queryFn: () => fetchFilteredShows(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function searchShowsQueryOptions(query: string, page?: number) {
  return queryOptions({
    queryKey: ['shows', 'discover', 'search', query, page] as const,
    queryFn: () => searchShows(query, page),
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0,
  });
}

export function searchShowsInfiniteQueryOptions(query: string) {
  return infiniteQueryOptions({
    queryKey: ['shows', 'discover', 'search', 'infinite', query] as const,
    queryFn: ({ pageParam }) => searchShowsInfinite(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0,
  });
}

export function filteredShowsInfiniteQueryOptions(filters: DiscoverShowFilters) {
  return infiniteQueryOptions({
    queryKey: ['shows', 'discover', 'infinite', filters] as const,
    queryFn: ({ pageParam }) => fetchFilteredShowsInfinite(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });
}
