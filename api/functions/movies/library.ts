import { createRadarrClient } from '@/api/clients/radarr';
import type { MovieItemsRequest, MovieItemsResponse } from '@/api/dtos';
import type { MovieHistoryEvent, MovieItem, MovieLibraryInfo } from '@/api/entities';
import { radarrToMovieHistoryEvent, radarrToMovieItem, radarrToMovieLibraryInfo } from '@/api/mappers';
import {
  filterByGenres,
  filterByRating,
  filterBySearch,
  filterByStatus,
  filterByYearRange,
  sortMovies,
} from '@/api/utils';

// ============================================================================
// Functions
// ============================================================================

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

  const movies = data.map(radarrToMovieItem);
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

export async function fetchFeaturedMovie(): Promise<MovieItem[]> {
  const client = createRadarrClient();
  const { data, error } = await client.GET('/api/v3/movie');

  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Unknown error';
    throw new Error(`Failed to fetch movies from Radarr: ${errorMessage}`);
  }

  return data
    .map(radarrToMovieItem)
    .filter(filterByStatus('downloaded'))
    .sort(sortMovies('rating', 'desc'))
    .slice(0, 5);
}

export async function fetchMovieLibraryInfo(tmdbId: number): Promise<MovieLibraryInfo> {
  try {
    const client = createRadarrClient();
    const { data, error } = await client.GET('/api/v3/movie', {
      params: { query: { tmdbId } },
    });

    if (error || !data || data.length === 0) {
      return {
        inLibrary: false,
        status: 'not_in_library',
        monitored: false,
        hasFile: false,
      };
    }

    const movie = data[0];
    return radarrToMovieLibraryInfo(movie);
  } catch {
    return {
      inLibrary: false,
      status: 'not_in_library',
      monitored: false,
      hasFile: false,
    };
  }
}

export async function fetchMovieHistory(radarrId: number): Promise<MovieHistoryEvent[]> {
  try {
    const client = createRadarrClient();
    const { data, error } = await client.GET('/api/v3/history/movie', {
      params: { query: { movieId: radarrId } },
    });

    if (error || !data) return [];

    return data.map(radarrToMovieHistoryEvent);
  } catch {
    return [];
  }
}
