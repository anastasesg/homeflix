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
  };
}
