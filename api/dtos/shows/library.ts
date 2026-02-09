import type { ShowItem } from '@/api/entities';
import type { SortDirection } from '@/api/types';
import type { ShowSortField, ShowTabValue } from '@/api/utils/show-utils';

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
