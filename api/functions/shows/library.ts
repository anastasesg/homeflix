import { type components, createSonarrClient } from '@/api/clients/sonarr';
import type { EpisodeFile, ShowHistoryEvent, ShowItem, ShowLibraryInfo } from '@/api/entities';
import { sonarrToShowItem } from '@/api/mappers';
import { SortDirection } from '@/api/types';
import {
  filterByTab,
  filterShowsByGenres,
  filterShowsByNetworks,
  filterShowsByRating,
  filterShowsBySearch,
  filterShowsByYearRange,
  ShowSortField,
  ShowTabValue,
  sortShows,
} from '@/api/utils';

type EpisodeFileResource = components['schemas']['EpisodeFileResource'];
type HistoryResource = components['schemas']['HistoryResource'];

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

// ============================================================================
// Mappers
// ============================================================================

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function deriveShowStatus(series: components['schemas']['SeriesResource']): ShowLibraryInfo['status'] {
  const stats = series.statistics;
  if (!stats) return 'missing';
  const total = stats.episodeCount ?? 0;
  const files = stats.episodeFileCount ?? 0;
  if (total > 0 && files >= total) return 'downloaded';
  if (files > 0) return 'partial';
  if (series.monitored) return 'wanted';
  return 'missing';
}

function mapEpisodeFile(file: EpisodeFileResource): EpisodeFile {
  return {
    id: file.id ?? 0,
    path: file.path ?? '',
    size: formatBytes(file.size ?? 0),
    quality: file.quality?.quality?.name ?? 'Unknown',
    videoCodec: file.mediaInfo?.videoCodec ?? 'Unknown',
    audioCodec: file.mediaInfo?.audioCodec ?? 'Unknown',
    resolution: file.mediaInfo?.resolution ?? 'Unknown',
    languages: file.languages?.map((l) => l.name ?? 'Unknown') ?? [],
    dateAdded: file.dateAdded ?? '',
    seasonNumber: file.seasonNumber ?? 0,
    episodeNumber: 0,
  };
}

function mapShowHistoryEvent(event: HistoryResource): ShowHistoryEvent {
  const typeMap: Record<string, ShowHistoryEvent['type']> = {
    grabbed: 'grabbed',
    downloadFolderImported: 'downloadFolderImported',
    downloadFailed: 'downloadFailed',
    episodeFileDeleted: 'episodeFileDeleted',
    episodeFileRenamed: 'episodeFileRenamed',
  };

  return {
    id: event.id ?? 0,
    type: typeMap[event.eventType ?? ''] ?? 'unknown',
    date: event.date ?? '',
    quality: event.quality?.quality?.name ?? 'Unknown',
    indexer: event.data?.indexer ?? undefined,
    downloadClient: event.data?.downloadClient ?? undefined,
    reason: event.data?.message ?? undefined,
    sourceTitle: event.sourceTitle ?? undefined,
    seasonNumber: event.episode?.seasonNumber ?? undefined,
    episodeNumber: event.episode?.episodeNumber ?? undefined,
    episodeTitle: event.episode?.title ?? undefined,
  };
}

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

    return {
      inLibrary: true,
      sonarrId: series.id ?? undefined,
      status: deriveShowStatus(series),
      monitored: series.monitored ?? false,
      qualityProfileId: series.qualityProfileId ?? undefined,
      totalEpisodes: series.statistics?.episodeCount ?? 0,
      downloadedEpisodes: series.statistics?.episodeFileCount ?? 0,
      sizeOnDisk: series.statistics?.sizeOnDisk ? formatBytes(series.statistics.sizeOnDisk) : undefined,
      nextAiring: series.nextAiring ?? undefined,
      path: series.path ?? undefined,
      seasons: (series.seasons ?? []).map((s) => ({
        seasonNumber: s.seasonNumber ?? 0,
        monitored: s.monitored ?? false,
        episodeCount: s.statistics?.episodeCount ?? 0,
        episodeFileCount: s.statistics?.episodeFileCount ?? 0,
        totalEpisodeCount: s.statistics?.totalEpisodeCount ?? 0,
        sizeOnDisk: s.statistics?.sizeOnDisk ?? 0,
      })),
    };
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
    return data.map(mapEpisodeFile);
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
    return data.map(mapShowHistoryEvent);
  } catch {
    return [];
  }
}
