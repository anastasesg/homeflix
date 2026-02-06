import { queryOptions } from '@tanstack/react-query';

import {
  fetchMovieCredits,
  fetchMovieDetail,
  fetchMovieImages,
  fetchMovieKeywords,
  fetchMovieVideos,
} from '@/api/functions';

export function movieDetailQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', tmdbId] as const,
    queryFn: () => fetchMovieDetail(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function movieCreditsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', tmdbId, 'credits'] as const,
    queryFn: () => fetchMovieCredits(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function movieImagesQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', tmdbId, 'images'] as const,
    queryFn: () => fetchMovieImages(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function movieVideosQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', tmdbId, 'videos'] as const,
    queryFn: () => fetchMovieVideos(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function movieKeywordsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', tmdbId, 'keywords'] as const,
    queryFn: () => fetchMovieKeywords(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}
