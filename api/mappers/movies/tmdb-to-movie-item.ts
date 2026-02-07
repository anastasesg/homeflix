import { getTMDBImageUrl, type TMDBMovieListItem } from '@/api/clients/tmdb';
import type { MovieItem } from '@/api/entities';
import { mapGenreIds } from '@/api/mappers/genres';

export function tmbdToMovieItem(item: TMDBMovieListItem): MovieItem {
  return {
    tmdbId: item.id,
    title: item.title ?? 'N/A',
    overview: item.overview ?? 'N/A',
    year: item.release_date ? parseInt(item.release_date.substring(0, 4), 10) : 0,
    rating: item.vote_average,
    voteCount: item.vote_count,
    popularity: item.popularity,
    posterUrl: getTMDBImageUrl(item.poster_path, 'original'),
    backdropUrl: getTMDBImageUrl(item.backdrop_path, 'original'),
    genres: mapGenreIds(item.genre_ids || [], 'movie'),
  };
}
