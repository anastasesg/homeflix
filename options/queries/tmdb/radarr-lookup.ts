import { queryOptions } from '@tanstack/react-query';

import { type components, createRadarrClient } from '@/api/clients/radarr';
import type { HistoryEvent, LibraryInfo, LibraryStatus, MovieFile } from '@/api/entities';

type MovieResource = components['schemas']['MovieResource'];
type MovieFileResource = components['schemas']['MovieFileResource'];
type HistoryResource = components['schemas']['HistoryResource'];

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

function deriveStatus(movie: MovieResource): LibraryStatus {
  if (movie.hasFile) return 'downloaded';
  if (movie.monitored && movie.isAvailable) return 'wanted';
  if (movie.monitored) return 'missing';
  return 'missing';
}

function mapMovieFile(file: MovieFileResource): MovieFile {
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
  };
}

function mapHistoryEvent(event: HistoryResource): HistoryEvent {
  const typeMap: Record<string, HistoryEvent['type']> = {
    grabbed: 'grabbed',
    downloadFolderImported: 'downloadFolderImported',
    downloadFailed: 'downloadFailed',
    movieFileDeleted: 'movieFileDeleted',
    movieFileRenamed: 'movieFileRenamed',
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
  };
}

// ============================================================================
// Query Options
// ============================================================================

/**
 * Looks up a movie in Radarr by TMDB ID.
 * Returns library status information if found, or not_in_library status if not.
 */
export function radarrLookupQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['radarr', 'lookup', 'tmdb', tmdbId] as const,
    queryFn: async (): Promise<LibraryInfo> => {
      try {
        const client = createRadarrClient();
        const { data, error } = await client.GET('/api/v3/movie', {
          params: { query: { tmdbId } },
        });

        if (error || !data || data.length === 0) {
          return {
            inLibrary: false,
            status: 'not_in_library',
            monitored: false,
            hasFile: false,
          };
        }

        const movie = data[0];
        return {
          inLibrary: true,
          radarrId: movie.id ?? undefined,
          status: deriveStatus(movie),
          monitored: movie.monitored ?? false,
          qualityProfileId: movie.qualityProfileId ?? undefined,
          quality: movie.movieFile?.quality?.quality?.name ?? undefined,
          size: movie.sizeOnDisk ? formatBytes(movie.sizeOnDisk) : undefined,
          hasFile: movie.hasFile ?? false,
          path: movie.path ?? undefined,
          file: movie.movieFile ? mapMovieFile(movie.movieFile) : undefined,
        };
      } catch {
        // If Radarr is unavailable, treat as not in library
        return {
          inLibrary: false,
          status: 'not_in_library',
          monitored: false,
          hasFile: false,
        };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - library status can change
    retry: false, // Don't retry if Radarr is down
  });
}

/**
 * Fetches history for a movie from Radarr.
 * Requires the Radarr movie ID (not TMDB ID).
 */
export function radarrHistoryQueryOptions(radarrId: number) {
  return queryOptions({
    queryKey: ['radarr', 'history', 'movie', radarrId] as const,
    queryFn: async (): Promise<HistoryEvent[]> => {
      try {
        const client = createRadarrClient();
        const { data, error } = await client.GET('/api/v3/history/movie', {
          params: { query: { movieId: radarrId } },
        });

        if (error || !data) return [];

        return data.map(mapHistoryEvent);
      } catch {
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
