import type { ShowItem } from '@/api/entities';
import type { ShowSortField, ShowTabValue, SortDirection } from '@/api/types';

// ============================================================================
// Types
// ============================================================================

export type ShowItemsRequest = {
  tab?: ShowTabValue;
  search?: string;
  genres?: string[];
  networks?: string[];
  yearMin?: number | null;
  yearMax?: number | null;
  ratingMin?: number | null;
  sortField?: ShowSortField;
  sortDirection?: SortDirection;
};

export type ShowItemsResponse = {
  stats: {
    all: number;
    continuing: number;
    complete: number;
    missing: number;
    totalEpisodes: number;
    downloadedEpisodes: number;
  };
  shows: ShowItem[];
};
