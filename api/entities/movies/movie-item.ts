import type { Genre, MediaStatus } from '@/api/types';

export interface MovieItem {
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
  // Library-only (present when sourced from Radarr)
  status?: MediaStatus;
  dateAdded?: string;
}
