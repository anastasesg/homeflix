import { buildDiscoverTVQuery, createTMDBClient } from '@/api/clients/tmdb';
import type { DiscoverShowFilters, DiscoverShowPage } from '@/api/dtos';
import type { ShowItem } from '@/api/entities';
import { tmbdToShowItem } from '@/api/mappers';

// ============================================================================
// Functions
// ============================================================================

export async function fetchTrendingShows(): Promise<ShowItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/trending/tv/{time_window}', {
    params: { path: { time_window: 'week' } },
  });
  if (error || !data) throw new Error('Failed to fetch trending shows from TMDB');
  return (data.results ?? []).map(tmbdToShowItem);
}

export async function fetchTopRatedShows(): Promise<ShowItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/top_rated');
  if (error || !data) throw new Error('Failed to fetch top rated shows from TMDB');
  return (data.results ?? []).map(tmbdToShowItem);
}

export async function fetchOnTheAirShows(): Promise<ShowItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/on_the_air');
  if (error || !data) throw new Error('Failed to fetch on the air shows from TMDB');
  return (data.results ?? []).map(tmbdToShowItem);
}

export async function fetchAiringTodayShows(): Promise<ShowItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/airing_today');
  if (error || !data) throw new Error('Failed to fetch airing today shows from TMDB');
  return (data.results ?? []).map(tmbdToShowItem);
}

export async function fetchHiddenGemShows(): Promise<ShowItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/discover/tv', {
    params: {
      query: buildDiscoverTVQuery({
        ratingMin: 7.5,
        voteCountMin: 50,
        sortBy: 'vote_average.desc',
      }),
    },
  });
  if (error || !data) throw new Error('Failed to fetch hidden gem shows from TMDB');
  return (data.results ?? []).filter((s) => (s.vote_count ?? 0) < 1000).map(tmbdToShowItem);
}

export async function fetchShowsByGenre(genreId: number): Promise<ShowItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/discover/tv', {
    params: {
      query: {
        with_genres: String(genreId),
        sort_by: 'popularity.desc',
        'vote_count.gte': 50,
      },
    },
  });
  if (error || !data) throw new Error('Failed to fetch shows by genre from TMDB');
  return (data.results ?? []).map(tmbdToShowItem);
}

export async function fetchFilteredShows(filters: DiscoverShowFilters): Promise<DiscoverShowPage> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/discover/tv', {
    params: { query: buildDiscoverTVQuery(filters) },
  });
  if (error || !data) throw new Error('Failed to fetch filtered shows from TMDB');
  return {
    shows: (data.results ?? []).map(tmbdToShowItem),
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
  };
}

export async function searchShows(query: string, page?: number): Promise<DiscoverShowPage> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/search/tv', {
    params: { query: { query, page } },
  });
  if (error || !data) throw new Error('Failed to search shows from TMDB');
  return {
    shows: (data.results ?? []).map(tmbdToShowItem),
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
  };
}

export async function fetchFilteredShowsInfinite(
  filters: DiscoverShowFilters,
  page: number
): Promise<DiscoverShowPage> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/discover/tv', {
    params: { query: buildDiscoverTVQuery({ ...filters, page }) },
  });
  if (error || !data) throw new Error('Failed to fetch filtered shows from TMDB');
  return {
    shows: (data.results ?? []).map(tmbdToShowItem),
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
  };
}

export async function searchShowsInfinite(query: string, page: number): Promise<DiscoverShowPage> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/search/tv', {
    params: { query: { query, page } },
  });
  if (error || !data) throw new Error('Failed to search shows from TMDB');
  return {
    shows: (data.results ?? []).map(tmbdToShowItem),
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
  };
}
