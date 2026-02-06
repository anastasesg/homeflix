import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { createTMDBClient, type DiscoverTVParams, getTMDBImageUrl, type TMDBTVListItem } from '@/api/clients/tmdb';
import type { DiscoverShow, NetworkItem, TMDBGenreItem, WatchProviderItem } from '@/api/entities';

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
// Query Options
// ============================================================================

export function tmdbTVTrendingQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'tv', 'trending'] as const,
    queryFn: async (): Promise<DiscoverShow[]> => {
      const client = createTMDBClient();
      const res = await client.getTVTrending();
      return res.results.map(mapToDiscoverShow);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbTVTopRatedQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'tv', 'top-rated'] as const,
    queryFn: async (): Promise<DiscoverShow[]> => {
      const client = createTMDBClient();
      const res = await client.getTVTopRated();
      return res.results.map(mapToDiscoverShow);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbTVOnTheAirQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'tv', 'on-the-air'] as const,
    queryFn: async (): Promise<DiscoverShow[]> => {
      const client = createTMDBClient();
      const res = await client.getTVOnTheAir();
      return res.results.map(mapToDiscoverShow);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbTVAiringTodayQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'tv', 'airing-today'] as const,
    queryFn: async (): Promise<DiscoverShow[]> => {
      const client = createTMDBClient();
      const res = await client.getTVAiringToday();
      return res.results.map(mapToDiscoverShow);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbTVHiddenGemsQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'tv', 'hidden-gems'] as const,
    queryFn: async (): Promise<DiscoverShow[]> => {
      const client = createTMDBClient();
      const res = await client.discoverTV({
        ratingMin: 7.5,
        voteCountMin: 50,
        sortBy: 'vote_average.desc',
      });
      return res.results.filter((s) => s.vote_count < 1000).map(mapToDiscoverShow);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbTVGenresQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'tv', 'genres'] as const,
    queryFn: async (): Promise<TMDBGenreItem[]> => {
      const client = createTMDBClient();
      const res = await client.getTVGenres();
      return res.genres;
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function tmdbTVDiscoverByGenreQueryOptions(genreId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', 'discover', 'genre', genreId] as const,
    queryFn: async (): Promise<DiscoverShow[]> => {
      const client = createTMDBClient();
      const res = await client.discoverByTVGenre(genreId);
      return res.results.map(mapToDiscoverShow);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbTVWatchProvidersQueryOptions(region: string = 'US') {
  return queryOptions({
    queryKey: ['tmdb', 'tv', 'watch-providers', region] as const,
    queryFn: async (): Promise<WatchProviderItem[]> => {
      const client = createTMDBClient();
      const res = await client.getTVWatchProviders(region);
      return res.results
        .sort((a, b) => a.display_priority - b.display_priority)
        .slice(0, 30)
        .map((p) => ({
          id: p.provider_id,
          name: p.provider_name,
          logoUrl: getTMDBImageUrl(p.logo_path, 'w92'),
        }));
    },
    staleTime: 60 * 60 * 1000,
  });
}

export function tmdbTVNetworksQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'tv', 'networks'] as const,
    queryFn: async (): Promise<NetworkItem[]> => {
      // TMDB doesn't have a dedicated "list all networks" endpoint.
      // We use a curated list of major networks instead.
      const majorNetworks = [
        { id: 213, name: 'Netflix' },
        { id: 1024, name: 'Amazon' },
        { id: 2552, name: 'Apple TV+' },
        { id: 49, name: 'HBO' },
        { id: 2739, name: 'Disney+' },
        { id: 453, name: 'Hulu' },
        { id: 67, name: 'Showtime' },
        { id: 2697, name: 'Paramount+' },
        { id: 3353, name: 'Peacock' },
        { id: 174, name: 'AMC' },
        { id: 16, name: 'CBS' },
        { id: 6, name: 'NBC' },
        { id: 19, name: 'FOX' },
        { id: 318, name: 'Starz' },
        { id: 2, name: 'ABC' },
        { id: 71, name: 'The CW' },
        { id: 56, name: 'Cartoon Network' },
        { id: 13, name: 'Nickelodeon' },
        { id: 64, name: 'Discovery' },
        { id: 43, name: 'National Geographic' },
        { id: 4, name: 'BBC One' },
        { id: 332, name: 'BBC Two' },
        { id: 26, name: 'Channel 4' },
        { id: 493, name: 'BBC America' },
        { id: 1, name: 'Fuji TV' },
        { id: 614, name: 'Crunchyroll' },
      ];
      return majorNetworks.map((n) => ({ id: n.id, name: n.name }));
    },
    staleTime: 60 * 60 * 1000,
  });
}

// ============================================================================
// Infinite Query Options
// ============================================================================

export interface DiscoverTVPage {
  shows: DiscoverShow[];
  totalPages: number;
  totalResults: number;
}

export type DiscoverTVFilters = Omit<DiscoverTVParams, 'page'>;

export function tmdbTVSearchInfiniteQueryOptions(query: string) {
  return infiniteQueryOptions({
    queryKey: ['tmdb', 'tv', 'search', 'infinite', query] as const,
    queryFn: async ({ pageParam }): Promise<DiscoverTVPage> => {
      const client = createTMDBClient();
      const res = await client.searchTV(query, pageParam);
      return {
        shows: res.results.map(mapToDiscoverShow),
        totalPages: res.total_pages,
        totalResults: res.total_results,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0,
  });
}

export function tmdbTVDiscoverInfiniteQueryOptions(filters: DiscoverTVFilters) {
  return infiniteQueryOptions({
    queryKey: ['tmdb', 'tv', 'discover', 'infinite', filters] as const,
    queryFn: async ({ pageParam }): Promise<DiscoverTVPage> => {
      const client = createTMDBClient();
      const res = await client.discoverTV({ ...filters, page: pageParam });
      return {
        shows: res.results.map(mapToDiscoverShow),
        totalPages: res.total_pages,
        totalResults: res.total_results,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });
}
