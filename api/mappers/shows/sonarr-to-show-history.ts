import type { components } from '@/api/clients/sonarr';
import type { ShowHistoryEvent } from '@/api/entities';

type HistoryResource = components['schemas']['HistoryResource'];

export function sonarrToShowHistoryEvent(event: HistoryResource): ShowHistoryEvent {
  const typeMap: Record<string, ShowHistoryEvent['type']> = {
    grabbed: 'grabbed',
    downloadFolderImported: 'downloadFolderImported',
    downloadFailed: 'downloadFailed',
    episodeFileDeleted: 'episodeFileDeleted',
    episodeFileRenamed: 'episodeFileRenamed',
  };

  return {
    mediaType: 'show',
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
