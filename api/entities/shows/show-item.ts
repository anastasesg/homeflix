import type { Genre } from '@/api/mappers';

export type ShowStatus = 'continuing' | 'ended' | 'upcoming';
export type DisplayStatus = 'complete' | 'partial' | 'downloading' | 'missing' | 'wanted';

export interface ShowItem {
  tmdbId: number;
  title: string;
  overview: string;
  year: number;
  rating: number;
  voteCount: number;
  popularity: number;
  posterUrl?: string;
  backdropUrl?: string;
  genres: Genre[];
  originCountry: string[];
  // Library-only (present when sourced from Sonarr)
  status?: DisplayStatus;
  showStatus?: ShowStatus;
  totalEpisodes?: number;
  downloadedEpisodes?: number;
  seasonCount?: number;
  network?: string;
  dateAdded?: string;
}
