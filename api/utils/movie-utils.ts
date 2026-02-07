import { MovieItem } from '../entities';
import { MediaStatus, SortDirection, SortField } from '../types';

// ============================================================================
// Filters
// ============================================================================

export function filterByStatus(status: MediaStatus | 'all'): (movie: MovieItem) => boolean {
  if (status === 'all') return () => true;
  return (movie) => movie.status === status;
}

export function filterBySearch(search: string): (movie: MovieItem) => boolean {
  if (!search.trim()) return () => true;
  const query = search.toLowerCase();
  return (m) => m.title.toLowerCase().includes(query) || m.genres.some((g) => g.label.toLowerCase().includes(query));
}

export function filterByGenres(genres: string[]): (movie: MovieItem) => boolean {
  if (genres.length === 0) return () => true;
  return (m) => m.genres.some((g) => genres.includes(g.label));
}

export function filterByYearRange(yearMin: number | null, yearMax: number | null): (movie: MovieItem) => boolean {
  if (yearMin === null && yearMax === null) return () => true;
  return (m) => {
    if (!m.year) return false;
    if (yearMin !== null && m.year < yearMin) return false;
    if (yearMax !== null && m.year > yearMax) return false;
    return true;
  };
}

export function filterByRating(ratingMin: number | null): (movie: MovieItem) => boolean {
  if (ratingMin === null) return () => true;
  return (m) => m.rating >= ratingMin;
}

// ============================================================================
// Sort
// ============================================================================

export function sortMovies(sort: SortField, direction: SortDirection): (a: MovieItem, b: MovieItem) => number {
  const multiplier = direction === 'asc' ? 1 : -1;

  switch (sort) {
    case 'title':
      return (a, b) => multiplier * a.title.localeCompare(b.title);
    case 'year':
      return (a, b) => multiplier * (a.year - b.year);
    case 'rating':
      return (a, b) => multiplier * (a.rating - b.rating);
    case 'added':
    default:
      return (a, b) => {
        const dateA = a.dateAdded ?? '';
        const dateB = b.dateAdded ?? '';
        return multiplier * dateA.localeCompare(dateB);
      };
  }
}
