import type { HistoryResource } from '@/api/clients/radarr';
import type { MovieHistoryEvent } from '@/api/entities';

export function radarrToMovieHistoryEvent(event: HistoryResource): MovieHistoryEvent {
  const typeMap: Record<string, MovieHistoryEvent['type']> = {
    grabbed: 'grabbed',
    downloadFolderImported: 'downloadFolderImported',
    downloadFailed: 'downloadFailed',
    movieFileDeleted: 'movieFileDeleted',
    movieFileRenamed: 'movieFileRenamed',
  };

  return {
    mediaType: 'movie',
    id: event.id ?? 0,
    type: typeMap[event.eventType ?? ''] ?? 'unknown',
    date: event.date ?? '',
    quality: event.quality?.quality?.name ?? 'Unknown',
    indexer: event.data?.indexer ?? undefined,
    downloadClient: event.data?.downloadClient ?? undefined,
    reason: event.data?.message ?? undefined,
    sourceTitle: event.sourceTitle ?? undefined,
  };
}
