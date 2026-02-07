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

// ============================================================================
// Select-based views into movieDetailQueryOptions (shared cache, typed slices)
// ============================================================================

export function movieOverviewQueryOptions(tmdbId: number) {
  return queryOptions({
    ...movieDetailQueryOptions(tmdbId),
    select: (movie) => movie.overview,
  });
}

export function movieTitleQueryOptions(tmdbId: number) {
  return queryOptions({
    ...movieDetailQueryOptions(tmdbId),
    select: (movie) => movie.title,
  });
}

export function movieDetailGenresQueryOptions(tmdbId: number) {
  return queryOptions({
    ...movieDetailQueryOptions(tmdbId),
    select: (movie) => movie.genres,
  });
}

export function movieProductionQueryOptions(tmdbId: number) {
  return queryOptions({
    ...movieDetailQueryOptions(tmdbId),
    select: (movie) => ({
      budget: movie.budget,
      revenue: movie.revenue,
      productionCompanies: movie.productionCompanies,
    }),
  });
}

export function movieExternalLinksQueryOptions(tmdbId: number) {
  return queryOptions({
    ...movieDetailQueryOptions(tmdbId),
    select: (movie) => ({
      imdbId: movie.imdbId,
      tmdbId: movie.tmdbId,
      homepage: movie.homepage,
    }),
  });
}
