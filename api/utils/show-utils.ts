import { components } from '../clients/sonarr';
import { DisplayStatus, ShowItem, ShowStatus } from '../entities';
import { SortDirection } from '../types';

type SeriesResource = components['schemas']['SeriesResource'];

export type ShowSortField = 'added' | 'title' | 'year' | 'rating' | 'nextAiring';
export type ShowTabValue = 'all' | 'continuing' | 'complete' | 'missing';

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

export function mapToShowItem(series: SeriesResource): ShowItem {
  const posterImage = series.images?.find((img) => img.coverType === 'poster');
  const backdropImage = series.images?.find((img) => img.coverType === 'fanart');

  const rating = series.ratings?.value ?? undefined;

  // Use episodeCount (aired episodes) not totalEpisodeCount (includes unaired)
  const totalEpisodes = series.statistics?.episodeCount ?? 0;
  const downloadedEpisodes = series.statistics?.episodeFileCount ?? 0;
  const seasonCount = series.statistics?.seasonCount ?? series.seasons?.length ?? 0;

  const nextEpisode = series.nextAiring
    ? {
        seasonNumber: 0,
        episodeNumber: 0,
        title: 'TBA',
        airDate: new Date(series.nextAiring).toLocaleDateString(),
      }
    : undefined;

  return {
    id: series.id ?? 0,
    tmdbId: series.tmdbId,
    title: series.title ?? 'Unknown',
    year: series.year,
    type: 'show',
    status: deriveDisplayStatus(totalEpisodes, downloadedEpisodes),
    showStatus: mapShowStatus(series.status),
    posterUrl: posterImage?.remoteUrl ?? undefined,
    backdropUrl: backdropImage?.remoteUrl ?? undefined,
    overview: series.overview ?? undefined,
    rating,
    runtime: series.runtime ?? undefined,
    genres: series.genres ?? [],
    network: series.network ?? undefined,
    totalEpisodes,
    downloadedEpisodes,
    seasonCount,
    nextEpisode,
  };
}

export function filterByTab(tab: ShowTabValue): (show: ShowItem) => boolean {
  switch (tab) {
    case 'continuing':
      return (show) => show.showStatus === 'continuing';
    case 'complete':
      return (show) => show.downloadedEpisodes === show.totalEpisodes && show.totalEpisodes > 0;
    case 'missing':
      return (show) => show.downloadedEpisodes < show.totalEpisodes || show.totalEpisodes === 0;
    default:
      return () => true;
  }
}

export function filterShowsBySearch(search: string): (show: ShowItem) => boolean {
  if (!search.trim()) return () => true;
  const query = search.toLowerCase();
  return (s) =>
    s.title.toLowerCase().includes(query) ||
    s.network?.toLowerCase().includes(query) ||
    s.genres?.some((g) => g.toLowerCase().includes(query)) ||
    false;
}

export function filterShowsByGenres(genres: string[]): (show: ShowItem) => boolean {
  if (genres.length === 0) return () => true;
  return (s) => s.genres?.some((g) => genres.includes(g)) ?? false;
}

export function filterShowsByNetworks(networks: string[]): (show: ShowItem) => boolean {
  if (networks.length === 0) return () => true;
  return (s) => s.network !== undefined && networks.includes(s.network);
}

export function filterShowsByYearRange(yearMin: number | null, yearMax: number | null): (show: ShowItem) => boolean {
  if (yearMin === null && yearMax === null) return () => true;
  return (s) => {
    if (!s.year) return false;
    if (yearMin !== null && s.year < yearMin) return false;
    if (yearMax !== null && s.year > yearMax) return false;
    return true;
  };
}

export function filterShowsByRating(ratingMin: number | null): (show: ShowItem) => boolean {
  if (ratingMin === null) return () => true;
  return (s) => s.rating !== undefined && s.rating >= ratingMin;
}

export function sortShows(sort: ShowSortField, direction: SortDirection): (a: ShowItem, b: ShowItem) => number {
  const multiplier = direction === 'asc' ? 1 : -1;

  switch (sort) {
    case 'title':
      return (a, b) => multiplier * a.title.localeCompare(b.title);
    case 'year':
      return (a, b) => multiplier * ((a.year ?? 0) - (b.year ?? 0));
    case 'rating':
      return (a, b) => multiplier * ((a.rating ?? 0) - (b.rating ?? 0));
    case 'nextAiring':
      return (a, b) => {
        if (a.nextEpisode && !b.nextEpisode) return -1 * multiplier;
        if (!a.nextEpisode && b.nextEpisode) return 1 * multiplier;
        return 0;
      };
    case 'added':
    default:
      return direction === 'desc' ? () => 0 : (a, b) => b.id.toString().localeCompare(a.id.toString());
  }
}
