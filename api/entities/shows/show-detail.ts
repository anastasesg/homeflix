export interface ShowDetail {
  id: number;
  name: string;
  originalName: string;
  overview: string;
  tagline?: string;
  firstAirDate: string;
  lastAirDate?: string;
  year: number;
  endYear?: number;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  runtime?: number;
  rating: number;
  voteCount: number;
  posterUrl?: string;
  backdropUrl?: string;
  genres: string[];
  networks: Array<{ name: string; logoUrl?: string }>;
  productionCompanies: Array<{ name: string; logoUrl?: string }>;
  createdBy: Array<{ name: string; profileUrl?: string }>;
  languages: string[];
  status: string;
  type: string;
  inProduction: boolean;
  imdbId?: string;
  tvdbId?: number;
  tmdbId: number;
  homepage?: string;
  seasons: Array<{
    id: number;
    name: string;
    overview: string;
    seasonNumber: number;
    episodeCount: number;
    airDate?: string;
    posterUrl?: string;
  }>;
}

export interface SeasonDetail {
  id: number;
  name: string;
  overview: string;
  seasonNumber: number;
  airDate?: string;
  posterUrl?: string;
  episodes: EpisodeBasic[];
}

export interface EpisodeImages {
  stills: string[];
}

export interface EpisodeBasic {
  id: number;
  name: string;
  overview: string;
  episodeNumber: number;
  seasonNumber: number;
  airDate?: string;
  runtime?: number;
  stillUrl?: string;
  rating: number;
  voteCount: number;
  crew: Array<{ name: string; job: string; department: string; profileUrl?: string }>;
  guestStars: Array<{ name: string; character: string; profileUrl?: string; order: number }>;
}

