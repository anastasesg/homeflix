export interface MovieDetail {
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
