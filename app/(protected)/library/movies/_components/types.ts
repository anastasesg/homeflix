export type MediaStatus = 'downloaded' | 'downloading' | 'missing' | 'wanted';
export type MediaType = 'movie' | 'show' | 'music' | 'book';

export interface EnrichedMovie {
  id: string | number;
  title: string;
  year?: number;
  type: MediaType;
  status: MediaStatus;
  posterUrl?: string;
  backdropUrl?: string;
  quality?: string;
  rating?: number;
  runtime?: number;
  genres?: string[];
  tagline?: string;
  overview?: string;
}
