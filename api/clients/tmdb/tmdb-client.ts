import createClient, { type Middleware } from 'openapi-fetch';

import type { operations, paths } from './tmdb-client.d';

// ============================================================================
// Client
// ============================================================================

export function createTMDBClient() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) throw new Error('TMDB API Key is not defined');

  const authMiddleware: Middleware = {
    async onRequest({ request }) {
      const url = new URL(request.url);
      url.searchParams.set('api_key', apiKey);
      return new Request(url, request);
    },
  };

  const client = createClient<paths>({ baseUrl: 'https://api.themoviedb.org' });
  client.use(authMiddleware);

  return client;
}

// ============================================================================
// Image Utility
// ============================================================================

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function getTMDBImageUrl(
  path: string | null | undefined,
  size: 'w92' | 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'
): string | undefined {
  if (!path) return undefined;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// ============================================================================
// Response Type Helpers
// ============================================================================

type OpResponse<K extends keyof operations> = operations[K] extends {
  responses: { 200: { content: { 'application/json': infer R } } };
}
  ? R
  : never;

export type TMDBMovie = OpResponse<'movie-details'>;
export type TMDBCredits = OpResponse<'movie-credits'>;
export type TMDBImages = OpResponse<'movie-images'>;
export type TMDBVideos = OpResponse<'movie-videos'>;
export type TMDBKeywords = OpResponse<'movie-keywords'>;
export type TMDBReleaseDatesResponse = OpResponse<'movie-release-dates'>;
export type TMDBMovieListResponse = OpResponse<'discover-movie'>;
export type TMDBMovieListItem = NonNullable<TMDBMovieListResponse['results']>[number];

export type TMDBTV = OpResponse<'tv-series-details'>;
export type TMDBTVAggregateCredits = OpResponse<'tv-series-aggregate-credits'>;
export type TMDBTVImages = OpResponse<'tv-series-images'>;
export type TMDBTVVideos = OpResponse<'tv-series-videos'>;
export type TMDBTVKeywords = OpResponse<'tv-series-keywords'>;
export type TMDBTVListResponse = OpResponse<'discover-tv'>;
export type TMDBTVListItem = NonNullable<TMDBTVListResponse['results']>[number];
export type TMDBTVSeason = OpResponse<'tv-season-details'>;
export type TMDBTVEpisode = OpResponse<'tv-episode-details'>;
export type TMDBTVContentRatings = OpResponse<'tv-series-content-ratings'>;
export type TMDBTVEpisodeImages = OpResponse<'tv-episode-images'>;
export type TMDBTVRecommendations = OpResponse<'tv-series-recommendations'>;

export type TMDBGenreListResponse = OpResponse<'genre-movie-list'>;
export type TMDBWatchProvidersResponse = OpResponse<'watch-providers-movie-list'>;
export type TMDBCertificationsResponse = OpResponse<'certification-movie-list'>;
export type TMDBKeywordSearchResponse = OpResponse<'search-keyword'>;
export type TMDBPersonSearchResponse = OpResponse<'search-person'>;
export type TMDBMovieSearchResponse = OpResponse<'search-movie'>;
export type TMDBTVSearchResponse = OpResponse<'search-tv'>;
export type TMDBDiscoverMovieResponse = OpResponse<'discover-movie'>;
export type TMDBDiscoverTVResponse = OpResponse<'discover-tv'>;

// ============================================================================
// Discover Param Types (app-level abstractions)
// ============================================================================

export interface DiscoverMovieParams {
  genres?: number[];
  yearMin?: number;
  yearMax?: number;
  ratingMin?: number;
  runtimeMin?: number;
  runtimeMax?: number;
  language?: string;
  voteCountMin?: number;
  certifications?: string[];
  certificationCountry?: string;
  watchProviders?: number[];
  watchRegion?: string;
  keywords?: number[];
  castIds?: number[];
  crewIds?: number[];
  sortBy?: string;
  page?: number;
}

export interface DiscoverTVParams {
  genres?: number[];
  yearMin?: number;
  yearMax?: number;
  ratingMin?: number;
  runtimeMin?: number;
  runtimeMax?: number;
  language?: string;
  voteCountMin?: number;
  networks?: number[];
  status?: string[];
  watchProviders?: number[];
  watchRegion?: string;
  keywords?: number[];
  sortBy?: string;
  page?: number;
}

// ============================================================================
// Discover Query Builders
// ============================================================================

export function buildDiscoverMovieQuery(params: DiscoverMovieParams) {
  return {
    with_genres: params.genres?.length ? params.genres.join(',') : undefined,
    'primary_release_date.gte': params.yearMin ? `${params.yearMin}-01-01` : undefined,
    'primary_release_date.lte': params.yearMax ? `${params.yearMax}-12-31` : undefined,
    'vote_average.gte': params.ratingMin,
    'with_runtime.gte': params.runtimeMin,
    'with_runtime.lte': params.runtimeMax,
    with_original_language: params.language,
    certification: params.certifications?.length ? params.certifications.join('|') : undefined,
    certification_country: params.certifications?.length ? (params.certificationCountry ?? 'US') : undefined,
    with_watch_providers: params.watchProviders?.length ? params.watchProviders.join('|') : undefined,
    watch_region: params.watchProviders?.length ? (params.watchRegion ?? 'US') : undefined,
    with_keywords: params.keywords?.length ? params.keywords.join(',') : undefined,
    with_cast: params.castIds?.length ? params.castIds.join(',') : undefined,
    with_crew: params.crewIds?.length ? params.crewIds.join(',') : undefined,
    sort_by: (params.sortBy ?? 'popularity.desc') as 'popularity.desc',
    'vote_count.gte': params.voteCountMin ?? 50,
    page: params.page,
  };
}

export function buildDiscoverTVQuery(params: DiscoverTVParams) {
  return {
    with_genres: params.genres?.length ? params.genres.join(',') : undefined,
    'first_air_date.gte': params.yearMin ? `${params.yearMin}-01-01` : undefined,
    'first_air_date.lte': params.yearMax ? `${params.yearMax}-12-31` : undefined,
    'vote_average.gte': params.ratingMin,
    'with_runtime.gte': params.runtimeMin,
    'with_runtime.lte': params.runtimeMax,
    with_original_language: params.language,
    with_networks: params.networks?.length ? (params.networks[0] as number) : undefined,
    with_status: params.status?.length ? params.status.join('|') : undefined,
    with_watch_providers: params.watchProviders?.length ? params.watchProviders.join('|') : undefined,
    watch_region: params.watchProviders?.length ? (params.watchRegion ?? 'US') : undefined,
    with_keywords: params.keywords?.length ? params.keywords.join(',') : undefined,
    sort_by: (params.sortBy ?? 'popularity.desc') as 'popularity.desc',
    'vote_count.gte': params.voteCountMin ?? 50,
    page: params.page,
  };
}
