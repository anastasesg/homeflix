import { createTMDBClient, type TMDBTVSeason } from '@/api/clients/tmdb';
import type {
  ContentRating,
  EpisodeBasic,
  EpisodeImages,
  MediaCredits,
  MediaImages,
  MediaKeywords,
  MediaReview,
  MediaVideos,
  SeasonDetail,
  ShowDetail,
  ShowRecommendation,
} from '@/api/entities';
import {
  tmdbToEpisode,
  tmdbToSeasonDetail,
  tmdbToShowContentRatings,
  tmdbToShowCredits,
  tmdbToShowDetail,
  tmdbToShowImages,
  tmdbToShowKeywords,
  tmdbToShowRecommendations,
  tmdbToShowReviews,
  tmdbToShowVideos,
  tmdbToSimilarShows,
} from '@/api/mappers';

// ============================================================================
// Functions
// ============================================================================

export async function fetchShowDetail(tmdbId: number): Promise<ShowDetail> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}', {
    params: { path: { series_id: tmdbId }, query: { append_to_response: 'external_ids' } },
  });
  if (error || !data) throw new Error('Failed to fetch show from TMDB');
  return tmdbToShowDetail(data);
}

export async function fetchShowCredits(tmdbId: number): Promise<MediaCredits> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/aggregate_credits', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show credits from TMDB');
  return tmdbToShowCredits(data);
}

export async function fetchShowImages(tmdbId: number): Promise<MediaImages> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/images', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show images from TMDB');
  return tmdbToShowImages(data);
}

export async function fetchShowVideos(tmdbId: number): Promise<MediaVideos> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/videos', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show videos from TMDB');
  return tmdbToShowVideos(data);
}

export async function fetchShowKeywords(tmdbId: number): Promise<MediaKeywords> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/keywords', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show keywords from TMDB');
  return tmdbToShowKeywords(data);
}

export async function fetchShowSeason(tmdbId: number, seasonNumber: number): Promise<SeasonDetail> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/season/{season_number}', {
    params: { path: { series_id: tmdbId, season_number: seasonNumber } },
  });
  if (error || !data) throw new Error('Failed to fetch show season from TMDB');
  return tmdbToSeasonDetail(data);
}

export async function fetchShowEpisode(
  tmdbId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<EpisodeBasic> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/season/{season_number}/episode/{episode_number}', {
    params: { path: { series_id: tmdbId, season_number: seasonNumber, episode_number: episodeNumber } },
  });
  if (error || !data) throw new Error('Failed to fetch show episode from TMDB');
  return tmdbToEpisode(data as NonNullable<TMDBTVSeason['episodes']>[number]);
}

export async function fetchShowEpisodeImages(
  tmdbId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<EpisodeImages> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/season/{season_number}/episode/{episode_number}/images', {
    params: { path: { series_id: tmdbId, season_number: seasonNumber, episode_number: episodeNumber } },
  });
  if (error || !data) throw new Error('Failed to fetch episode images from TMDB');
  return {
    stills: (data.stills ?? []).slice(0, 12).map((s) => `https://image.tmdb.org/t/p/w780${s.file_path}`),
  };
}

export async function fetchShowRecommendations(tmdbId: number): Promise<ShowRecommendation[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/recommendations', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show recommendations from TMDB');
  return tmdbToShowRecommendations(data);
}

export async function fetchSimilarShows(tmdbId: number): Promise<ShowRecommendation[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/similar', {
    params: { path: { series_id: String(tmdbId) } },
  });
  if (error || !data) throw new Error('Failed to fetch similar shows from TMDB');
  return tmdbToSimilarShows(data);
}

export async function fetchShowContentRatings(tmdbId: number): Promise<ContentRating[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/content_ratings', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show content ratings from TMDB');
  return tmdbToShowContentRatings(data);
}

export async function fetchShowReviews(tmdbId: number): Promise<MediaReview[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/reviews', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show reviews from TMDB');
  return tmdbToShowReviews(data);
}
