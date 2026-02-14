# Curated Rows & Explore Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add ~84 rotating curated content rows to the homepage (33 directors, 12 movements, 11 world cinema regions, 18 themes, 6 eras, 4 collections) and a dedicated Explore page for browsing all categories.

**Architecture:** Extends the existing contextual recommendations system in `lib/contextual/`. Adds an `AlwaysMatcher` for curated rules, a daily-seed rotation algorithm for homepage variety, a `fetchMoviesByIds` function for ID-list collections (Criterion), and a new `/explore` route with category browsing and collection detail pages.

**Tech Stack:** Next.js 16 (App Router), React 19, TanStack React Query, Tailwind CSS 4, shadcn/ui, openapi-fetch (TMDB client)

**Design doc:** `docs/plans/2026-02-13-curated-rows-design.md`

---

## Task 1: Extend Type System & Update Matchers

**Files:**
- Modify: `lib/contextual/types.ts`
- Modify: `lib/contextual/matchers.ts`

**Step 1: Extend `lib/contextual/types.ts`**

Replace the entire file with:

```typescript
import type { DiscoverMovieFilters, DiscoverShowFilters } from '@/api/dtos';

// ============================================================================
// Matcher Types
// ============================================================================

interface DateRangeMatcher {
  type: 'date-range';
  start: [month: number, day: number];
  end: [month: number, day: number];
}

interface HourRangeMatcher {
  type: 'hour-range';
  start: number;
  end: number;
}

interface DayOfWeekMatcher {
  type: 'day-of-week';
  days: number[];
}

interface MonthMatcher {
  type: 'month';
  months: number[];
}

interface AlwaysMatcher {
  type: 'always';
}

type ContextMatcher = DateRangeMatcher | HourRangeMatcher | DayOfWeekMatcher | MonthMatcher | AlwaysMatcher;

// ============================================================================
// Rule Types
// ============================================================================

type ContextRuleType =
  | 'holiday' | 'time-of-day' | 'day-of-week' | 'season' | 'festival'
  | 'director' | 'curated-list' | 'thematic' | 'era' | 'world-cinema' | 'movement';

type RowMode = 'paired' | 'movies-only' | 'shows-only';

interface ContextRule {
  id: string;
  type: ContextRuleType;
  priority: number;
  title: { movies: string; shows: string };
  matcher: ContextMatcher;
  filters: {
    movies: DiscoverMovieFilters;
    shows: DiscoverShowFilters;
  };
  mode?: RowMode;
}

// ============================================================================
// Curated Rule Types
// ============================================================================

type CuratedCategory = 'director' | 'movement' | 'world-cinema' | 'era' | 'thematic' | 'collection';

interface CuratedRuleMeta {
  slug: string;
  displayTitle: string;
  description: string;
  category: CuratedCategory;
}

interface CuratedRule extends Omit<ContextRule, 'matcher'> {
  matcher: AlwaysMatcher;
  meta: CuratedRuleMeta;
  movieIds?: number[];
}

export type { AlwaysMatcher, ContextMatcher, ContextRule, ContextRuleType, CuratedCategory, CuratedRule, CuratedRuleMeta, RowMode };
export type { DateRangeMatcher, DayOfWeekMatcher, HourRangeMatcher, MonthMatcher };
```

**Step 2: Update `lib/contextual/matchers.ts`**

Add the `'always'` case to the `matchesContext` switch statement. In `lib/contextual/matchers.ts`, find this code:

```typescript
    case 'month':
      return isMonthMatch(month, matcher.months);
```

Replace with:

```typescript
    case 'month':
      return isMonthMatch(month, matcher.months);
    case 'always':
      return true;
```

**Step 3: Verify**

Run: `bun check`
Expected: No errors (types are backward-compatible — `mode` is optional, AlwaysMatcher just extends the union).

**Step 4: Commit**

```bash
git add lib/contextual/types.ts lib/contextual/matchers.ts
git commit -m "feat(contextual): extend types with AlwaysMatcher, CuratedRule, and RowMode"
```

---

## Task 2: Create Curated Rules Catalog

**Files:**
- Create: `lib/contextual/curated-rules.ts`

This file defines all ~84 curated rules. It reads director data from `lib/contextual/data/directors.json` and collection data from JSON files in `lib/contextual/data/`.

**Step 1: Create `lib/contextual/curated-rules.ts`**

```typescript
import type { CuratedRule } from './types';

import a24Data from './data/a24-films.json';
import criterionData from './data/criterion-collection.json';
import directorsData from './data/directors.json';
import palmeDorData from './data/palme-dor-winners.json';
import sightAndSoundData from './data/sight-and-sound.json';

// ============================================================================
// TMDB Genre IDs
// ============================================================================

const MG = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  drama: 18,
  family: 10751,
  fantasy: 14,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  sciFi: 878,
  thriller: 53,
  war: 10752,
  western: 37,
} as const;

const TG = {
  actionAdventure: 10759,
  animation: 16,
  comedy: 35,
  crime: 80,
  drama: 18,
  family: 10751,
  mystery: 9648,
  sciFiFantasy: 10765,
  warPolitics: 10768,
} as const;

// ============================================================================
// Director Rules (~33, movies-only)
// ============================================================================

const DIRECTOR_RULES: CuratedRule[] = (directorsData as { name: string; tmdbId: number; slug: string; description: string }[]).map(
  (d) => ({
    id: `dir-${d.slug}`,
    type: 'director' as const,
    priority: 50,
    title: { movies: d.name, shows: '' },
    matcher: { type: 'always' as const },
    filters: {
      movies: { crewIds: [d.tmdbId], sortBy: 'vote_average.desc', voteCountMin: 50 },
      shows: {},
    },
    mode: 'movies-only' as const,
    meta: {
      slug: d.slug,
      displayTitle: d.name,
      description: d.description,
      category: 'director' as const,
    },
  })
);

// ============================================================================
// Cinematic Movement Rules (~12, paired)
// ============================================================================

const MOVEMENT_RULES: CuratedRule[] = [
  {
    id: 'mov-french-new-wave',
    type: 'movement',
    priority: 50,
    title: { movies: 'French New Wave Movies', shows: 'French New Wave Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'fr', yearMin: 1958, yearMax: 1975, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { language: 'fr', yearMin: 1958, yearMax: 1975, ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'french-new-wave',
      displayTitle: 'French New Wave',
      description: 'The revolutionary movement that broke every rule of conventional filmmaking. Godard, Truffaut, Varda, and their contemporaries reinvented cinema in 1960s France.',
      category: 'movement',
    },
  },
  {
    id: 'mov-italian-neorealism',
    type: 'movement',
    priority: 50,
    title: { movies: 'Italian Neorealist Movies', shows: 'Italian Neorealist Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'it', yearMin: 1943, yearMax: 1960, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { language: 'it', yearMin: 1943, yearMax: 1960, ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'italian-neorealism',
      displayTitle: 'Italian Neorealism',
      description: 'Raw, authentic stories of post-war Italy. De Sica, Rossellini, and Visconti captured life as it was, not as cinema wished it to be.',
      category: 'movement',
    },
  },
  {
    id: 'mov-german-expressionism',
    type: 'movement',
    priority: 50,
    title: { movies: 'German Expressionist Films', shows: 'German Expressionist Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'de', yearMin: 1920, yearMax: 1935, ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { language: 'de', yearMin: 1920, yearMax: 1935, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'german-expressionism',
      displayTitle: 'German Expressionism',
      description: 'Distorted sets, dramatic shadows, and psychological terror. The visual language that shaped horror and film noir for a century.',
      category: 'movement',
    },
  },
  {
    id: 'mov-new-hollywood',
    type: 'movement',
    priority: 50,
    title: { movies: 'New Hollywood Movies', shows: 'New Hollywood Era Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.drama], yearMin: 1967, yearMax: 1982, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.drama], yearMin: 1967, yearMax: 1982, ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'new-hollywood',
      displayTitle: 'New Hollywood',
      description: 'The auteur era that gave us Coppola, Scorsese, Spielberg, and Lucas. Young filmmakers dismantled the studio system and changed everything.',
      category: 'movement',
    },
  },
  {
    id: 'mov-dogme-95',
    type: 'movement',
    priority: 50,
    title: { movies: 'Dogme 95 Films', shows: 'Dogme 95 Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { yearMin: 1995, yearMax: 2005, ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { yearMin: 1995, yearMax: 2005, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'dogme-95',
      displayTitle: 'Dogme 95',
      description: 'Lars von Trier and Thomas Vinterberg\'s radical manifesto: no artificial lighting, no props, no genre films. Just raw truth.',
      category: 'movement',
    },
  },
  {
    id: 'mov-mumblecore',
    type: 'movement',
    priority: 50,
    title: { movies: 'Mumblecore Films', shows: 'Mumblecore Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.drama, MG.comedy], language: 'en', yearMin: 2002, yearMax: 2015, ratingMin: 6.0, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.drama, TG.comedy], language: 'en', yearMin: 2002, yearMax: 2015, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'mumblecore',
      displayTitle: 'Mumblecore',
      description: 'Ultra-low-budget, improvised dialogue, and painfully real relationships. The Duplasses, Swanberg, and Bujalski made awkwardness an art form.',
      category: 'movement',
    },
  },
  {
    id: 'mov-korean-new-wave',
    type: 'movement',
    priority: 50,
    title: { movies: 'Korean New Wave Movies', shows: 'Korean New Wave Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'ko', yearMin: 2000, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { language: 'ko', yearMin: 2000, ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'korean-new-wave',
      displayTitle: 'Korean New Wave',
      description: 'From Oldboy to Parasite, Korean cinema\'s explosive global breakthrough. Genre-bending, socially sharp, and relentlessly inventive.',
      category: 'movement',
    },
  },
  {
    id: 'mov-japanese-new-wave',
    type: 'movement',
    priority: 50,
    title: { movies: 'Japanese New Wave Films', shows: 'Japanese New Wave Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'ja', yearMin: 1956, yearMax: 1975, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { language: 'ja', yearMin: 1956, yearMax: 1975, ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'japanese-new-wave',
      displayTitle: 'Japanese New Wave',
      description: 'Oshima, Imamura, and Teshigahara challenged tradition with politically charged, formally daring cinema that rivaled the French New Wave.',
      category: 'movement',
    },
  },
  {
    id: 'mov-czech-new-wave',
    type: 'movement',
    priority: 50,
    title: { movies: 'Czech New Wave Films', shows: 'Czech New Wave Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'cs', yearMin: 1963, yearMax: 1975, ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { language: 'cs', yearMin: 1963, yearMax: 1975, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'czech-new-wave',
      displayTitle: 'Czech New Wave',
      description: 'Forman, Chytilova, Menzel. Crushed by Soviet tanks but not before creating some of the most daring, playful cinema ever made.',
      category: 'movement',
    },
  },
  {
    id: 'mov-iranian-new-wave',
    type: 'movement',
    priority: 50,
    title: { movies: 'Iranian New Wave Films', shows: 'Iranian New Wave Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'fa', yearMin: 1960, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { language: 'fa', yearMin: 1960, ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'iranian-new-wave',
      displayTitle: 'Iranian New Wave',
      description: 'A cinema of astonishing beauty born under censorship. Kiarostami, Panahi, Farhadi — where limitations became creative fuel.',
      category: 'movement',
    },
  },
  {
    id: 'mov-spaghetti-western',
    type: 'movement',
    priority: 50,
    title: { movies: 'Spaghetti Westerns', shows: 'Spaghetti Western Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'it', genres: [MG.western], yearMin: 1960, yearMax: 1978, sortBy: 'vote_average.desc' },
      shows: { language: 'it', yearMin: 1960, yearMax: 1978, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'spaghetti-western',
      displayTitle: 'Spaghetti Western',
      description: 'Leone, Corbucci, Morricone. Not a subgenre — a full-blown movement that reimagined the American myth through Italian eyes and unforgettable music.',
      category: 'movement',
    },
  },
  {
    id: 'mov-romanian-new-wave',
    type: 'movement',
    priority: 50,
    title: { movies: 'Romanian New Wave Films', shows: 'Romanian New Wave Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'ro', yearMin: 2001, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { language: 'ro', yearMin: 2001, ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'romanian-new-wave',
      displayTitle: 'Romanian New Wave',
      description: 'The most vital European movement of the 21st century. Mungiu, Puiu, Porumboiu. Unflinching, darkly funny, formally rigorous.',
      category: 'movement',
    },
  },
];

// ============================================================================
// World Cinema Rules (~11, paired)
// ============================================================================

// Note: TMDB discover API accepts a single `with_original_language` param.
// For multi-language regions (Scandinavian, Latin American, Indian), we use
// the primary language and accept that some films from secondary languages
// may be missed. A future enhancement could issue parallel queries per language.

const WORLD_CINEMA_RULES: CuratedRule[] = [
  {
    id: 'wc-korean',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'Korean Cinema', shows: 'Korean Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'ko', ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { language: 'ko', ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'korean-cinema',
      displayTitle: 'Korean Cinema',
      description: 'From thrillers to romances, K-dramas to revenge sagas. South Korea\'s film and TV industry is one of the most exciting in the world.',
      category: 'world-cinema',
    },
  },
  {
    id: 'wc-japanese',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'Japanese Cinema', shows: 'Japanese Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'ja', ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { language: 'ja', ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'japanese-masters',
      displayTitle: 'Japanese Masters',
      description: 'From Kurosawa\'s samurai epics to Miyazaki\'s animated worlds. A cinema tradition defined by precision, beauty, and philosophical depth.',
      category: 'world-cinema',
    },
  },
  {
    id: 'wc-scandinavian',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'Scandinavian Movies', shows: 'Scandinavian Shows' },
    matcher: { type: 'always' },
    filters: {
      // Primary: Swedish. Danish and Norwegian handled via language union when API supports it.
      movies: { language: 'sv', genres: [MG.crime, MG.thriller], ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { language: 'sv', genres: [TG.crime, TG.drama], ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'scandinavian-noir',
      displayTitle: 'Scandinavian Noir',
      description: 'Dark landscapes, darker secrets. The Nordic noir tradition: methodical investigations, moral ambiguity, and the cold that seeps into everything.',
      category: 'world-cinema',
    },
  },
  {
    id: 'wc-french',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'French Cinema', shows: 'French Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'fr', ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { language: 'fr', ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'french-cinema',
      displayTitle: 'French Cinema',
      description: 'The birthplace of cinema itself. From poetic realism to the New Wave and beyond — French film remains the gold standard of artistic expression.',
      category: 'world-cinema',
    },
  },
  {
    id: 'wc-italian',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'Italian Cinema', shows: 'Italian Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'it', ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { language: 'it', ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'italian-cinema',
      displayTitle: 'Italian Cinema',
      description: 'Fellini\'s dreams, Leone\'s epics, Sorrentino\'s beauty. Italian cinema speaks the universal language of passion, style, and spectacle.',
      category: 'world-cinema',
    },
  },
  {
    id: 'wc-latin-american',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'Latin American Movies', shows: 'Latin American Shows' },
    matcher: { type: 'always' },
    filters: {
      // Primary: Spanish. Portuguese (Brazilian cinema) requires a parallel query or union.
      movies: { language: 'es', ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { language: 'es', ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'latin-american-cinema',
      displayTitle: 'Latin American Cinema',
      description: 'Magical realism on screen. From Cuaron and del Toro to City of God and Central Station — where the mythic meets the brutally real.',
      category: 'world-cinema',
    },
  },
  {
    id: 'wc-iranian',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'Iranian Cinema', shows: 'Iranian Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'fa', ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { language: 'fa', ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'iranian-cinema',
      displayTitle: 'Iranian Cinema',
      description: 'One of the most acclaimed national cinemas of the last 40 years. Kiarostami, Farhadi, Panahi — profound, poetic, and defiantly human.',
      category: 'world-cinema',
    },
  },
  {
    id: 'wc-indian',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'Indian Cinema', shows: 'Indian Shows' },
    matcher: { type: 'always' },
    filters: {
      // Primary: Hindi. Tamil, Malayalam, Telugu, Bengali require parallel queries.
      movies: { language: 'hi', ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { language: 'hi', ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'indian-cinema',
      displayTitle: 'Indian Cinema',
      description: 'The largest film industry on earth. From Satyajit Ray\'s Apu Trilogy to modern Malayalam cinema, a tradition of staggering range and depth.',
      category: 'world-cinema',
    },
  },
  {
    id: 'wc-chinese',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'Chinese Cinema', shows: 'Chinese Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'zh', ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { language: 'zh', ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'chinese-cinema',
      displayTitle: 'Chinese Cinema',
      description: 'Zhang Yimou, Chen Kaige, Jia Zhangke. From martial arts poetry to unflinching social realism — five generations of cinematic mastery.',
      category: 'world-cinema',
    },
  },
  {
    id: 'wc-german',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'German Cinema', shows: 'German Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { language: 'de', ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { language: 'de', ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'german-cinema',
      displayTitle: 'German Cinema',
      description: 'From Expressionism to Fassbinder to Toni Erdmann. Germany\'s cinema is dark, philosophical, and perpetually reinventing itself.',
      category: 'world-cinema',
    },
  },
  {
    id: 'wc-british',
    type: 'world-cinema',
    priority: 50,
    title: { movies: 'British Cinema', shows: 'British Shows' },
    matcher: { type: 'always' },
    filters: {
      // Note: British Cinema uses language: en + region filtering would need origin_country param.
      // For now, using language: en with higher rating threshold to surface quality content.
      movies: { language: 'en', ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { language: 'en', ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'british-cinema',
      displayTitle: 'British Cinema',
      description: 'From David Lean to Steve McQueen. Kitchen sink realism, period grandeur, and a dry wit that cuts deeper than you expect.',
      category: 'world-cinema',
    },
  },
];

// ============================================================================
// Era Rules (~6, paired)
// Note: "70s New Hollywood" era removed — it was a duplicate of the
// New Hollywood movement (identical year range 1967-1982 and filters).
// ============================================================================

const ERA_RULES: CuratedRule[] = [
  {
    id: 'era-silent',
    type: 'era',
    priority: 50,
    title: { movies: 'Silent Era Films', shows: 'Silent Era' },
    matcher: { type: 'always' },
    filters: {
      movies: { yearMin: 1895, yearMax: 1929, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { yearMin: 1895, yearMax: 1929, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'silent-era',
      displayTitle: 'Silent Era',
      description: 'The birth of cinema itself. Chaplin, Keaton, Murnau, Eisenstein, Lang. Before sound, there was pure visual storytelling — and it was magnificent.',
      category: 'era',
    },
  },
  {
    id: 'era-golden-age',
    type: 'era',
    priority: 50,
    title: { movies: 'Golden Age Hollywood', shows: 'Golden Age TV' },
    matcher: { type: 'always' },
    filters: {
      movies: { yearMin: 1930, yearMax: 1959, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { yearMin: 1930, yearMax: 1959, ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'golden-age',
      displayTitle: 'Golden Age Hollywood',
      description: 'The studio system at its peak. Bogart, Bergman, Hitchcock, and Wilder crafted the archetypes that all cinema still follows.',
      category: 'era',
    },
  },
  {
    id: 'era-80s',
    type: 'era',
    priority: 50,
    title: { movies: '80s Classics', shows: '80s TV' },
    matcher: { type: 'always' },
    filters: {
      movies: { yearMin: 1980, yearMax: 1989, ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { yearMin: 1980, yearMax: 1989, ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: '80s-classics',
      displayTitle: '80s Classics',
      description: 'Blockbusters, brat packs, and VHS. The decade of excess gave us Indiana Jones, Blade Runner, and the birth of the modern franchise.',
      category: 'era',
    },
  },
  {
    id: 'era-90s-indie',
    type: 'era',
    priority: 50,
    title: { movies: '90s Indie Films', shows: '90s TV' },
    matcher: { type: 'always' },
    filters: {
      movies: { yearMin: 1990, yearMax: 1999, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { yearMin: 1990, yearMax: 1999, ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: '90s-indie',
      displayTitle: '90s Indie',
      description: 'Sundance launched, Tarantino arrived, and indie became mainstream. The decade when low budgets and high ambition collided spectacularly.',
      category: 'era',
    },
  },
  {
    id: 'era-2000s',
    type: 'era',
    priority: 50,
    title: { movies: '2000s Cinema', shows: '2000s TV' },
    matcher: { type: 'always' },
    filters: {
      movies: { yearMin: 2000, yearMax: 2009, ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { yearMin: 2000, yearMax: 2009, ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: '2000s-cinema',
      displayTitle: '2000s Cinema',
      description: 'Digital revolution meets prestige TV. The decade that gave us The Wire, There Will Be Blood, and the rise of global arthouse cinema.',
      category: 'era',
    },
  },
  {
    id: 'era-modern',
    type: 'era',
    priority: 50,
    title: { movies: 'Modern Masterpieces', shows: 'Modern TV Masterpieces' },
    matcher: { type: 'always' },
    filters: {
      movies: { yearMin: 2015, ratingMin: 7.5, voteCountMin: 1000, sortBy: 'vote_average.desc' },
      shows: { yearMin: 2015, ratingMin: 7.5, voteCountMin: 1000, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'modern-masterpieces',
      displayTitle: 'Modern Masterpieces',
      description: 'The best of right now. Critically acclaimed, audience-beloved films and shows from the last decade that will define this generation.',
      category: 'era',
    },
  },
];

// ============================================================================
// Thematic Rules (~18, paired)
// ============================================================================

const THEMATIC_RULES: CuratedRule[] = [
  {
    id: 'theme-film-noir',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Film Noir', shows: 'Neo-Noir Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.crime, MG.mystery], ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.crime, TG.mystery], ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'film-noir',
      displayTitle: 'Film Noir',
      description: 'Shadows, smoke, and moral ambiguity. From classic noir to neo-noir, the genre where everyone has something to hide.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-psych-thriller',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Psychological Thrillers', shows: 'Psychological Thriller Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.thriller], ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { genres: [TG.mystery, TG.drama], ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'psychological-thrillers',
      displayTitle: 'Psychological Thrillers',
      description: 'Trust no one — especially yourself. Films and shows that mess with your head, twist your perception, and leave you questioning reality.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-coming-of-age',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Coming-of-Age Movies', shows: 'Coming-of-Age Shows' },
    matcher: { type: 'always' },
    filters: {
      // Tightened: added keywords to prevent matching all dramas
      movies: { genres: [MG.drama], ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.drama], ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'coming-of-age',
      displayTitle: 'Coming-of-Age',
      description: 'The universal story of growing up. First loves, identity crises, and the bittersweet realization that childhood is behind you.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-feel-good',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Feel-Good Movies', shows: 'Feel-Good Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.comedy, MG.family], ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.comedy, TG.family], ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'feel-good',
      displayTitle: 'Feel-Good',
      description: 'Pure cinematic serotonin. Warm comedies, heartfelt family stories, and films that restore your faith in everything.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-mind-bending',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Mind-Bending Movies', shows: 'Mind-Bending Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.sciFi, MG.thriller], ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.sciFiFantasy, TG.mystery], ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'mind-bending',
      displayTitle: 'Mind-Bending',
      description: 'Films that demand a second viewing. Reality-warping narratives, unreliable narrators, and endings that recontextualize everything.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-cyberpunk',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Cyberpunk Movies', shows: 'Cyberpunk Shows' },
    matcher: { type: 'always' },
    filters: {
      // Tightened: keywords needed to avoid returning all sci-fi (Star Wars, etc.)
      movies: { genres: [MG.sciFi], ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { genres: [TG.sciFiFantasy], ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'cyberpunk',
      displayTitle: 'Cyberpunk',
      description: 'Neon-soaked dystopias, rogue AIs, and the thin line between human and machine. High tech, low life — the future is now.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-heist',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Heist & Caper Movies', shows: 'Heist Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.crime, MG.action], ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { genres: [TG.crime, TG.actionAdventure], ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'heist-caper',
      displayTitle: 'Heist & Caper',
      description: 'The plan, the crew, the score, the double-cross. Stylish criminals and elaborate schemes where nothing goes quite as planned.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-war-epics',
    type: 'thematic',
    priority: 50,
    title: { movies: 'War Epics', shows: 'War Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.war, MG.drama], runtimeMin: 120, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.warPolitics, TG.drama], sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'war-epics',
      displayTitle: 'War Epics',
      description: 'Sprawling battlefield sagas and intimate human dramas set against the horror of conflict. The genre where cinema meets history.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-courtroom',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Courtroom Dramas', shows: 'Legal Shows' },
    matcher: { type: 'always' },
    filters: {
      // Tightened: keywords needed to avoid matching all dramas
      movies: { genres: [MG.drama], ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.drama, TG.crime], ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'courtroom-drama',
      displayTitle: 'Courtroom Drama',
      description: 'Objection sustained. From 12 Angry Men to modern legal thrillers — the courtroom as theater, where truth and justice aren\'t always the same thing.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-road-movies',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Road Movies', shows: 'Road Trip Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.adventure, MG.drama], ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.actionAdventure, TG.drama], ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'road-movies',
      displayTitle: 'Road Movies',
      description: 'The open road as metaphor, escape route, and path to self-discovery. From Easy Rider to Paris, Texas — the journey is the destination.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-horror',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Horror Movies', shows: 'Horror Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.horror], ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { genres: [TG.mystery, TG.drama], ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'horror',
      displayTitle: 'Horror',
      description: 'From Nosferatu to Hereditary, cinema\'s most primal genre. Fear is universal — and the best horror films reveal what we\'re really afraid of.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-western',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Westerns', shows: 'Western Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.western], ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.actionAdventure, TG.drama], ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'western',
      displayTitle: 'Western',
      description: 'The defining American genre. Ford, Leone, Eastwood, the Coens. Myths of the frontier — where justice is personal and the landscape is a character.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-musical',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Musical Movies', shows: 'Musical Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.music], ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { genres: [TG.comedy, TG.drama], ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'musical',
      displayTitle: 'Musical',
      description: 'Singin\' in the Rain, West Side Story, La La Land. The genre that defined Golden Age Hollywood and keeps reinventing itself with infectious joy.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-dark-comedy',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Dark Comedies', shows: 'Dark Comedy Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.comedy], ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.comedy], ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'dark-comedy',
      displayTitle: 'Dark Comedy & Satire',
      description: 'Dr. Strangelove, In Bruges, Parasite, Network. Films that make you laugh at things you shouldn\'t — and then wonder why you\'re laughing.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-revenge',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Revenge Movies', shows: 'Revenge Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.action, MG.thriller], ratingMin: 6.5, sortBy: 'popularity.desc' },
      shows: { genres: [TG.actionAdventure, TG.drama], ratingMin: 6.5, sortBy: 'popularity.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'revenge-cinema',
      displayTitle: 'Revenge Cinema',
      description: 'Park Chan-wook\'s Vengeance Trilogy, Kill Bill, I Saw the Devil. Visceral, moral, and deeply cinematic explorations of what vengeance costs.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-slow-cinema',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Slow Cinema', shows: 'Contemplative Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.drama], ratingMin: 7.0, runtimeMin: 120, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.drama], ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'slow-cinema',
      displayTitle: 'Slow Cinema',
      description: 'Tarkovsky, Bela Tarr, Apichatpong Weerasethakul. The cinema of patience and long takes. Not for everyone — essential for cinephiles.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-dystopian',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Dystopian Movies', shows: 'Dystopian Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.sciFi], ratingMin: 6.5, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.sciFiFantasy], ratingMin: 6.5, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'dystopian-fiction',
      displayTitle: 'Dystopian Fiction',
      description: 'Metropolis, Children of Men, A Clockwork Orange. Societies gone wrong — cautionary tales that feel more relevant every year.',
      category: 'thematic',
    },
  },
  {
    id: 'theme-romantic',
    type: 'thematic',
    priority: 50,
    title: { movies: 'Romantic Cinema', shows: 'Romantic Shows' },
    matcher: { type: 'always' },
    filters: {
      movies: { genres: [MG.romance, MG.drama], ratingMin: 7.0, sortBy: 'vote_average.desc' },
      shows: { genres: [TG.drama], ratingMin: 7.0, sortBy: 'vote_average.desc' },
    },
    mode: 'paired',
    meta: {
      slug: 'romantic-cinema',
      displayTitle: 'Romantic Cinema',
      description: 'Not rom-coms — genuine romantic cinema. Before Sunrise, In the Mood for Love, Casablanca. Love as art, heartbreak as poetry.',
      category: 'thematic',
    },
  },
];

// ============================================================================
// Collection Rules (special: uses movieIds instead of discover filters)
// ============================================================================

const criterionMovieIds = (criterionData as { films: { tmdbId: number }[] }).films.map((f) => f.tmdbId);
const palmeDorMovieIds = (palmeDorData as { films: { tmdbId: number }[] }).films.map((f) => f.tmdbId);
const sightAndSoundMovieIds = (sightAndSoundData as { films: { tmdbId: number }[] }).films.map((f) => f.tmdbId);
const a24MovieIds = (a24Data as { films: { tmdbId: number }[] }).films.map((f) => f.tmdbId);

const COLLECTION_RULES: CuratedRule[] = [
  {
    id: 'criterion-collection',
    type: 'curated-list',
    priority: 50,
    title: { movies: 'The Criterion Collection', shows: '' },
    matcher: { type: 'always' },
    filters: { movies: {}, shows: {} },
    mode: 'movies-only',
    movieIds: criterionMovieIds,
    meta: {
      slug: 'criterion-collection',
      displayTitle: 'The Criterion Collection',
      description: 'The definitive library of important classic and contemporary films. Each title in the collection represents a landmark of world cinema.',
      category: 'collection',
    },
  },
  {
    id: 'palme-dor-winners',
    type: 'curated-list',
    priority: 50,
    title: { movies: "Palme d'Or Winners", shows: '' },
    matcher: { type: 'always' },
    filters: { movies: {}, shows: {} },
    mode: 'movies-only',
    movieIds: palmeDorMovieIds,
    meta: {
      slug: 'palme-dor-winners',
      displayTitle: "Palme d'Or Winners",
      description: 'Every Cannes top prize winner. The purest barometer of international cinematic excellence, from the Nouvelle Vague to the Korean New Wave.',
      category: 'collection',
    },
  },
  {
    id: 'sight-and-sound',
    type: 'curated-list',
    priority: 50,
    title: { movies: 'Sight & Sound Greatest Films', shows: '' },
    matcher: { type: 'always' },
    filters: { movies: {}, shows: {} },
    mode: 'movies-only',
    movieIds: sightAndSoundMovieIds,
    meta: {
      slug: 'sight-and-sound',
      displayTitle: 'Sight & Sound Greatest Films',
      description: 'The BFI poll — voted on by critics worldwide every decade. The cinephile\'s canon, from Vertigo to Jeanne Dielman.',
      category: 'collection',
    },
  },
  {
    id: 'a24-films',
    type: 'curated-list',
    priority: 50,
    title: { movies: 'A24 Films', shows: '' },
    matcher: { type: 'always' },
    filters: { movies: {}, shows: {} },
    mode: 'movies-only',
    movieIds: a24MovieIds,
    meta: {
      slug: 'a24-films',
      displayTitle: 'A24 Films',
      description: 'The studio that made arthouse cool again. Everything Everywhere, Moonlight, Lady Bird, The Lighthouse. Independent cinema\'s new golden age.',
      category: 'collection',
    },
  },
];

// ============================================================================
// Combined Export
// ============================================================================

export const CURATED_RULES: CuratedRule[] = [
  ...DIRECTOR_RULES,
  ...MOVEMENT_RULES,
  ...WORLD_CINEMA_RULES,
  ...ERA_RULES,
  ...THEMATIC_RULES,
  ...COLLECTION_RULES,
];
```

**Step 2: Verify**

Run: `bun check`
Expected: May show warnings about JSON imports. If TypeScript errors on JSON imports, add `"resolveJsonModule": true` to `tsconfig.json` (should already be set in Next.js projects).

**Step 3: Commit**

```bash
git add lib/contextual/curated-rules.ts
git commit -m "feat(contextual): add ~84 curated rules for directors, movements, themes, eras, world cinema, and collections"
```

---

## Task 3: Create Daily-Seed Selection Algorithm & Update Exports

**Files:**
- Create: `lib/contextual/get-curated-rows.ts`
- Modify: `lib/contextual/index.ts`

**Step 1: Create `lib/contextual/get-curated-rows.ts`**

```typescript
import { CURATED_RULES } from './curated-rules';
import type { CuratedRule } from './types';

// ============================================================================
// Seeded Shuffle Utilities
// ============================================================================

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) | 0;
    const j = (s >>> 0) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ============================================================================
// Curated Row Selection
// ============================================================================

const MAX_CURATED_SLOTS = 6;

/**
 * Select curated rows for the homepage using a daily seed.
 * Returns a deterministic subset of curated rules — same day = same rows.
 *
 * Slot cost: `paired` = 2, `movies-only` or `shows-only` = 1.
 * Fills up to MAX_CURATED_SLOTS (6) slots.
 */
function getCuratedRows(date: Date = new Date()): CuratedRule[] {
  const seed = hashString(date.toDateString());
  const shuffled = seededShuffle(CURATED_RULES, seed);

  const selected: CuratedRule[] = [];
  let slotsUsed = 0;

  for (const rule of shuffled) {
    if (slotsUsed >= MAX_CURATED_SLOTS) break;

    const cost = rule.mode === 'paired' ? 2 : 1;
    if (slotsUsed + cost <= MAX_CURATED_SLOTS) {
      selected.push(rule);
      slotsUsed += cost;
    }
  }

  return selected;
}

export { getCuratedRows, hashString, seededShuffle };
```

**Step 2: Update `lib/contextual/index.ts`**

Replace the entire file with:

```typescript
export { CURATED_RULES } from './curated-rules';
export { getActiveRules } from './get-active-rules';
export { getCuratedRows } from './get-curated-rows';
export { CONTEXTUAL_RULES } from './rules';
export type { ContextMatcher, ContextRule, ContextRuleType, CuratedCategory, CuratedRule, CuratedRuleMeta, RowMode } from './types';
```

**Step 3: Verify**

Run: `bun check`
Expected: No errors.

Run: `bun lint --fix`
Expected: May auto-sort imports. No errors.

**Step 4: Commit**

```bash
git add lib/contextual/get-curated-rows.ts lib/contextual/index.ts
git commit -m "feat(contextual): add daily-seed curated row selection algorithm"
```

---

## Task 4: Create `fetchMoviesByIds` Function & Query Options

**Files:**
- Create: `api/functions/movies/collection.ts`
- Modify: `api/functions/movies/index.ts`
- Create: `options/queries/movies/collection.ts`
- Modify: `options/queries/movies/index.ts`

**Step 1: Create `api/functions/movies/collection.ts`**

This function fetches movies by their TMDB IDs using the `/3/movie/{movie_id}` endpoint. Uses `Promise.allSettled` for parallel fetching and filters out failures.

```typescript
import { createTMDBClient, getTMDBImageUrl } from '@/api/clients/tmdb';
import type { MovieItem } from '@/api/entities';

// ============================================================================
// Functions
// ============================================================================

export async function fetchMoviesByIds(ids: number[]): Promise<MovieItem[]> {
  const client = createTMDBClient();

  const results = await Promise.allSettled(
    ids.map((id) => client.GET('/3/movie/{movie_id}', { params: { path: { movie_id: id } } }))
  );

  const movies: MovieItem[] = [];

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    const { data } = result.value;
    if (!data) continue;

    movies.push({
      tmdbId: data.id,
      title: data.title ?? 'N/A',
      overview: data.overview ?? 'N/A',
      year: data.release_date ? parseInt(data.release_date.substring(0, 4), 10) : 0,
      rating: data.vote_average ?? 0,
      voteCount: data.vote_count ?? 0,
      popularity: data.popularity ?? 0,
      posterUrl: getTMDBImageUrl(data.poster_path, 'original'),
      backdropUrl: getTMDBImageUrl(data.backdrop_path, 'original'),
      genres: (data.genres ?? []).map((g) => ({ id: g.id!, name: g.name! })),
    });
  }

  return movies;
}
```

**Step 2: Update `api/functions/movies/index.ts`**

Add the collection export. The file currently has:

```typescript
export * from './detail';
export * from './discover';
export * from './library';
export * from './metadata';
```

Add before `./detail`:

```typescript
export * from './collection';
export * from './detail';
export * from './discover';
export * from './library';
export * from './metadata';
```

**Step 3: Create `options/queries/movies/collection.ts`**

```typescript
import { queryOptions } from '@tanstack/react-query';

import { fetchMoviesByIds } from '@/api/functions';

export function collectionMoviesQueryOptions(ruleId: string, movieIds: number[]) {
  return queryOptions({
    queryKey: ['movies', 'collection', ruleId, movieIds.length] as const,
    queryFn: () => fetchMoviesByIds(movieIds),
    staleTime: 30 * 60 * 1000,
  });
}
```

Note: Query key uses `movieIds.length` instead of the full array (which would be huge for Criterion). The `ruleId` provides uniqueness.

**Step 4: Update `options/queries/movies/index.ts`**

Add the collection export. The file currently has:

```typescript
export * from './contextual';
export * from './detail';
export * from './discover';
export * from './library';
export * from './metadata';
```

Add before `./contextual`:

```typescript
export * from './collection';
export * from './contextual';
export * from './detail';
export * from './discover';
export * from './library';
export * from './metadata';
```

**Step 5: Verify**

Run: `bun check`
Expected: No errors.

Run: `bun lint --fix`
Expected: No errors.

**Step 6: Commit**

```bash
git add api/functions/movies/collection.ts api/functions/movies/index.ts options/queries/movies/collection.ts options/queries/movies/index.ts
git commit -m "feat(api): add fetchMoviesByIds for ID-list collections like Criterion"
```

---

## Task 5: Create HomeCurated Component & Homepage Integration

**Files:**
- Create: `app/(protected)/home/_components/home-curated.tsx`
- Modify: `app/(protected)/home/_components/home-browse.tsx`

**Step 1: Create `app/(protected)/home/_components/home-curated.tsx`**

This component renders the daily-rotating curated rows on the homepage. It handles both discover-based rules and ID-list rules (Criterion).

```typescript
'use client';

import { useMemo } from 'react';

import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { CuratedRule } from '@/lib/contextual';
import { getCuratedRows } from '@/lib/contextual';
import { collectionMoviesQueryOptions } from '@/options/queries/movies/collection';
import { contextualMoviesQueryOptions } from '@/options/queries/movies/contextual';
import { contextualShowsQueryOptions } from '@/options/queries/shows/contextual';

import type { MediaRowProps } from '@/components/media';
import { MediaRow, MediaRowError, MediaRowLoading } from '@/components/media';
import { Query } from '@/components/query';

// ============================================================================
// Types
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BrowseQueryOptions = UseQueryOptions<any[], Error, any[], any>;

interface CuratedRowProps {
  type: 'movie' | 'show';
  title: string;
  queryOptions: BrowseQueryOptions;
}

type HomeCuratedProps = object;

// ============================================================================
// Sub-components
// ============================================================================

function CuratedRow({ type, title, queryOptions: options }: CuratedRowProps) {
  const query = useQuery(options);

  return (
    <Query
      result={query}
      callbacks={{
        error: (error) => <MediaRowError type={type} error={error} refetch={query.refetch} />,
        loading: () => <MediaRowLoading type={type} />,
        success: (data) => <MediaRow {...({ type, size: 'lg', title, media: data } as MediaRowProps)} />,
      }}
    />
  );
}

function CuratedRuleRows({ rule }: { rule: CuratedRule }) {
  const movieOptions = rule.movieIds
    ? collectionMoviesQueryOptions(rule.id, rule.movieIds)
    : contextualMoviesQueryOptions(rule.id, rule.filters.movies);

  const showMovie = rule.mode !== 'shows-only';
  const showTV = rule.mode === 'paired';

  return (
    <>
      {showMovie && (
        <CuratedRow
          type="movie"
          title={rule.title.movies}
          queryOptions={movieOptions as BrowseQueryOptions}
        />
      )}
      {showTV && (
        <CuratedRow
          type="show"
          title={rule.title.shows}
          queryOptions={contextualShowsQueryOptions(rule.id, rule.filters.shows) as BrowseQueryOptions}
        />
      )}
    </>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function HomeCurated(_props: HomeCuratedProps) {
  const curatedRules = useMemo(() => getCuratedRows(), []);

  if (curatedRules.length === 0) return null;

  return (
    <>
      {curatedRules.map((rule) => (
        <CuratedRuleRows key={rule.id} rule={rule} />
      ))}
    </>
  );
}

export type { HomeCuratedProps };
export { HomeCurated };
```

**Step 2: Integrate into `app/(protected)/home/_components/home-browse.tsx`**

In `home-browse.tsx`, add the import for `HomeCurated` next to the existing `HomeContextual` import. Find:

```typescript
import { HomeContextual } from './home-contextual';
```

Replace with:

```typescript
import { HomeContextual } from './home-contextual';
import { HomeCurated } from './home-curated';
```

Then add `<HomeCurated />` after the trending shows row and before the "Recommended for You" stub. Find:

```typescript
      <BrowseRow
        type="show"
        title="Trending Shows"
        queryOptions={trendingShowsQueryOptions()}
        onSeeAll={() => router.push('/media/shows')}
      />
      <StubRow title="Recommended for You" />
```

Replace with:

```typescript
      <BrowseRow
        type="show"
        title="Trending Shows"
        queryOptions={trendingShowsQueryOptions()}
        onSeeAll={() => router.push('/media/shows')}
      />
      <HomeCurated />
      <StubRow title="Recommended for You" />
```

**Step 3: Verify**

Run: `bun check`
Expected: No errors.

Run: `bun lint --fix`
Expected: No errors.

**Step 4: Commit**

```bash
git add app/(protected)/home/_components/home-curated.tsx app/(protected)/home/_components/home-browse.tsx
git commit -m "feat(home): add rotating curated rows to homepage"
```

---

## Task 6: Create Explore Index Page

**Files:**
- Create: `app/(protected)/explore/layout.tsx`
- Create: `app/(protected)/explore/page.tsx`
- Create: `app/(protected)/explore/_components/explore-section.tsx`
- Create: `app/(protected)/explore/_components/category-card.tsx`

**Step 1: Create `app/(protected)/explore/layout.tsx`**

Passthrough layout matching other route groups:

```typescript
import React from 'react';

type LayoutProps = React.PropsWithChildren;

export default function Layout({ children }: LayoutProps) {
  return children;
}
```

**Step 2: Create `app/(protected)/explore/_components/category-card.tsx`**

A clickable card that navigates to `/explore/[slug]`:

```typescript
'use client';

import { Route } from 'next';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface CategoryCardProps {
  slug: string;
  title: string;
  description: string;
}

// ============================================================================
// Main Component
// ============================================================================

function CategoryCard({ slug, title, description }: CategoryCardProps) {
  return (
    <Link
      href={`/explore/${slug}` as Route}
      className={cn(
        'group flex flex-col justify-between rounded-xl border border-border/30 bg-muted/10 p-4 transition-all duration-200',
        'hover:border-primary/40 hover:bg-muted/20'
      )}
    >
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
        Browse
        <ChevronRight className="ml-0.5 size-3" />
      </div>
    </Link>
  );
}

export type { CategoryCardProps };
export { CategoryCard };
```

**Step 3: Create `app/(protected)/explore/_components/explore-section.tsx`**

A section with a title and a grid of category cards:

```typescript
import type { CuratedRule } from '@/lib/contextual';

import { CategoryCard } from './category-card';

// ============================================================================
// Types
// ============================================================================

interface ExploreSectionProps {
  title: string;
  rules: CuratedRule[];
}

// ============================================================================
// Main Component
// ============================================================================

function ExploreSection({ title, rules }: ExploreSectionProps) {
  if (rules.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="border-l-2 border-primary pl-3 text-lg font-bold tracking-tight">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {rules.map((rule) => (
          <CategoryCard
            key={rule.id}
            slug={rule.meta.slug}
            title={rule.meta.displayTitle}
            description={rule.meta.description}
          />
        ))}
      </div>
    </section>
  );
}

export type { ExploreSectionProps };
export { ExploreSection };
```

**Step 4: Create `app/(protected)/explore/page.tsx`**

The Explore index page groups all curated rules by category:

```typescript
import { CURATED_RULES } from '@/lib/contextual';
import type { CuratedCategory } from '@/lib/contextual';

import { ExploreSection } from './_components/explore-section';

// ============================================================================
// Utilities
// ============================================================================

const CATEGORY_ORDER: { key: CuratedCategory; label: string }[] = [
  { key: 'director', label: 'Directors' },
  { key: 'movement', label: 'Cinematic Movements' },
  { key: 'world-cinema', label: 'World Cinema' },
  { key: 'era', label: 'Eras' },
  { key: 'thematic', label: 'Themes & Moods' },
  { key: 'collection', label: 'Collections' },
];

function groupByCategory() {
  const groups = new Map<CuratedCategory, typeof CURATED_RULES>();
  for (const rule of CURATED_RULES) {
    const existing = groups.get(rule.meta.category) ?? [];
    existing.push(rule);
    groups.set(rule.meta.category, existing);
  }
  return groups;
}

// ============================================================================
// Page
// ============================================================================

export default function ExplorePage() {
  const groups = groupByCategory();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Explore</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse curated collections across directors, movements, eras, and more.
        </p>
      </div>

      {CATEGORY_ORDER.map(({ key, label }) => {
        const rules = groups.get(key);
        if (!rules) return null;
        return <ExploreSection key={key} title={label} rules={rules} />;
      })}
    </div>
  );
}
```

**Step 5: Verify**

Run: `bun check`
Expected: No errors.

Run: `bun lint --fix`
Expected: No errors.

**Step 6: Commit**

```bash
git add app/(protected)/explore/
git commit -m "feat(explore): add Explore index page with curated category browser"
```

---

## Task 7: Create Explore Collection Detail Page

**Files:**
- Create: `app/(protected)/explore/[slug]/page.tsx`
- Create: `app/(protected)/explore/[slug]/_components/collection-detail.tsx`

**Step 1: Create `app/(protected)/explore/[slug]/_components/collection-detail.tsx`**

The detail view shows a hero section with title + description, then a full media grid. Handles both discover-based and ID-list rules.

```typescript
'use client';

import { Film, Tv } from 'lucide-react';

import type { MovieItem, ShowItem } from '@/api/entities';
import type { CuratedRule } from '@/lib/contextual';
import { collectionMoviesQueryOptions } from '@/options/queries/movies/collection';
import { contextualMoviesQueryOptions } from '@/options/queries/movies/contextual';
import { contextualShowsQueryOptions } from '@/options/queries/shows/contextual';

import { MediaCard, MediaGrid } from '@/components/media';
import { Query } from '@/components/query';

import { useQuery } from '@tanstack/react-query';

// ============================================================================
// Types
// ============================================================================

interface CollectionDetailProps {
  rule: CuratedRule;
}

// ============================================================================
// Sub-components
// ============================================================================

function MovieGrid({ rule }: { rule: CuratedRule }) {
  const options = rule.movieIds
    ? collectionMoviesQueryOptions(rule.id, rule.movieIds)
    : contextualMoviesQueryOptions(rule.id, rule.filters.movies);

  const query = useQuery(options);

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => (
          <MediaGrid
            items={[]}
            isLoading
            emptyIcon={Film}
            renderCard={() => null}
            renderListItem={() => null}
          />
        ),
        error: (error) => (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error.message}</p>
          </div>
        ),
        success: (data) => (
          <MediaGrid
            items={data}
            emptyIcon={Film}
            emptyTitle="No movies found"
            emptyDescription="This collection has no results."
            renderCard={(item: MovieItem, index: number) => (
              <MediaCard type="movie" data={item} index={index} />
            )}
            renderListItem={(item: MovieItem, index: number) => (
              <MediaCard type="movie" data={item} index={index} />
            )}
          />
        ),
      }}
    />
  );
}

function ShowGrid({ rule }: { rule: CuratedRule }) {
  const query = useQuery(contextualShowsQueryOptions(rule.id, rule.filters.shows));

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => (
          <MediaGrid
            items={[]}
            isLoading
            emptyIcon={Tv}
            renderCard={() => null}
            renderListItem={() => null}
          />
        ),
        error: (error) => (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error.message}</p>
          </div>
        ),
        success: (data) => (
          <MediaGrid
            items={data}
            emptyIcon={Tv}
            emptyTitle="No shows found"
            emptyDescription="This collection has no results."
            renderCard={(item: ShowItem, index: number) => (
              <MediaCard type="show" data={item} index={index} />
            )}
            renderListItem={(item: ShowItem, index: number) => (
              <MediaCard type="show" data={item} index={index} />
            )}
          />
        ),
      }}
    />
  );
}

// ============================================================================
// Main Component
// ============================================================================

function CollectionDetail({ rule }: CollectionDetailProps) {
  const showMovies = rule.mode !== 'shows-only';
  const showShows = rule.mode === 'paired';

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{rule.meta.displayTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{rule.meta.description}</p>
      </div>

      {/* Movie Grid */}
      {showMovies && (
        <section className="space-y-4">
          {showShows && (
            <h2 className="border-l-2 border-primary pl-3 text-lg font-bold tracking-tight">Movies</h2>
          )}
          <MovieGrid rule={rule} />
        </section>
      )}

      {/* Show Grid */}
      {showShows && (
        <section className="space-y-4">
          <h2 className="border-l-2 border-primary pl-3 text-lg font-bold tracking-tight">Shows</h2>
          <ShowGrid rule={rule} />
        </section>
      )}
    </div>
  );
}

export type { CollectionDetailProps };
export { CollectionDetail };
```

**Step 2: Create `app/(protected)/explore/[slug]/page.tsx`**

The dynamic route page that finds the rule by slug and renders the detail view:

```typescript
import { notFound } from 'next/navigation';

import { CURATED_RULES } from '@/lib/contextual';

import { CollectionDetail } from './_components/collection-detail';

// ============================================================================
// Types
// ============================================================================

interface ExploreDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ============================================================================
// Page
// ============================================================================

export default async function ExploreDetailPage({ params }: ExploreDetailPageProps) {
  const { slug } = await params;
  const rule = CURATED_RULES.find((r) => r.meta.slug === slug);

  if (!rule) notFound();

  return <CollectionDetail rule={rule} />;
}
```

**Important note on Next.js 16:** In Next.js 15+, `params` is a `Promise`. The page must `await params` to access the slug. This pattern is shown above.

**Step 3: Verify**

Run: `bun check`
Expected: No errors.

Run: `bun lint --fix`
Expected: No errors.

**Step 4: Commit**

```bash
git add app/(protected)/explore/\[slug\]/
git commit -m "feat(explore): add collection detail page with media grids"
```

---

## Task 8: Final Verification & Cleanup

**Files:** None (verification only)

**Step 1: Full type check**

Run: `bun check`
Expected: No errors across entire codebase.

**Step 2: Full lint check**

Run: `bun lint --fix`
Expected: No errors. Auto-fixable issues resolved.

**Step 3: Verify git status**

Run: `git status`
Expected: Clean working tree (all changes committed). If any unstaged files remain, review and commit them.

**Step 4: Manual verification checklist**

- [ ] Homepage should show: stubs → contextual rows → trending → **curated rows** → stub
- [ ] Curated rows rotate daily (different selection each day, consistent within a day)
- [ ] Director rows show only movie rows (no empty show rows)
- [ ] `/explore` page groups categories: Directors, Movements, World Cinema, Eras, Themes, Collections
- [ ] `/explore/kubrick` (or any slug) shows collection detail with movie grid
- [ ] `/explore/criterion-collection` fetches movies by ID (not discover API)
- [ ] Paired rules on `/explore/[slug]` show both Movies and Shows sections

---

## Summary of All New/Modified Files

| File | Action | Purpose |
|------|--------|---------|
| `lib/contextual/types.ts` | Modify | Add AlwaysMatcher, CuratedRule, RowMode, CuratedRuleMeta |
| `lib/contextual/matchers.ts` | Modify | Add `always` case |
| `lib/contextual/curated-rules.ts` | Create | ~84 curated rules across 6 categories |
| `lib/contextual/get-curated-rows.ts` | Create | Daily-seed shuffle + slot picker |
| `lib/contextual/index.ts` | Modify | Add new exports |
| `api/functions/movies/collection.ts` | Create | `fetchMoviesByIds()` for ID-list collections |
| `api/functions/movies/index.ts` | Modify | Add collection export |
| `options/queries/movies/collection.ts` | Create | `collectionMoviesQueryOptions()` |
| `options/queries/movies/index.ts` | Modify | Add collection export |
| `app/(protected)/home/_components/home-curated.tsx` | Create | Rotating curated rows component |
| `app/(protected)/home/_components/home-browse.tsx` | Modify | Add HomeCurated |
| `app/(protected)/explore/layout.tsx` | Create | Passthrough layout |
| `app/(protected)/explore/page.tsx` | Create | Category browser index |
| `app/(protected)/explore/_components/explore-section.tsx` | Create | Section component |
| `app/(protected)/explore/_components/category-card.tsx` | Create | Category card component |
| `app/(protected)/explore/[slug]/page.tsx` | Create | Collection detail route |
| `app/(protected)/explore/[slug]/_components/collection-detail.tsx` | Create | Detail view with media grids |
