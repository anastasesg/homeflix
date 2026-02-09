import type { DiscoverMovieParams } from '@/api/clients/tmdb';
import type { MovieItem } from '@/api/entities';

// ============================================================================
// Types
// ============================================================================

export type DiscoverMovieFilters = Omit<DiscoverMovieParams, 'page'>;

export interface DiscoverMoviePage {
  movies: MovieItem[];
  totalPages: number;
  totalResults: number;
}
