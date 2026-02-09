import { createTMDBClient } from '@/api/clients/tmdb';
import type {
  ContentRating,
  MediaCredits,
  MediaImages,
  MediaKeywords,
  MediaVideos,
  MovieDetail,
  MovieRecommendation,
} from '@/api/entities';
import {
  tmdbToMovieContentRatings,
  tmdbToMovieCredits,
  tmdbToMovieDetail,
  tmdbToMovieImages,
  tmdbToMovieKeywords,
  tmdbToMovieRecommendations,
  tmdbToMovieVideos,
  tmdbToSimilarMovies,
} from '@/api/mappers';

// ============================================================================
// Functions
// ============================================================================

export async function fetchMovieDetail(tmdbId: number): Promise<MovieDetail> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie from TMDB');
  return tmdbToMovieDetail(data);
}

export async function fetchMovieCredits(tmdbId: number): Promise<MediaCredits> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/credits', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie credits from TMDB');
  return tmdbToMovieCredits(data);
}

export async function fetchMovieImages(tmdbId: number): Promise<MediaImages> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/images', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie images from TMDB');
  return tmdbToMovieImages(data);
}

export async function fetchMovieVideos(tmdbId: number): Promise<MediaVideos> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/videos', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie videos from TMDB');
  return tmdbToMovieVideos(data);
}

export async function fetchMovieKeywords(tmdbId: number): Promise<MediaKeywords> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/keywords', {
    params: { path: { movie_id: String(tmdbId) } },
  });
  if (error || !data) throw new Error('Failed to fetch movie keywords from TMDB');
  return tmdbToMovieKeywords(data);
}

export async function fetchMovieRecommendations(tmdbId: number): Promise<MovieRecommendation[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/recommendations', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie recommendations from TMDB');
  return tmdbToMovieRecommendations(data);
}

export async function fetchSimilarMovies(tmdbId: number): Promise<MovieRecommendation[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/similar', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch similar movies from TMDB');
  return tmdbToSimilarMovies(data);
}

export async function fetchMovieContentRating(tmdbId: number): Promise<ContentRating[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/release_dates', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie release dates from TMDB');
  return tmdbToMovieContentRatings(data);
}
