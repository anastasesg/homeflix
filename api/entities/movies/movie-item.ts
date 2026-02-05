import { MediaStatus } from '@/api/types';

export interface MovieItem {
  id: string | number;
  title: string;
  year?: number;
  type: 'movie';
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
