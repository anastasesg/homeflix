import type { DiscoverTVParams } from '@/api/clients/tmdb';
import type { ShowItem } from '@/api/entities';

// ============================================================================
// Types
// ============================================================================

export type DiscoverShowFilters = Omit<DiscoverTVParams, 'page'>;

export interface DiscoverShowPage {
  shows: ShowItem[];
  totalPages: number;
  totalResults: number;
}
