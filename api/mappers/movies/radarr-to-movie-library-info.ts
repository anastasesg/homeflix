import type { MovieFileResource, MovieResource } from '@/api/clients/radarr';
import type { MinimumAvailability, MovieFile, MovieLibraryInfo, MovieLibraryStatus } from '@/api/entities';
import { formatBytes } from '@/api/mappers/format-bytes';

function deriveStatus(movie: MovieResource): MovieLibraryStatus {
  if (movie.hasFile) return 'downloaded';
  if (movie.monitored && movie.isAvailable) return 'wanted';
  if (movie.monitored) return 'missing';
  return 'missing';
}

function mapMovieFile(file: MovieFileResource): MovieFile {
  return {
    mediaType: 'movie',
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

export function radarrToMovieLibraryInfo(movie: MovieResource): MovieLibraryInfo {
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
    minimumAvailability: (movie.minimumAvailability as MinimumAvailability) ?? undefined,
  };
}
