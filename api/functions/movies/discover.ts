import { buildDiscoverMovieQuery, createTMDBClient } from '@/api/clients/tmdb';
import type { DiscoverMovieFilters, DiscoverMoviePage } from '@/api/dtos';
import type { MovieItem } from '@/api/entities';
import { tmbdToMovieItem } from '@/api/mappers';

// ============================================================================
// Functions
// ============================================================================

export async function fetchTrendingMovies(): Promise<MovieItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/trending/movie/{time_window}', {
    params: { path: { time_window: 'week' } },
  });
  if (error || !data) throw new Error('Failed to fetch trending movies from TMDB');
  return (data.results ?? []).map(tmbdToMovieItem);
}

export async function fetchTopRatedMovies(): Promise<MovieItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/top_rated');
  if (error || !data) throw new Error('Failed to fetch top rated movies from TMDB');
  return (data.results ?? []).map(tmbdToMovieItem);
}

export async function fetchNowPlayingMovies(): Promise<MovieItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/now_playing');
  if (error || !data) throw new Error('Failed to fetch now playing movies from TMDB');
  return (data.results ?? []).map(tmbdToMovieItem);
}

export async function fetchUpcomingMovies(): Promise<MovieItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/upcoming');
  if (error || !data) throw new Error('Failed to fetch upcoming movies from TMDB');
  return (data.results ?? []).map(tmbdToMovieItem);
}

export async function fetchHiddenGemMovies(): Promise<MovieItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/discover/movie', {
    params: {
      query: buildDiscoverMovieQuery({
        ratingMin: 7.5,
        voteCountMin: 50,
        sortBy: 'vote_average.desc',
      }),
    },
  });
  if (error || !data) throw new Error('Failed to fetch hidden gem movies from TMDB');
  return (data.results ?? []).filter((m) => (m.vote_count ?? 0) < 1000).map(tmbdToMovieItem);
}

export async function fetchMoviesByGenre(genreId: number): Promise<MovieItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/discover/movie', {
    params: {
      query: {
        with_genres: String(genreId),
        sort_by: 'popularity.desc',
        'vote_count.gte': 50,
      },
    },
  });
  if (error || !data) throw new Error('Failed to fetch movies by genre from TMDB');
  return (data.results ?? []).map(tmbdToMovieItem);
}

export async function fetchFilteredMovies(filters: DiscoverMovieFilters): Promise<DiscoverMoviePage> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/discover/movie', {
    params: { query: buildDiscoverMovieQuery(filters) },
  });
  if (error || !data) throw new Error('Failed to fetch filtered movies from TMDB');
  return {
    movies: (data.results ?? []).map(tmbdToMovieItem),
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
  };
}

export async function searchMovies(query: string, page?: number): Promise<DiscoverMoviePage> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/search/movie', {
    params: { query: { query, page } },
  });
  if (error || !data) throw new Error('Failed to search movies from TMDB');
  return {
    movies: (data.results ?? []).map(tmbdToMovieItem),
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
  };
}

export async function fetchFilteredMoviesInfinite(
  filters: DiscoverMovieFilters,
  page: number
): Promise<DiscoverMoviePage> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/discover/movie', {
    params: { query: buildDiscoverMovieQuery({ ...filters, page }) },
  });
  if (error || !data) throw new Error('Failed to fetch filtered movies from TMDB');
  return {
    movies: (data.results ?? []).map(tmbdToMovieItem),
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
  };
}

export async function searchMoviesInfinite(query: string, page: number): Promise<DiscoverMoviePage> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/search/movie', {
    params: { query: { query, page } },
  });
  if (error || !data) throw new Error('Failed to search movies from TMDB');
  return {
    movies: (data.results ?? []).map(tmbdToMovieItem),
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
  };
}
