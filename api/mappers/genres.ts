import type { Genre } from '@/api/types';

// ============================================================================
// Static TMDB Genre Maps
// ============================================================================

const MOVIE_GENRES: Genre[] = [
  { id: 28, label: 'Action' },
  { id: 12, label: 'Adventure' },
  { id: 16, label: 'Animation' },
  { id: 35, label: 'Comedy' },
  { id: 80, label: 'Crime' },
  { id: 99, label: 'Documentary' },
  { id: 18, label: 'Drama' },
  { id: 10751, label: 'Family' },
  { id: 14, label: 'Fantasy' },
  { id: 36, label: 'History' },
  { id: 27, label: 'Horror' },
  { id: 10402, label: 'Music' },
  { id: 9648, label: 'Mystery' },
  { id: 10749, label: 'Romance' },
  { id: 878, label: 'Science Fiction' },
  { id: 10770, label: 'TV Movie' },
  { id: 53, label: 'Thriller' },
  { id: 10752, label: 'War' },
  { id: 37, label: 'Western' },
];

const TV_GENRES: Genre[] = [
  { id: 10759, label: 'Action & Adventure' },
  { id: 16, label: 'Animation' },
  { id: 35, label: 'Comedy' },
  { id: 80, label: 'Crime' },
  { id: 99, label: 'Documentary' },
  { id: 18, label: 'Drama' },
  { id: 10751, label: 'Family' },
  { id: 10762, label: 'Kids' },
  { id: 9648, label: 'Mystery' },
  { id: 10763, label: 'News' },
  { id: 10764, label: 'Reality' },
  { id: 10765, label: 'Sci-Fi & Fantasy' },
  { id: 10766, label: 'Soap' },
  { id: 10767, label: 'Talk' },
  { id: 10768, label: 'War & Politics' },
  { id: 37, label: 'Western' },
];

// Lookup maps (lazy-initialized)
const movieIdMap = new Map(MOVIE_GENRES.map((g) => [g.id, g.label]));
const movieNameMap = new Map(MOVIE_GENRES.map((g) => [g.label.toLowerCase(), g.id]));
const tvIdMap = new Map(TV_GENRES.map((g) => [g.id, g.label]));
const tvNameMap = new Map(TV_GENRES.map((g) => [g.label.toLowerCase(), g.id]));

// ============================================================================
// Helpers
// ============================================================================

/** Map TMDB genre IDs (from list endpoints) to Genre objects. */
export function mapGenreIds(ids: number[], type: 'movie' | 'tv'): Genre[] {
  const idMap = type === 'movie' ? movieIdMap : tvIdMap;
  return ids
    .map((id) => {
      const label = idMap.get(id);
      return label ? { id, label } : undefined;
    })
    .filter((g): g is Genre => g !== undefined);
}

/** Map genre name strings (from Radarr/Sonarr) to Genre objects. */
export function mapGenreNames(names: string[], type: 'movie' | 'tv'): Genre[] {
  const nameMap = type === 'movie' ? movieNameMap : tvNameMap;
  return names.map((name) => {
    const id = nameMap.get(name.toLowerCase());
    return { id: id ?? -1, label: name };
  });
}
