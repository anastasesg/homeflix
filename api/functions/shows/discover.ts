import { createTMDBClient, type DiscoverTVParams, getTMDBImageUrl, type TMDBTVListItem } from '@/api/clients/tmdb';
import type { DiscoverShow } from '@/api/entities';

// ============================================================================
// Types
// ============================================================================

export type DiscoverShowFilters = Omit<DiscoverTVParams, 'page'>;

export interface DiscoverShowPage {
  shows: DiscoverShow[];
  totalPages: number;
  totalResults: number;
}

// ============================================================================
// Mappers
// ============================================================================

function mapToDiscoverShow(item: TMDBTVListItem): DiscoverShow {
  return {
    id: item.id,
    name: item.name,
    title: item.name,
    overview: item.overview,
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4), 10) : 0,
    rating: item.vote_average,
    voteCount: item.vote_count,
    popularity: item.popularity,
    posterUrl: getTMDBImageUrl(item.poster_path, 'original'),
    backdropUrl: getTMDBImageUrl(item.backdrop_path, 'original'),
    genreIds: item.genre_ids,
    originCountry: item.origin_country,
  };
}

// ============================================================================
// Functions
// ============================================================================

export async function fetchTrendingShows(): Promise<DiscoverShow[]> {
  const client = createTMDBClient();
  const res = await client.getTVTrending();
  return res.results.map(mapToDiscoverShow);
}

export async function fetchTopRatedShows(): Promise<DiscoverShow[]> {
  const client = createTMDBClient();
  const res = await client.getTVTopRated();
  return res.results.map(mapToDiscoverShow);
}

export async function fetchOnTheAirShows(): Promise<DiscoverShow[]> {
  const client = createTMDBClient();
  const res = await client.getTVOnTheAir();
  return res.results.map(mapToDiscoverShow);
}

export async function fetchAiringTodayShows(): Promise<DiscoverShow[]> {
  const client = createTMDBClient();
  const res = await client.getTVAiringToday();
  return res.results.map(mapToDiscoverShow);
}

export async function fetchHiddenGemShows(): Promise<DiscoverShow[]> {
  const client = createTMDBClient();
  const res = await client.discoverTV({
    ratingMin: 7.5,
    voteCountMin: 50,
    sortBy: 'vote_average.desc',
  });
  return res.results.filter((s) => s.vote_count < 1000).map(mapToDiscoverShow);
}

export async function fetchShowsByGenre(genreId: number): Promise<DiscoverShow[]> {
  const client = createTMDBClient();
  const res = await client.discoverByTVGenre(genreId);
  return res.results.map(mapToDiscoverShow);
}

export async function fetchFilteredShows(filters: DiscoverShowFilters): Promise<DiscoverShowPage> {
  const client = createTMDBClient();
  const res = await client.discoverTV(filters);
  return {
    shows: res.results.map(mapToDiscoverShow),
    totalPages: res.total_pages,
    totalResults: res.total_results,
  };
}

export async function searchShows(query: string, page?: number): Promise<DiscoverShowPage> {
  const client = createTMDBClient();
  const res = await client.searchTV(query, page);
  return {
    shows: res.results.map(mapToDiscoverShow),
    totalPages: res.total_pages,
    totalResults: res.total_results,
  };
}

export async function fetchFilteredShowsInfinite(
  filters: DiscoverShowFilters,
  page: number
): Promise<DiscoverShowPage> {
  const client = createTMDBClient();
  const res = await client.discoverTV({ ...filters, page });
  return {
    shows: res.results.map(mapToDiscoverShow),
    totalPages: res.total_pages,
    totalResults: res.total_results,
  };
}

export async function searchShowsInfinite(query: string, page: number): Promise<DiscoverShowPage> {
  const client = createTMDBClient();
  const res = await client.searchTV(query, page);
  return {
    shows: res.results.map(mapToDiscoverShow),
    totalPages: res.total_pages,
    totalResults: res.total_results,
  };
}
