import { getTMDBImageUrl } from '@/api/clients/tmdb';
import type { MovieRecommendation } from '@/api/entities/shared/media-recommendation';

interface TMDBRecommendationsResponse {
  results?: Array<{
    id?: number;
    title?: string;
    poster_path?: string;
    vote_average?: number;
    release_date?: string;
    overview?: string;
  }>;
}

export function tmdbToMovieRecommendations(data: unknown): MovieRecommendation[] {
  const results = (data as TMDBRecommendationsResponse).results ?? [];
  return results.slice(0, 20).map((item) => ({
    mediaType: 'movie' as const,
    id: item.id ?? 0,
    title: item.title ?? '',
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    rating: item.vote_average ?? 0,
    year: item.release_date ? parseInt(item.release_date.substring(0, 4), 10) : 0,
    overview: item.overview || undefined,
  }));
}

export function tmdbToSimilarMovies(data: unknown): MovieRecommendation[] {
  const results = (data as TMDBRecommendationsResponse).results ?? [];
  return results.slice(0, 20).map((item) => ({
    mediaType: 'movie' as const,
    id: item.id ?? 0,
    title: item.title ?? '',
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    rating: item.vote_average ?? 0,
    year: item.release_date ? parseInt(item.release_date.substring(0, 4), 10) : 0,
    overview: item.overview || undefined,
  }));
}
