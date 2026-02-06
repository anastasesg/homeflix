export interface DiscoverMovie {
  id: number;
  title: string;
  overview: string;
  year: number;
  rating: number;
  voteCount: number;
  popularity: number;
  posterUrl?: string;
  backdropUrl?: string;
  genreIds: number[];
}

export interface TMDBGenreItem {
  id: number;
  name: string;
}

export interface WatchProviderItem {
  id: number;
  name: string;
  logoUrl?: string;
}

export interface CertificationItem {
  certification: string;
  meaning: string;
  order: number;
}

export interface KeywordItem {
  id: number;
  name: string;
}

export interface PersonItem {
  id: number;
  name: string;
  department: string;
  profileUrl?: string;
}
