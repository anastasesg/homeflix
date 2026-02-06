import {
  createTMDBClient,
  type DiscoverMovieParams,
  getTMDBImageUrl,
  type TMDBMovieListItem,
} from '@/api/clients/tmdb';
import type { DiscoverMovie } from '@/api/entities';

// ============================================================================
// Types
// ============================================================================

export type DiscoverMovieFilters = Omit<DiscoverMovieParams, 'page'>;

export interface DiscoverMoviePage {
  movies: DiscoverMovie[];
  totalPages: number;
  totalResults: number;
}

// ============================================================================
// Mappers
// ============================================================================

function mapToDiscoverMovie(item: TMDBMovieListItem): DiscoverMovie {
  return {
    id: item.id,
    title: item.title,
    overview: item.overview,
    year: item.release_date ? parseInt(item.release_date.substring(0, 4), 10) : 0,
    rating: item.vote_average,
    voteCount: item.vote_count,
    popularity: item.popularity,
    posterUrl: getTMDBImageUrl(item.poster_path, 'original'),
    backdropUrl: getTMDBImageUrl(item.backdrop_path, 'original'),
    genreIds: item.genre_ids,
  };
}

// ============================================================================
// Functions
// ============================================================================

export async function fetchTrendingMovies(): Promise<DiscoverMovie[]> {
  const client = createTMDBClient();
  const res = await client.getTrending();
  return res.results.map(mapToDiscoverMovie);
}

export async function fetchTopRatedMovies(): Promise<DiscoverMovie[]> {
  const client = createTMDBClient();
  const res = await client.getTopRated();
  return res.results.map(mapToDiscoverMovie);
}

export async function fetchNowPlayingMovies(): Promise<DiscoverMovie[]> {
  const client = createTMDBClient();
  const res = await client.getNowPlaying();
  return res.results.map(mapToDiscoverMovie);
}

export async function fetchUpcomingMovies(): Promise<DiscoverMovie[]> {
  const client = createTMDBClient();
  const res = await client.getUpcoming();
  return res.results.map(mapToDiscoverMovie);
}

export async function fetchHiddenGemMovies(): Promise<DiscoverMovie[]> {
  const client = createTMDBClient();
  const res = await client.discoverMovies({
    ratingMin: 7.5,
    voteCountMin: 50,
    sortBy: 'vote_average.desc',
  });
  // Filter to movies with modest vote counts (hidden, not blockbusters)
  return res.results.filter((m) => m.vote_count < 1000).map(mapToDiscoverMovie);
}

export async function fetchMoviesByGenre(genreId: number): Promise<DiscoverMovie[]> {
  const client = createTMDBClient();
  const res = await client.discoverByGenre(genreId);
  return res.results.map(mapToDiscoverMovie);
}

export async function fetchFilteredMovies(filters: DiscoverMovieFilters): Promise<DiscoverMoviePage> {
  const client = createTMDBClient();
  const res = await client.discoverMovies(filters);
  return {
    movies: res.results.map(mapToDiscoverMovie),
    totalPages: res.total_pages,
    totalResults: res.total_results,
  };
}

export async function searchMovies(query: string, page?: number): Promise<DiscoverMoviePage> {
  const client = createTMDBClient();
  const res = await client.searchMovies(query, page);
  return {
    movies: res.results.map(mapToDiscoverMovie),
    totalPages: res.total_pages,
    totalResults: res.total_results,
  };
}

export async function fetchFilteredMoviesInfinite(
  filters: DiscoverMovieFilters,
  page: number
): Promise<DiscoverMoviePage> {
  const client = createTMDBClient();
  const res = await client.discoverMovies({ ...filters, page });
  return {
    movies: res.results.map(mapToDiscoverMovie),
    totalPages: res.total_pages,
    totalResults: res.total_results,
  };
}

export async function searchMoviesInfinite(query: string, page: number): Promise<DiscoverMoviePage> {
  const client = createTMDBClient();
  const res = await client.searchMovies(query, page);
  return {
    movies: res.results.map(mapToDiscoverMovie),
    totalPages: res.total_pages,
    totalResults: res.total_results,
  };
}
