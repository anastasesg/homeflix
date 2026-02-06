import { queryOptions } from '@tanstack/react-query';

import {
  fetchShowContentRatings,
  fetchShowCredits,
  fetchShowDetail,
  fetchShowEpisode,
  fetchShowEpisodeImages,
  fetchShowImages,
  fetchShowKeywords,
  fetchShowRecommendations,
  fetchShowSeason,
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

export function showEpisodeQueryOptions(tmdbId: number, seasonNumber: number, episodeNumber: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'season', seasonNumber, 'episode', episodeNumber] as const,
    queryFn: () => fetchShowEpisode(tmdbId, seasonNumber, episodeNumber),
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

export function showContentRatingsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'detail', tmdbId, 'content-ratings'] as const,
    queryFn: () => fetchShowContentRatings(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}
