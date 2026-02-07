export interface MovieBasic {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  tagline?: string;
  releaseDate: string;
  year: number;
  runtime: number;
  budget?: number;
  revenue?: number;
  rating: number;
  voteCount: number;
  posterUrl?: string;
  backdropUrl?: string;
  genres: string[];
  productionCompanies: Array<{ name: string; logoUrl?: string }>;
  languages: string[];
  status: string;
  imdbId?: string;
  tmdbId: number;
  homepage?: string;
}

export interface MovieCredits {
  cast: Array<{ name: string; character: string; profileUrl?: string; order: number }>;
  crew: Array<{ name: string; job: string; department: string; profileUrl?: string }>;
}

export interface MovieImages {
  backdrops: string[];
  posters: string[];
}

export interface MovieVideos {
  trailerUrl?: string;
  videos: Array<{ id: string; name: string; type: string; url: string }>;
}

export interface MovieKeywords {
  keywords: string[];
}

export interface MovieRecommendation {
  id: number;
  title: string;
  posterUrl?: string;
  rating: number;
  year: number;
  overview?: string;
}

export interface MovieContentRating {
  country: string;
  rating: string;
}
