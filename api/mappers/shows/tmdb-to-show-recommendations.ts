import { getTMDBImageUrl, type TMDBTVRecommendations } from '@/api/clients/tmdb';
import type { ShowRecommendation } from '@/api/entities';

export function tmdbToShowRecommendations(data: TMDBTVRecommendations): ShowRecommendation[] {
  return (data.results ?? []).slice(0, 20).map((item) => ({
    mediaType: 'show',
    id: item.id,
    title: item.name ?? '',
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    rating: item.vote_average,
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4), 10) : 0,
    overview: item.overview || undefined,
  }));
}

export function tmdbToSimilarShows(data: TMDBTVRecommendations): ShowRecommendation[] {
  return (data.results ?? []).slice(0, 20).map((item) => ({
    mediaType: 'show',
    id: item.id ?? 0,
    title: item.name ?? '',
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    rating: item.vote_average ?? 0,
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4), 10) : 0,
    overview: item.overview || undefined,
  }));
}
