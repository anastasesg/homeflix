import type { ContextRule } from './types';

// ============================================================================
// TMDB Genre IDs
// ============================================================================

const MOVIE_GENRES = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  drama: 18,
  family: 10751,
  horror: 27,
  mystery: 9648,
  romance: 10749,
  sciFi: 878,
  thriller: 53,
} as const;

const TV_GENRES = {
  actionAdventure: 10759,
  animation: 16,
  comedy: 35,
  crime: 80,
  drama: 18,
  family: 10751,
  mystery: 9648,
  sciFiFantasy: 10765,
} as const;

// ============================================================================
// TMDB Keyword IDs (verified via themoviedb.org)
// ============================================================================

const KEYWORDS = {
  christmas: 207317,
  halloween: 316232,
  newYear: 613,
  winter: 1442,
} as const;

// ============================================================================
// Rule Catalog
// ============================================================================

export const CONTEXTUAL_RULES: ContextRule[] = [
  // --- Holidays (priority 100) ---
  {
    id: 'christmas',
    type: 'holiday',
    priority: 100,
    title: { movies: 'Christmas Movies', shows: 'Christmas Shows' },
    matcher: { type: 'date-range', start: [12, 1], end: [12, 31] },
    filters: {
      movies: { genres: [MOVIE_GENRES.family, MOVIE_GENRES.comedy], keywords: [KEYWORDS.christmas] },
      shows: { genres: [TV_GENRES.family, TV_GENRES.comedy], keywords: [KEYWORDS.christmas] },
    },
  },
  {
    id: 'halloween',
    type: 'holiday',
    priority: 100,
    title: { movies: 'Halloween Movies', shows: 'Halloween Shows' },
    matcher: { type: 'date-range', start: [10, 1], end: [10, 31] },
    filters: {
      movies: { genres: [MOVIE_GENRES.horror], keywords: [KEYWORDS.halloween] },
      shows: { genres: [TV_GENRES.mystery], keywords: [KEYWORDS.halloween] },
    },
  },
  {
    id: 'valentines',
    type: 'holiday',
    priority: 100,
    title: { movies: "Valentine's Day Movies", shows: "Valentine's Day Shows" },
    matcher: { type: 'date-range', start: [2, 7], end: [2, 14] },
    filters: {
      movies: { genres: [MOVIE_GENRES.romance] },
      shows: { genres: [TV_GENRES.drama] },
    },
  },
  {
    id: 'new-year',
    type: 'holiday',
    priority: 100,
    title: { movies: "New Year's Movies", shows: "New Year's Shows" },
    matcher: { type: 'date-range', start: [12, 28], end: [1, 2] },
    filters: {
      movies: { genres: [MOVIE_GENRES.comedy, MOVIE_GENRES.drama], keywords: [KEYWORDS.newYear] },
      shows: { genres: [TV_GENRES.comedy, TV_GENRES.drama], keywords: [KEYWORDS.newYear] },
    },
  },

  // --- Festivals/Awards (priority 80) ---
  {
    id: 'oscar-season',
    type: 'festival',
    priority: 80,
    title: { movies: 'Oscar-Worthy Movies', shows: 'Award-Winning Shows' },
    matcher: { type: 'date-range', start: [2, 15], end: [3, 15] },
    filters: {
      movies: { ratingMin: 7.0, voteCountMin: 500, sortBy: 'vote_average.desc' },
      shows: { ratingMin: 7.0, voteCountMin: 500, sortBy: 'vote_average.desc' },
    },
  },
  {
    id: 'sundance-season',
    type: 'festival',
    priority: 80,
    title: { movies: 'Sundance Spirit Movies', shows: 'Indie Shows' },
    matcher: { type: 'date-range', start: [1, 15], end: [2, 5] },
    filters: {
      movies: { ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
  },
  {
    id: 'cannes-season',
    type: 'festival',
    priority: 80,
    title: { movies: 'Cannes Picks', shows: 'International Shows' },
    matcher: { type: 'date-range', start: [5, 10], end: [6, 1] },
    filters: {
      movies: { language: 'fr', ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { language: 'fr', ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
  },
  {
    id: 'venice-tiff',
    type: 'festival',
    priority: 80,
    title: { movies: 'Festival Favorites', shows: 'Festival Season Shows' },
    matcher: { type: 'date-range', start: [8, 25], end: [9, 20] },
    filters: {
      movies: { ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
  },

  // --- Seasonal (priority 40) ---
  {
    id: 'summer-blockbusters',
    type: 'season',
    priority: 40,
    title: { movies: 'Summer Blockbusters', shows: 'Summer Binge Shows' },
    matcher: { type: 'month', months: [6, 7, 8] },
    filters: {
      movies: { genres: [MOVIE_GENRES.action, MOVIE_GENRES.adventure] },
      shows: { genres: [TV_GENRES.actionAdventure] },
    },
  },
  {
    id: 'cozy-winter',
    type: 'season',
    priority: 40,
    title: { movies: 'Cozy Winter Movies', shows: 'Cozy Winter Shows' },
    matcher: { type: 'month', months: [12, 1, 2] },
    filters: {
      movies: { genres: [MOVIE_GENRES.family, MOVIE_GENRES.drama], keywords: [KEYWORDS.winter] },
      shows: { genres: [TV_GENRES.family, TV_GENRES.drama], keywords: [KEYWORDS.winter] },
    },
  },
  {
    id: 'spring-romance',
    type: 'season',
    priority: 40,
    title: { movies: 'Spring Romance', shows: 'Romantic Shows' },
    matcher: { type: 'month', months: [3, 4, 5] },
    filters: {
      movies: { genres: [MOVIE_GENRES.romance, MOVIE_GENRES.comedy] },
      shows: { genres: [TV_GENRES.comedy, TV_GENRES.drama] },
    },
  },
  {
    id: 'fall-horror',
    type: 'season',
    priority: 40,
    title: { movies: 'Fall Thrills', shows: 'Spooky Season Shows' },
    matcher: { type: 'month', months: [9, 10, 11] },
    filters: {
      movies: { genres: [MOVIE_GENRES.horror, MOVIE_GENRES.thriller] },
      shows: { genres: [TV_GENRES.mystery, TV_GENRES.crime] },
    },
  },

  // --- Time of Day (priority 30) ---
  {
    id: 'morning-feel-good',
    type: 'time-of-day',
    priority: 30,
    title: { movies: 'Morning Feel-Good Movies', shows: 'Morning Feel-Good Shows' },
    matcher: { type: 'hour-range', start: 5, end: 12 },
    filters: {
      movies: { genres: [MOVIE_GENRES.comedy, MOVIE_GENRES.family, MOVIE_GENRES.animation] },
      shows: { genres: [TV_GENRES.comedy, TV_GENRES.family, TV_GENRES.animation] },
    },
  },
  {
    id: 'afternoon-adventure',
    type: 'time-of-day',
    priority: 30,
    title: { movies: 'Afternoon Adventures', shows: 'Afternoon Adventures' },
    matcher: { type: 'hour-range', start: 12, end: 17 },
    filters: {
      movies: { genres: [MOVIE_GENRES.action, MOVIE_GENRES.adventure, MOVIE_GENRES.sciFi] },
      shows: { genres: [TV_GENRES.actionAdventure, TV_GENRES.sciFiFantasy] },
    },
  },
  {
    id: 'evening-drama',
    type: 'time-of-day',
    priority: 30,
    title: { movies: 'Evening Drama', shows: 'Evening Drama' },
    matcher: { type: 'hour-range', start: 17, end: 21 },
    filters: {
      movies: { genres: [MOVIE_GENRES.drama, MOVIE_GENRES.thriller] },
      shows: { genres: [TV_GENRES.drama, TV_GENRES.crime] },
    },
  },
  {
    id: 'late-night',
    type: 'time-of-day',
    priority: 30,
    title: { movies: 'Late Night Movies', shows: 'Late Night Shows' },
    matcher: { type: 'hour-range', start: 21, end: 5 },
    filters: {
      movies: { genres: [MOVIE_GENRES.horror, MOVIE_GENRES.mystery, MOVIE_GENRES.crime] },
      shows: { genres: [TV_GENRES.mystery, TV_GENRES.crime] },
    },
  },

  // --- Day of Week (priority 20) ---
  {
    id: 'weekend-epics',
    type: 'day-of-week',
    priority: 20,
    title: { movies: 'Weekend Epics', shows: 'Weekend Binge Shows' },
    matcher: { type: 'day-of-week', days: [0, 6] },
    filters: {
      movies: { genres: [MOVIE_GENRES.action, MOVIE_GENRES.adventure, MOVIE_GENRES.drama], runtimeMin: 120 },
      shows: { genres: [TV_GENRES.actionAdventure, TV_GENRES.drama] },
    },
  },
  {
    id: 'weekday-quick',
    type: 'day-of-week',
    priority: 20,
    title: { movies: 'Quick Weeknight Movies', shows: 'Quick Weeknight Shows' },
    matcher: { type: 'day-of-week', days: [1, 2, 3, 4, 5] },
    filters: {
      movies: { runtimeMax: 100 },
      shows: { runtimeMax: 30 },
    },
  },
];
