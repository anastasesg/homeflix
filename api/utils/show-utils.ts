import { ShowItem } from '../entities';
import { SortDirection } from '../types';

export type ShowSortField = 'added' | 'title' | 'year' | 'rating' | 'nextAiring';
export type ShowTabValue = 'all' | 'continuing' | 'complete' | 'missing';

// ============================================================================
// Filters
// ============================================================================

export function filterByTab(tab: ShowTabValue): (show: ShowItem) => boolean {
  switch (tab) {
    case 'continuing':
      return (show) => show.showStatus === 'continuing';
    case 'complete':
      return (show) => (show.downloadedEpisodes ?? 0) === (show.totalEpisodes ?? 0) && (show.totalEpisodes ?? 0) > 0;
    case 'missing':
      return (show) => (show.downloadedEpisodes ?? 0) < (show.totalEpisodes ?? 0) || (show.totalEpisodes ?? 0) === 0;
    default:
      return () => true;
  }
}

export function filterShowsBySearch(search: string): (show: ShowItem) => boolean {
  if (!search.trim()) return () => true;
  const query = search.toLowerCase();
  return (s) =>
    s.title.toLowerCase().includes(query) ||
    (s.network?.toLowerCase().includes(query) ?? false) ||
    s.genres.some((g) => g.label.toLowerCase().includes(query));
}

export function filterShowsByGenres(genres: string[]): (show: ShowItem) => boolean {
  if (genres.length === 0) return () => true;
  return (s) => s.genres.some((g) => genres.includes(g.label));
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
  return (s) => s.rating >= ratingMin;
}

// ============================================================================
// Sort
// ============================================================================

export function sortShows(sort: ShowSortField, direction: SortDirection): (a: ShowItem, b: ShowItem) => number {
  const multiplier = direction === 'asc' ? 1 : -1;

  switch (sort) {
    case 'title':
      return (a, b) => multiplier * a.title.localeCompare(b.title);
    case 'year':
      return (a, b) => multiplier * (a.year - b.year);
    case 'rating':
      return (a, b) => multiplier * (a.rating - b.rating);
    case 'nextAiring':
      return (a, b) => {
        const dateA = a.dateAdded ?? '';
        const dateB = b.dateAdded ?? '';
        return multiplier * dateA.localeCompare(dateB);
      };
    case 'added':
    default:
      return (a, b) => {
        const dateA = a.dateAdded ?? '';
        const dateB = b.dateAdded ?? '';
        return multiplier * dateA.localeCompare(dateB);
      };
  }
}
