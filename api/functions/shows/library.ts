import { createSonarrClient } from '@/api/clients/sonarr';
import type { ShowItemsRequest, ShowItemsResponse } from '@/api/dtos';
import type { EpisodeFile, ShowHistoryEvent, ShowItem, ShowLibraryInfo } from '@/api/entities';
import {
  sonarrToEpisodeFile,
  sonarrToShowHistoryEvent,
  sonarrToShowItem,
  sonarrToShowLibraryInfo,
} from '@/api/mappers';
import {
  filterByTab,
  filterShowsByGenres,
  filterShowsByNetworks,
  filterShowsByRating,
  filterShowsBySearch,
  filterShowsByYearRange,
  sortShows,
} from '@/api/utils';

// ============================================================================
// Functions
// ============================================================================

const NOT_IN_LIBRARY: ShowLibraryInfo = {
  inLibrary: false,
  status: 'not_in_library',
  monitored: false,
  totalEpisodes: 0,
  downloadedEpisodes: 0,
  seasons: [],
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

  const shows = (data ?? []).map(sonarrToShowItem);

  const totalEpisodes = shows.reduce((sum, s) => sum + (s.totalEpisodes ?? 0), 0);
  const downloadedEpisodes = shows.reduce((sum, s) => sum + (s.downloadedEpisodes ?? 0), 0);

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

export async function fetchFeaturedShow(): Promise<ShowItem[]> {
  const client = createSonarrClient();
  const { data, error } = await client.GET('/api/v3/series', {});

  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Unknown error';
    throw new Error(`Failed to fetch shows from Sonarr: ${errorMessage}`);
  }

  return (data ?? [])
    .map(sonarrToShowItem)
    .filter((s) => s.showStatus === 'continuing' && s.backdropUrl)
    .sort(sortShows('rating', 'desc'))
    .slice(0, 5);
}

export async function fetchShowLibraryInfo(tmdbId: number): Promise<ShowLibraryInfo> {
  try {
    const client = createSonarrClient();
    const { data, error } = await client.GET('/api/v3/series', {});

    if (error || !data) return NOT_IN_LIBRARY;

    const series = data.find((s) => s.tmdbId === tmdbId);
    if (!series) return NOT_IN_LIBRARY;

    return sonarrToShowLibraryInfo(series);
  } catch {
    return NOT_IN_LIBRARY;
  }
}

export async function fetchShowEpisodeFiles(sonarrId: number): Promise<EpisodeFile[]> {
  try {
    const client = createSonarrClient();
    const { data, error } = await client.GET('/api/v3/episodefile', {
      params: { query: { seriesId: sonarrId } },
    });

    if (error || !data) return [];
    return data.map(sonarrToEpisodeFile);
  } catch {
    return [];
  }
}

export async function fetchShowHistory(sonarrId: number): Promise<ShowHistoryEvent[]> {
  try {
    const client = createSonarrClient();
    const { data, error } = await client.GET('/api/v3/history/series', {
      params: { query: { seriesId: sonarrId, includeEpisode: true } },
    });

    if (error || !data) return [];
    return data.map(sonarrToShowHistoryEvent);
  } catch {
    return [];
  }
}
