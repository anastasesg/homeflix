import { type components, createRadarrClient } from '@/api/clients/radarr';
import type { HistoryEvent, LibraryInfo, MovieFile, MovieItem } from '@/api/entities';
import { MediaStatus, SortDirection, SortField } from '@/api/types';
import {
  filterByGenres,
  filterByRating,
  filterBySearch,
  filterByStatus,
  filterByYearRange,
  mapToMovieItem,
  sortMovies,
} from '@/api/utils';

type MovieResource = components['schemas']['MovieResource'];
type MovieFileResource = components['schemas']['MovieFileResource'];
type HistoryResource = components['schemas']['HistoryResource'];

// ============================================================================
// Types
// ============================================================================

export type MovieItemsRequest = {
  status?: MediaStatus | 'all';
  search?: string;
  genres?: string[];
  yearMin?: number | null;
  yearMax?: number | null;
  ratingMin?: number | null;
  sortField?: SortField;
  sortDirection?: SortDirection;
};

export type MovieItemsResponse = {
  stats: {
    all: number;
    downloaded: number;
    downloading: number;
    wanted: number;
    missing: number;
  };
  movies: MovieItem[];
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

function deriveStatus(movie: MovieResource): LibraryInfo['status'] {
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
// Functions
// ============================================================================

export async function fetchMovieItems(props: MovieItemsRequest): Promise<MovieItemsResponse> {
  const client = createRadarrClient();
  const { data, error } = await client.GET('/api/v3/movie');

  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Unknown error';
    throw new Error(`Failed to fetch movies from Radarr: ${errorMessage}`);
  }

  const movies = data.map(mapToMovieItem);
  return {
    stats: {
      all: movies.length,
      downloaded: movies.filter(filterByStatus('downloaded')).length,
      downloading: movies.filter(filterByStatus('downloading')).length,
      wanted: movies.filter(filterByStatus('wanted')).length,
      missing: movies.filter(filterByStatus('missing')).length,
    },
    movies: movies
      .filter(filterByStatus(props.status ?? 'all'))
      .filter(filterBySearch(props.search ?? ''))
      .filter(filterByGenres(props.genres ?? []))
      .filter(filterByRating(props.ratingMin ?? null))
      .filter(filterByYearRange(props.yearMin ?? null, props.yearMax ?? null))
      .sort(sortMovies(props.sortField ?? 'title', props.sortDirection ?? 'asc')),
  };
}

export async function fetchFeaturedMovie(): Promise<MovieItem | undefined> {
  const client = createRadarrClient();
  const { data, error } = await client.GET('/api/v3/movie');

  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Unknown error';
    throw new Error(`Failed to fetch movies from Radarr: ${errorMessage}`);
  }

  return data.map(mapToMovieItem).filter(filterByStatus('downloaded')).sort(sortMovies('rating', 'desc')).at(0);
}

export async function fetchMovieLibraryInfo(tmdbId: number): Promise<LibraryInfo> {
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
    return {
      inLibrary: false,
      status: 'not_in_library',
      monitored: false,
      hasFile: false,
    };
  }
}

export async function fetchMovieHistory(radarrId: number): Promise<HistoryEvent[]> {
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
}
