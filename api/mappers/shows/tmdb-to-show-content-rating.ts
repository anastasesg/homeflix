import type { TMDBTVContentRatings } from '@/api/clients/tmdb';
import type { ContentRating } from '@/api/entities';

export function tmdbToShowContentRatings(data: TMDBTVContentRatings): ContentRating[] {
  return (data.results ?? []).map((r) => ({
    country: r.iso_3166_1 ?? '',
    rating: r.rating ?? '',
  }));
}
