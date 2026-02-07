import { SeriesResource } from '@/api/clients/sonarr';
import { DisplayStatus, ShowItem, ShowStatus } from '@/api/entities';

import { mapGenreNames } from '../genres';

function mapShowStatus(status: SeriesResource['status']): ShowStatus {
  switch (status) {
    case 'continuing':
      return 'continuing';
    case 'ended':
    case 'deleted':
      return 'ended';
    case 'upcoming':
      return 'upcoming';
    default:
      return 'ended';
  }
}

function deriveDisplayStatus(totalEpisodes: number, downloadedEpisodes: number): DisplayStatus {
  if (totalEpisodes === 0) return 'wanted';
  if (downloadedEpisodes === totalEpisodes) return 'complete';
  if (downloadedEpisodes > 0) return 'partial';
  return 'missing';
}

export function sonarrToShowItem(series: SeriesResource): ShowItem {
  const posterImage = series.images?.find((img) => img.coverType === 'poster');
  const backdropImage = series.images?.find((img) => img.coverType === 'fanart');

  const totalEpisodes = series.statistics?.episodeCount ?? 0;
  const downloadedEpisodes = series.statistics?.episodeFileCount ?? 0;

  return {
    tmdbId: series.tmdbId ?? 0,
    title: series.title ?? 'Unknown',
    overview: series.overview ?? '',
    year: series.year ?? 0,
    rating: series.ratings?.value ?? 0,
    voteCount: 0,
    popularity: 0,
    posterUrl: posterImage?.remoteUrl ?? undefined,
    backdropUrl: backdropImage?.remoteUrl ?? undefined,
    genres: mapGenreNames(series.genres ?? [], 'tv'),
    originCountry: [],
    status: deriveDisplayStatus(totalEpisodes, downloadedEpisodes),
    showStatus: mapShowStatus(series.status),
    totalEpisodes,
    downloadedEpisodes,
    seasonCount: series.statistics?.seasonCount ?? series.seasons?.length ?? 0,
    network: series.network ?? undefined,
    dateAdded: series.added ?? undefined,
  };
}
