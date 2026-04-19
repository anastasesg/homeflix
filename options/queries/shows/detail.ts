import { queryOptions } from '@tanstack/react-query';

import {
  fetchShowContentRatings,
  fetchShowCredits,
  fetchShowDetail,
  fetchShowEpisode,
  fetchShowEpisodeCredits,
  fetchShowEpisodeImages,
  fetchShowImages,
  fetchShowKeywords,
  fetchShowRecommendations,
  fetchShowReviews,
  fetchShowSeason,
  fetchShowSeasonCredits,
  fetchShowVideos,
  fetchSimilarShows,
} from '@/api/functions';

export function showDetailQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId] as const,
    queryFn: () => fetchShowDetail(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function showCreditsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'credits'] as const,
    queryFn: () => fetchShowCredits(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function showImagesQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'images'] as const,
    queryFn: () => fetchShowImages(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function showVideosQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'videos'] as const,
    queryFn: () => fetchShowVideos(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function showKeywordsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'keywords'] as const,
    queryFn: () => fetchShowKeywords(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function showSeasonQueryOptions(tmdbId: number, seasonNumber: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'season', seasonNumber] as const,
    queryFn: () => fetchShowSeason(tmdbId, seasonNumber),
    staleTime: 10 * 60 * 1000,
  });
}

export function showSeasonCreditsQueryOptions(tmdbId: number, seasonNumber: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'season', seasonNumber, 'credits'] as const,
    queryFn: () => fetchShowSeasonCredits(tmdbId, seasonNumber),
    staleTime: 10 * 60 * 1000,
  });
}

export function showEpisodeQueryOptions(tmdbId: number, seasonNumber: number, episodeNumber: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'season', seasonNumber, 'episode', episodeNumber] as const,
    queryFn: () => fetchShowEpisode(tmdbId, seasonNumber, episodeNumber),
    staleTime: 10 * 60 * 1000,
  });
}

export function showEpisodeCreditsQueryOptions(tmdbId: number, seasonNumber: number, episodeNumber: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'season', seasonNumber, 'episode', episodeNumber, 'credits'] as const,
    queryFn: () => fetchShowEpisodeCredits(tmdbId, seasonNumber, episodeNumber),
    staleTime: 10 * 60 * 1000,
  });
}

export function showEpisodeImagesQueryOptions(tmdbId: number, seasonNumber: number, episodeNumber: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'season', seasonNumber, 'episode', episodeNumber, 'images'] as const,
    queryFn: () => fetchShowEpisodeImages(tmdbId, seasonNumber, episodeNumber),
    staleTime: 10 * 60 * 1000,
  });
}

export function showRecommendationsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'recommendations'] as const,
    queryFn: () => fetchShowRecommendations(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

export function similarShowsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'similar'] as const,
    queryFn: () => fetchSimilarShows(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Select-based views into showDetailQueryOptions (shared cache, no extra fetch)
// ============================================================================

export function showOverviewQueryOptions(tmdbId: number) {
  return queryOptions({
    ...showDetailQueryOptions(tmdbId),
    select: (show) => show.overview,
  });
}

export function showProductionClusterQueryOptions(tmdbId: number) {
  return queryOptions({
    ...showDetailQueryOptions(tmdbId),
    select: (show) => ({
      createdBy: show.createdBy,
      networks: show.networks,
      productionCompanies: show.productionCompanies,
      genres: show.genres,
      languages: show.languages,
    }),
  });
}

export function showTitleQueryOptions(tmdbId: number) {
  return queryOptions({
    ...showDetailQueryOptions(tmdbId),
    select: (show) => show.name,
  });
}

export function showContentRatingsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'content-ratings'] as const,
    queryFn: () => fetchShowContentRatings(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Select-based views into showSeasonQueryOptions (shared cache, no extra fetch)
// ============================================================================

export function seasonOverviewQueryOptions(tmdbId: number, seasonNumber: number) {
  return queryOptions({
    ...showSeasonQueryOptions(tmdbId, seasonNumber),
    select: (season) => season.overview,
  });
}

export function showSeasonsQueryOptions(tmdbId: number) {
  return queryOptions({
    ...showDetailQueryOptions(tmdbId),
    select: (show) => show.seasons,
  });
}

export function showReviewsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'reviews'] as const,
    queryFn: () => fetchShowReviews(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}
