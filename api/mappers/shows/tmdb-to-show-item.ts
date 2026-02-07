import { getTMDBImageUrl, type TMDBTVListItem } from '@/api/clients/tmdb';
import type { ShowItem } from '@/api/entities';
import { mapGenreIds } from '@/api/mappers/genres';

export function tmbdToShowItem(item: TMDBTVListItem): ShowItem {
  return {
    tmdbId: item.id,
    title: item.name ?? 'N/A',
    overview: item.overview ?? 'N/A',
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4), 10) : 0,
    rating: item.vote_average,
    voteCount: item.vote_count,
    popularity: item.popularity,
    posterUrl: getTMDBImageUrl(item.poster_path, 'original'),
    backdropUrl: getTMDBImageUrl(item.backdrop_path, 'original'),
    genres: mapGenreIds(item.genre_ids || [], 'tv'),
    originCountry: item.origin_country || [],
  };
}
