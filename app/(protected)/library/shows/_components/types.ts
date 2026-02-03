export type ShowStatus = 'continuing' | 'ended' | 'upcoming';
export type EpisodeStatus = 'downloaded' | 'downloading' | 'missing' | 'wanted' | 'unaired';

export interface Episode {
  id: number;
  episodeNumber: number;
  title: string;
  airDate?: string;
  overview?: string;
  runtime?: number;
  status: EpisodeStatus;
  quality?: string;
  size?: string;
  stillUrl?: string;
}

export interface Season {
  id: number;
  seasonNumber: number;
  episodeCount: number;
  downloadedCount: number;
  posterUrl?: string;
  overview?: string;
  airDate?: string;
  episodes: Episode[];
}

export interface EpisodeFile {
  id: number;
  path: string;
  size: string;
  quality: string;
  videoCodec: string;
  audioCodec: string;
  resolution: string;
  seasonNumber: number;
  episodeNumber: number;
}

export interface HistoryEvent {
  id: number;
  type: 'grabbed' | 'downloaded' | 'upgraded' | 'failed' | 'deleted';
  date: string;
  quality: string;
  indexer?: string;
  downloadClient?: string;
  reason?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
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

export interface Network {
  name: string;
  logoUrl?: string;
}

export interface ShowMedia {
  backdrops: string[];
  posters: string[];
  trailerUrl?: string;
}

export interface Show {
  id: number;
  title: string;
  year: number;
  endYear?: number;
  runtime: number; // average episode runtime
  rating: number;
  genres: string[];
  overview: string;
  showStatus: ShowStatus;
  quality?: string;
  totalSize?: string;
  addedAt: string;
  requestedBy?: string;
  monitored: boolean;
  posterUrl: string;
  backdropUrl?: string;
  qualityProfileId: number;
  seasons: Season[];
  files: EpisodeFile[];
  history: HistoryEvent[];
  cast: CastMember[];
  crew?: CrewMember[];
  tagline?: string;
  originalLanguage?: string;
  network?: Network;
  media?: ShowMedia;
  imdbId?: string;
  tvdbId?: number;
  certification?: string;
  keywords?: string[];
  nextAiring?: {
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    airDate: string;
  };
}

export interface QualityProfile {
  id: number;
  name: string;
}

// For grid view - enriched show data
export interface EnrichedShow {
  id: string | number;
  title: string;
  year?: number;
  endYear?: number;
  showStatus: ShowStatus;
  posterUrl?: string;
  backdropUrl?: string;
  quality?: string;
  rating?: number;
  runtime?: number;
  genres?: string[];
  tagline?: string;
  overview?: string;
  network?: string;
  // Episode tracking
  totalEpisodes: number;
  downloadedEpisodes: number;
  seasonCount: number;
  // Next episode info
  nextEpisode?: {
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    airDate?: string;
  };
}

// Computed status for display
export type DisplayStatus = 'complete' | 'partial' | 'downloading' | 'missing' | 'wanted';
