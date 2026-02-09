import type { components } from '@/api/clients/sonarr';
import type { EpisodeFile, ShowLibraryInfo, ShowLibraryStatus } from '@/api/entities';
import { formatBytes } from '@/api/mappers/format-bytes';

type SeriesResource = components['schemas']['SeriesResource'];
type EpisodeFileResource = components['schemas']['EpisodeFileResource'];

// ============================================================================
// Utilities
// ============================================================================

function deriveShowStatus(series: SeriesResource): ShowLibraryStatus {
  const stats = series.statistics;
  if (!stats) return 'missing';
  const total = stats.episodeCount ?? 0;
  const files = stats.episodeFileCount ?? 0;
  if (total > 0 && files >= total) return 'downloaded';
  if (files > 0) return 'partial';
  if (series.monitored) return 'wanted';
  return 'missing';
}

// ============================================================================
// Mappers
// ============================================================================

export function sonarrToEpisodeFile(file: EpisodeFileResource): EpisodeFile {
  return {
    mediaType: 'show',
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

export function sonarrToShowLibraryInfo(series: SeriesResource): ShowLibraryInfo {
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
}
