import type { MovieItem } from '@/api/entities';
import type { MediaStatus, SortDirection, SortField } from '@/api/types';

// ============================================================================
// Types
// ============================================================================

export type MovieItemsRequest = {
  status?: MediaStatus | 'all';
  search?: string;
  genres?: string[];
  yearMin?: number | null;
  yearMax?: number | null;
  ratingMin?: number | null;
  sortField?: SortField;
  sortDirection?: SortDirection;
};

export type MovieItemsResponse = {
  stats: {
    all: number;
    downloaded: number;
    downloading: number;
    wanted: number;
    missing: number;
  };
  movies: MovieItem[];
};
