import { createSonarrClient } from '@/api/clients/sonarr';
import { ShowItem } from '@/api/entities';
import { SortDirection } from '@/api/types';
import {
  filterByTab,
  filterShowsByGenres,
  filterShowsByNetworks,
  filterShowsByRating,
  filterShowsBySearch,
  filterShowsByYearRange,
  mapToShowItem,
  ShowSortField,
  ShowTabValue,
  sortShows,
} from '@/api/utils';

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

export async function fetchShowItems(props: ShowItemsRequest): Promise<ShowItemsResponse> {
  const client = createSonarrClient();
  const { data, error } = await client.GET('/api/v3/series', {});

  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Unknown error';
    throw new Error(`Failed to fetch shows from Sonarr: ${errorMessage}`);
  }

  const shows = (data ?? []).map(mapToShowItem);

  // Calculate episode totals from all shows
  const totalEpisodes = shows.reduce((sum, s) => sum + s.totalEpisodes, 0);
  const downloadedEpisodes = shows.reduce((sum, s) => sum + s.downloadedEpisodes, 0);

  return {
    stats: {
      all: shows.length,
      continuing: shows.filter(filterByTab('continuing')).length,
      complete: shows.filter(filterByTab('complete')).length,
      missing: shows.filter(filterByTab('missing')).length,
      totalEpisodes,
      downloadedEpisodes,
    },
    shows: shows
      .filter(filterByTab(props.tab ?? 'all'))
      .filter(filterShowsBySearch(props.search ?? ''))
      .filter(filterShowsByGenres(props.genres ?? []))
      .filter(filterShowsByNetworks(props.networks ?? []))
      .filter(filterShowsByYearRange(props.yearMin ?? null, props.yearMax ?? null))
      .filter(filterShowsByRating(props.ratingMin ?? null))
      .sort(sortShows(props.sortField ?? 'added', props.sortDirection ?? 'desc')),
  };
}
