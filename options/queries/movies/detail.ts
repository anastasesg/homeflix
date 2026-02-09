import { queryOptions } from '@tanstack/react-query';

import {
  fetchMovieContentRating,
  fetchMovieCredits,
  fetchMovieDetail,
  fetchMovieImages,
  fetchMovieKeywords,
  fetchMovieRecommendations,
  fetchMovieReviews,
  fetchMovieVideos,
  fetchPersonMovieCredits,
  fetchSimilarMovies,
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

export function movieRecommendationsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', tmdbId, 'recommendations'] as const,
    queryFn: () => fetchMovieRecommendations(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function similarMoviesQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', tmdbId, 'similar'] as const,
    queryFn: () => fetchSimilarMovies(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function movieContentRatingQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', tmdbId, 'content-rating'] as const,
    queryFn: () => fetchMovieContentRating(tmdbId),
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

export function movieCollectionQueryOptions(tmdbId: number) {
  return queryOptions({
    ...movieDetailQueryOptions(tmdbId),
    select: (movie) => movie.collection,
  });
}

export function movieDirectorQueryOptions(tmdbId: number) {
  return queryOptions({
    ...movieCreditsQueryOptions(tmdbId),
    select: (credits) => credits.crew.find((c) => c.job === 'Director'),
  });
}

export function movieReviewsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', tmdbId, 'reviews'] as const,
    queryFn: () => fetchMovieReviews(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function personMovieCreditsQueryOptions(personId: number) {
  return queryOptions({
    queryKey: ['person', personId, 'movie-credits'] as const,
    queryFn: () => fetchPersonMovieCredits(personId),
    staleTime: 10 * 60 * 1000,
  });
}
