import { components } from '../clients/radarr';
import { MovieItem } from '../entities';
import { MediaStatus, SortDirection, SortField } from '../types';

type MovieResource = components['schemas']['MovieResource'];

function deriveMediaStatus(movie: MovieResource): MediaStatus {
  if (movie.hasFile) return 'downloaded';
  if (movie.monitored && movie.isAvailable) return 'wanted';
  if (movie.monitored) return 'missing';
  return 'missing';
}

export function mapToMovieItem(movie: MovieResource): MovieItem {
  const posterImage = movie.images?.find((img) => img.coverType === 'poster');
  const backdropImage = movie.images?.find((img) => img.coverType === 'fanart');

  // Get quality from movie file if available (convert null to undefined)
  const quality = movie.movieFile?.quality?.quality?.name ?? undefined;

  // Prefer TMDB rating, fallback to IMDB
  const rating = movie.ratings?.tmdb?.value ?? movie.ratings?.imdb?.value;

  return {
    id: movie.id ?? 0,
    tmdbId: movie.tmdbId ?? undefined,
    title: movie.title ?? 'Unknown',
    year: movie.year,
    type: 'movie',
    status: deriveMediaStatus(movie),
    posterUrl: posterImage?.remoteUrl ?? undefined,
    backdropUrl: backdropImage?.remoteUrl ?? undefined,
    quality,
    rating,
    runtime: movie.runtime ?? undefined,
    genres: movie.genres ?? [],
    overview: movie.overview ?? undefined,
    tagline: undefined, // Not available in Radarr API
  };
}

export function filterByStatus(status: MediaStatus | 'all'): (movie: MovieItem) => boolean {
  switch (status) {
    case 'downloaded':
      return (movie) => movie.status === 'downloaded';
    case 'downloading':
      return (movie) => movie.status === 'downloading';
    case 'wanted':
      return (movie) => movie.status === 'wanted';
    case 'missing':
      return (movie) => movie.status === 'missing';
    default:
      return () => true;
  }
}

export function filterBySearch(search: string): (movie: MovieItem) => boolean {
  if (!search.trim()) return () => true;
  const query = search.toLowerCase();
  return (m) =>
    m.title.toLowerCase().includes(query) || m.genres?.some((g) => g.toLowerCase().includes(query)) || false;
}

export function filterByGenres(genres: string[]): (movie: MovieItem) => boolean {
  if (genres.length === 0) return () => true;
  return (m) => m.genres?.some((g) => genres.includes(g)) ?? false;
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
  return (m) => m.rating !== undefined && m.rating >= ratingMin;
}

export function sortMovies(sort: SortField, direction: SortDirection): (a: MovieItem, b: MovieItem) => number {
  const multiplier = direction === 'asc' ? 1 : -1;

  switch (sort) {
    case 'title':
      return (a, b) => multiplier * a.title.localeCompare(b.title);
    case 'year':
      return (a, b) => multiplier * ((a.year ?? 0) - (b.year ?? 0));
    case 'rating':
      return (a, b) => multiplier * ((a.rating ?? 0) - (b.rating ?? 0));
    case 'added':
    default:
      return (a, b) => multiplier * b.id.toString().localeCompare(a.id.toString()); // Assuming higher ID means more recently added
  }
}
