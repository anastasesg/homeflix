// TMDB API types - manually defined for key endpoints
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  tagline: string;
  release_date: string;
  runtime: number;
  budget: number;
  revenue: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path: string | null; origin_country: string }>;
  spoken_languages: Array<{ iso_639_1: string; name: string; english_name: string }>;
  status: string;
  imdb_id: string | null;
  homepage: string | null;
}

export interface TMDBCredits {
  id: number;
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }>;
}

export interface TMDBImages {
  id: number;
  backdrops: Array<{ file_path: string; width: number; height: number }>;
  posters: Array<{ file_path: string; width: number; height: number }>;
}

export interface TMDBVideos {
  id: number;
  results: Array<{
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
  }>;
}

export interface TMDBKeywords {
  id: number;
  keywords: Array<{ id: number; name: string }>;
}

export interface TMDBMovieListItem {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
}

export interface TMDBMovieListResponse {
  page: number;
  results: TMDBMovieListItem[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenreListResponse {
  genres: TMDBGenre[];
}

export interface TMDBWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface TMDBWatchProvidersResponse {
  results: TMDBWatchProvider[];
}

export interface TMDBCertification {
  certification: string;
  meaning: string;
  order: number;
}

export interface TMDBCertificationsResponse {
  certifications: Record<string, TMDBCertification[]>;
}

export interface TMDBKeywordSearchItem {
  id: number;
  name: string;
}

export interface TMDBKeywordSearchResponse {
  page: number;
  results: TMDBKeywordSearchItem[];
  total_pages: number;
  total_results: number;
}

export interface TMDBPersonSearchItem {
  id: number;
  name: string;
  known_for_department: string;
  profile_path: string | null;
  popularity: number;
}

export interface TMDBPersonSearchResponse {
  page: number;
  results: TMDBPersonSearchItem[];
  total_pages: number;
  total_results: number;
}

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

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function getTMDBImageUrl(
  path: string | null,
  size: 'w92' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | undefined {
  if (!path) return undefined;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function createTMDBClient() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) throw new Error('TMDB API Key is not defined');

  const baseUrl = 'https://api.themoviedb.org/3';

  return {
    async getMovie(movieId: number): Promise<TMDBMovie> {
      const res = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getCredits(movieId: number): Promise<TMDBCredits> {
      const res = await fetch(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getImages(movieId: number): Promise<TMDBImages> {
      const res = await fetch(`${baseUrl}/movie/${movieId}/images?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getVideos(movieId: number): Promise<TMDBVideos> {
      const res = await fetch(`${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getKeywords(movieId: number): Promise<TMDBKeywords> {
      const res = await fetch(`${baseUrl}/movie/${movieId}/keywords?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getTrending(): Promise<TMDBMovieListResponse> {
      const res = await fetch(`${baseUrl}/trending/movie/week?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getTopRated(): Promise<TMDBMovieListResponse> {
      const res = await fetch(`${baseUrl}/movie/top_rated?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getNowPlaying(): Promise<TMDBMovieListResponse> {
      const res = await fetch(`${baseUrl}/movie/now_playing?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getUpcoming(): Promise<TMDBMovieListResponse> {
      const res = await fetch(`${baseUrl}/movie/upcoming?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getGenres(): Promise<TMDBGenreListResponse> {
      const res = await fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async discoverByGenre(genreId: number): Promise<TMDBMovieListResponse> {
      const res = await fetch(
        `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=50`
      );
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async discoverMovies(params: DiscoverMovieParams): Promise<TMDBMovieListResponse> {
      const searchParams = new URLSearchParams({ api_key: apiKey });
      if (params.genres?.length) searchParams.set('with_genres', params.genres.join(','));
      if (params.yearMin) searchParams.set('primary_release_date.gte', `${params.yearMin}-01-01`);
      if (params.yearMax) searchParams.set('primary_release_date.lte', `${params.yearMax}-12-31`);
      if (params.ratingMin) searchParams.set('vote_average.gte', String(params.ratingMin));
      if (params.runtimeMin) searchParams.set('with_runtime.gte', String(params.runtimeMin));
      if (params.runtimeMax) searchParams.set('with_runtime.lte', String(params.runtimeMax));
      if (params.language) searchParams.set('with_original_language', params.language);
      if (params.certifications?.length) {
        searchParams.set('certification', params.certifications.join('|'));
        searchParams.set('certification_country', params.certificationCountry ?? 'US');
      }
      if (params.watchProviders?.length) {
        searchParams.set('with_watch_providers', params.watchProviders.join('|'));
        searchParams.set('watch_region', params.watchRegion ?? 'US');
      }
      if (params.keywords?.length) searchParams.set('with_keywords', params.keywords.join(','));
      if (params.castIds?.length) searchParams.set('with_cast', params.castIds.join(','));
      if (params.crewIds?.length) searchParams.set('with_crew', params.crewIds.join(','));
      searchParams.set('sort_by', params.sortBy ?? 'popularity.desc');
      searchParams.set('vote_count.gte', String(params.voteCountMin ?? 50));
      if (params.page) searchParams.set('page', String(params.page));
      const res = await fetch(`${baseUrl}/discover/movie?${searchParams}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async searchMovies(query: string, page?: number): Promise<TMDBMovieListResponse> {
      const searchParams = new URLSearchParams({ api_key: apiKey, query });
      if (page) searchParams.set('page', String(page));
      const res = await fetch(`${baseUrl}/search/movie?${searchParams}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getWatchProviders(region: string = 'US'): Promise<TMDBWatchProvidersResponse> {
      const res = await fetch(`${baseUrl}/watch/providers/movie?api_key=${apiKey}&watch_region=${region}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async getCertifications(): Promise<TMDBCertificationsResponse> {
      const res = await fetch(`${baseUrl}/certification/movie/list?api_key=${apiKey}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async searchKeywords(query: string): Promise<TMDBKeywordSearchResponse> {
      const searchParams = new URLSearchParams({ api_key: apiKey, query });
      const res = await fetch(`${baseUrl}/search/keyword?${searchParams}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },

    async searchPeople(query: string): Promise<TMDBPersonSearchResponse> {
      const searchParams = new URLSearchParams({ api_key: apiKey, query });
      const res = await fetch(`${baseUrl}/search/person?${searchParams}`);
      if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
      return res.json();
    },
  };
}
