export type MovieStatus = 'downloaded' | 'downloading' | 'missing' | 'wanted';

export interface MovieFile {
  id: number;
  path: string;
  size: string;
  quality: string;
  videoCodec: string;
  audioCodec: string;
  resolution: string;
}

export interface HistoryEvent {
  id: number;
  type: 'grabbed' | 'downloaded' | 'upgraded' | 'failed' | 'deleted';
  date: string;
  quality: string;
  indexer?: string;
  downloadClient?: string;
  reason?: string;
}

export interface CastMember {
  name: string;
  character: string;
  profileUrl?: string;
  order?: number;
}

export interface CrewMember {
  name: string;
  job: string;
  department: string;
  profileUrl?: string;
}

export interface ProductionCompany {
  name: string;
  logoUrl?: string;
}

export interface MovieMedia {
  backdrops: string[];
  posters: string[];
  trailerUrl?: string;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  runtime: number;
  rating: number;
  genres: string[];
  overview: string;
  status: MovieStatus;
  quality?: string;
  size?: string;
  addedAt: string;
  requestedBy?: string;
  monitored: boolean;
  posterUrl: string;
  backdropUrl?: string;
  qualityProfileId: number;
  files: MovieFile[];
  history: HistoryEvent[];
  cast: CastMember[];
  crew?: CrewMember[];
  tagline?: string;
  budget?: number;
  revenue?: number;
  originalLanguage?: string;
  productionCompanies?: ProductionCompany[];
  media?: MovieMedia;
  imdbId?: string;
  tmdbId?: number;
  certification?: string;
  keywords?: string[];
}

export interface QualityProfile {
  id: number;
  name: string;
}
