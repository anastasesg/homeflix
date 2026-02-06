import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import {
  createTMDBClient,
  type DiscoverMovieParams,
  getTMDBImageUrl,
  type TMDBMovieListItem,
} from '@/api/clients/tmdb';
import type {
  CertificationItem,
  DiscoverMovie,
  KeywordItem,
  PersonItem,
  TMDBGenreItem,
  WatchProviderItem,
} from '@/api/entities';

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
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    backdropUrl: getTMDBImageUrl(item.backdrop_path, 'w780'),
    genreIds: item.genre_ids,
  };
}

// ============================================================================
// Query Options
// ============================================================================

export function tmdbTrendingQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'trending'] as const,
    queryFn: async (): Promise<DiscoverMovie[]> => {
      const client = createTMDBClient();
      const res = await client.getTrending();
      return res.results.map(mapToDiscoverMovie);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbTopRatedQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'top-rated'] as const,
    queryFn: async (): Promise<DiscoverMovie[]> => {
      const client = createTMDBClient();
      const res = await client.getTopRated();
      return res.results.map(mapToDiscoverMovie);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbNowPlayingQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'now-playing'] as const,
    queryFn: async (): Promise<DiscoverMovie[]> => {
      const client = createTMDBClient();
      const res = await client.getNowPlaying();
      return res.results.map(mapToDiscoverMovie);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbUpcomingQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'upcoming'] as const,
    queryFn: async (): Promise<DiscoverMovie[]> => {
      const client = createTMDBClient();
      const res = await client.getUpcoming();
      return res.results.map(mapToDiscoverMovie);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbHiddenGemsQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'hidden-gems'] as const,
    queryFn: async (): Promise<DiscoverMovie[]> => {
      const client = createTMDBClient();
      const res = await client.discoverMovies({
        ratingMin: 7.5,
        voteCountMin: 50,
        sortBy: 'vote_average.desc',
      });
      // Filter to movies with modest vote counts (hidden, not blockbusters)
      return res.results.filter((m) => m.vote_count < 1000).map(mapToDiscoverMovie);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbGenresQueryOptions() {
  return queryOptions({
    queryKey: ['tmdb', 'genres'] as const,
    queryFn: async (): Promise<TMDBGenreItem[]> => {
      const client = createTMDBClient();
      const res = await client.getGenres();
      return res.genres;
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function tmdbDiscoverByGenreQueryOptions(genreId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'discover', 'genre', genreId] as const,
    queryFn: async (): Promise<DiscoverMovie[]> => {
      const client = createTMDBClient();
      const res = await client.discoverByGenre(genreId);
      return res.results.map(mapToDiscoverMovie);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function tmdbWatchProvidersQueryOptions(region: string = 'US') {
  return queryOptions({
    queryKey: ['tmdb', 'watch-providers', region] as const,
    queryFn: async (): Promise<WatchProviderItem[]> => {
      const client = createTMDBClient();
      const res = await client.getWatchProviders(region);
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

export function tmdbCertificationsQueryOptions(country: string = 'US') {
  return queryOptions({
    queryKey: ['tmdb', 'certifications', country] as const,
    queryFn: async (): Promise<CertificationItem[]> => {
      const client = createTMDBClient();
      const res = await client.getCertifications();
      const certs = res.certifications[country] ?? [];
      return certs
        .filter((c) => c.certification !== '')
        .sort((a, b) => a.order - b.order)
        .map((c) => ({
          certification: c.certification,
          meaning: c.meaning,
          order: c.order,
        }));
    },
    staleTime: 60 * 60 * 1000,
  });
}

export function tmdbSearchKeywordsQueryOptions(query: string) {
  return queryOptions({
    queryKey: ['tmdb', 'keywords', 'search', query] as const,
    queryFn: async (): Promise<KeywordItem[]> => {
      const client = createTMDBClient();
      const res = await client.searchKeywords(query);
      return res.results.slice(0, 20).map((k) => ({
        id: k.id,
        name: k.name,
      }));
    },
    staleTime: 10 * 60 * 1000,
    enabled: query.length >= 2,
  });
}

export function tmdbSearchPeopleQueryOptions(query: string) {
  return queryOptions({
    queryKey: ['tmdb', 'people', 'search', query] as const,
    queryFn: async (): Promise<PersonItem[]> => {
      const client = createTMDBClient();
      const res = await client.searchPeople(query);
      return res.results
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20)
        .map((p) => ({
          id: p.id,
          name: p.name,
          department: p.known_for_department,
          profileUrl: getTMDBImageUrl(p.profile_path, 'w92'),
        }));
    },
    staleTime: 10 * 60 * 1000,
    enabled: query.length >= 2,
  });
}

export type DiscoverFilters = Omit<DiscoverMovieParams, 'page'>;

export function tmdbDiscoverFilteredQueryOptions(filters: DiscoverFilters) {
  return queryOptions({
    queryKey: ['tmdb', 'discover', 'filtered', filters] as const,
    queryFn: async (): Promise<{ movies: DiscoverMovie[]; totalPages: number; totalResults: number }> => {
      const client = createTMDBClient();
      const res = await client.discoverMovies(filters);
      return {
        movies: res.results.map(mapToDiscoverMovie),
        totalPages: res.total_pages,
        totalResults: res.total_results,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function tmdbSearchQueryOptions(query: string, page?: number) {
  return queryOptions({
    queryKey: ['tmdb', 'search', query, page] as const,
    queryFn: async (): Promise<{ movies: DiscoverMovie[]; totalPages: number; totalResults: number }> => {
      const client = createTMDBClient();
      const res = await client.searchMovies(query, page);
      return {
        movies: res.results.map(mapToDiscoverMovie),
        totalPages: res.total_pages,
        totalResults: res.total_results,
      };
    },
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0,
  });
}

// ============================================================================
// Infinite Query Options
// ============================================================================

export interface DiscoverPage {
  movies: DiscoverMovie[];
  totalPages: number;
  totalResults: number;
}

export function tmdbSearchInfiniteQueryOptions(query: string) {
  return infiniteQueryOptions({
    queryKey: ['tmdb', 'search', 'infinite', query] as const,
    queryFn: async ({ pageParam }): Promise<DiscoverPage> => {
      const client = createTMDBClient();
      const res = await client.searchMovies(query, pageParam);
      return {
        movies: res.results.map(mapToDiscoverMovie),
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

export function tmdbDiscoverInfiniteQueryOptions(filters: DiscoverFilters) {
  return infiniteQueryOptions({
    queryKey: ['tmdb', 'discover', 'infinite', filters] as const,
    queryFn: async ({ pageParam }): Promise<DiscoverPage> => {
      const client = createTMDBClient();
      const res = await client.discoverMovies({ ...filters, page: pageParam });
      return {
        movies: res.results.map(mapToDiscoverMovie),
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
