import { createRadarrClient } from '@/api/clients/radarr';
import { MovieItem } from '@/api/entities';
import { MediaStatus, SortDirection, SortField } from '@/api/types';
import {
  filterByGenres,
  filterByRating,
  filterBySearch,
  filterByStatus,
  filterByYearRange,
  mapToMovieItem,
  sortMovies,
} from '@/api/utils';

export type MovieItemsRequest = {
  status?: MediaStatus | 'all';
  search?: string;
  genres?: string[];
  yearMin?: number | null;
  yearMax?: number | null;
  ratingMin?: number | null;
  sortField?: SortField;
  sortDirection?: SortDirection;
};

export type MovieItemsResponse = {
  stats: {
    all: number;
    downloaded: number;
    downloading: number;
    wanted: number;
    missing: number;
  };
  movies: MovieItem[];
};

export async function fetchMovieItems(props: MovieItemsRequest): Promise<MovieItemsResponse> {
  const client = createRadarrClient();
  const { data, error } = await client.GET('/api/v3/movie');

  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Unknown error';
    throw new Error(`Failed to fetch movies from Radarr: ${errorMessage}`);
  }

  const movies = data.map(mapToMovieItem);
  return {
    stats: {
      all: movies.length,
      downloaded: movies.filter(filterByStatus('downloaded')).length,
      downloading: movies.filter(filterByStatus('downloading')).length,
      wanted: movies.filter(filterByStatus('wanted')).length,
      missing: movies.filter(filterByStatus('missing')).length,
    },
    movies: movies
      .filter(filterByStatus(props.status ?? 'all'))
      .filter(filterBySearch(props.search ?? ''))
      .filter(filterByGenres(props.genres ?? []))
      .filter(filterByRating(props.ratingMin ?? null))
      .filter(filterByYearRange(props.yearMin ?? null, props.yearMax ?? null))
      .sort(sortMovies(props.sortField ?? 'title', props.sortDirection ?? 'asc')),
  };
}
