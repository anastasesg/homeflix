export type ShowStatus = 'continuing' | 'ended' | 'upcoming';
export type DisplayStatus = 'complete' | 'partial' | 'downloading' | 'missing' | 'wanted';

export interface ShowItem {
  id: string | number;
  title: string;
  year?: number;
  endYear?: number;
  type: 'show';
  status: DisplayStatus;
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
