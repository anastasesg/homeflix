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
