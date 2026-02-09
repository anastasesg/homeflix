import { createTMDBClient, getTMDBImageUrl } from '@/api/clients/tmdb';
import type {
  ContentRating,
  MediaCredits,
  MediaImages,
  MediaKeywords,
  MediaVideos,
  MovieDetail,
  MovieRecommendation,
  MovieReview,
} from '@/api/entities';
import {
  tmdbToMovieContentRatings,
  tmdbToMovieCredits,
  tmdbToMovieDetail,
  tmdbToMovieImages,
  tmdbToMovieKeywords,
  tmdbToMovieRecommendations,
  tmdbToMovieReviews,
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

export async function fetchMovieReviews(tmdbId: number): Promise<MovieReview[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/reviews', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie reviews from TMDB');
  return tmdbToMovieReviews(data);
}

export async function fetchPersonMovieCredits(personId: number): Promise<MovieRecommendation[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/person/{person_id}/movie_credits', {
    params: { path: { person_id: personId } },
  });
  if (error || !data) throw new Error('Failed to fetch person movie credits from TMDB');

  // Extract cast array and map to MovieRecommendation
  interface TMDBPersonMovieCreditsResponse {
    cast?: Array<{
      id?: number;
      title?: string;
      poster_path?: string;
      vote_average?: number;
      vote_count?: number;
      release_date?: string;
      overview?: string;
    }>;
  }

  const cast = (data as TMDBPersonMovieCreditsResponse).cast ?? [];

  // Sort by vote_count descending, then limit to 20
  return cast
    .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
    .slice(0, 20)
    .map((item) => ({
      mediaType: 'movie' as const,
      id: item.id ?? 0,
      title: item.title ?? '',
      posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
      rating: item.vote_average ?? 0,
      year: item.release_date ? parseInt(item.release_date.substring(0, 4), 10) : 0,
      overview: item.overview || undefined,
    }));
}
