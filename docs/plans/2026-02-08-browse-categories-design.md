# Browse Categories — Unified Home Feed

## Overview

Transform the empty `/browse` page into a Netflix-style unified home feed that mixes movies and shows across curated category rows — organized by mood, theme, and genre — to make scrolling the platform more enjoyable.

## Decisions

| Decision | Choice |
|---|---|
| Page role | Unified home feed mixing movies + shows |
| Category types | Mood-based + Theme-based + Genre + Standard (all) |
| Row layout | Interleaved mix (no section headers) |
| See All behavior | Inline expansion (row → grid in-place) |
| Config storage | Hardcoded TypeScript config file |
| Time-based rows | Day-of-week + seasonal/holiday, pinned to top |
| Library rows | "Recently Added" from Radarr/Sonarr, after time-based rows |

## Page Structure

Top to bottom:
1. **Hero carousel** — Combined trending movies + shows, auto-rotating
2. **Time-based rows** — Pinned after hero: seasonal rows first, then day-of-week rows (only active ones show)
3. **Recently Added row** — Combined movies + shows from Radarr/Sonarr, sorted by `dateAdded` descending
4. **Interleaved rows** — Mood, theme, genre, and standard rows shuffled together
4. **Lazy loading** — Rows below the fold load on scroll via `useInView`

No section headers. Types are interleaved for an organic, discovery-driven feel.

## Category Config System

### Config file: `api/config/browse-categories.ts`

Each category is a typed object:

```ts
interface BrowseCategory {
  id: string;                          // unique slug
  title: string;                       // display name
  type: 'mood' | 'theme' | 'standard' | 'genre' | 'time-based';
  mediaType: 'movie' | 'show' | 'mixed';
  schedule?: CategorySchedule;         // only for time-based categories
  filters: {
    genreIds?: number[];
    keywordIds?: number[];
    sortBy?: string;
    voteAverageGte?: number;
    voteAverageLte?: number;
    voteCountGte?: number;
    voteCountLte?: number;
    releaseDateGte?: string;
    releaseDateLte?: string;
    withOriginalLanguage?: string;
    excludeOriginalLanguage?: string;
    runtimeGte?: number;
    runtimeLte?: number;
  };
}
```

Row ordering is a separate array that interleaves categories. Easy to reorder/add/remove.

Query options are generated dynamically — a factory function takes a category config and returns `queryOptions()` with the mapped TMDB discover params.

### Standard Rows (5)

| Category | TMDB Params |
|---|---|
| Everyone's Watching | `/trending/all/week` |
| Certified Masterpieces | `sort_by: vote_average.desc`, `vote_count.gte: 5000` |
| Just Dropped | Movies: `/now_playing`, Shows: `/on_the_air` |
| On the Horizon | Movies: `/upcoming`, Shows: `/airing_today` |
| Under the Radar | `vote_average.gte: 7.5`, `vote_count.lte: 1000` |

### Mood Rows (10)

| Category | Genres | Filters |
|---|---|---|
| Serotonin Boost | Comedy, Family, Music | `vote_average.gte: 6.5` |
| Hold Your Breath | Thriller, Action | `vote_average.gte: 6.8` |
| Neon Noir | Crime, Thriller | keywords: neo-noir, dark |
| Down the Rabbit Hole | Science Fiction, Mystery | keywords: twist-ending, surreal |
| Unhinged Comedy | Comedy | `vote_average.gte: 7.0`, `vote_count.gte: 1000` |
| Slow Burn | Romance, Drama | keywords: love-story |
| Warm Blanket Cinema | Comedy, Family, Animation | `vote_average.gte: 6.0` |
| Existential Drift | Drama, Sci-Fi, Foreign | keywords: contemplative, philosophical, slow-cinema; `vote_average.gte: 7.0` |
| 2 AM Rabbit Hole | Horror, Thriller, Mystery | keywords: cult, psychological, atmospheric; runtime under 110 min |
| Terrifyingly True | Documentary, Drama, History | keywords: true-story, biographical; `vote_average.gte: 6.5` |

### Theme Rows (10)

| Category | TMDB Filters |
|---|---|
| Standing Ovation | `vote_average.gte: 7.5`, `vote_count.gte: 3000` |
| Rewound | years: 1990-1999, `vote_count.gte: 500` |
| Neon Rearview | years: 1980-1989, `vote_count.gte: 500` |
| Stranger Than Fiction | keywords: based-on-true-story |
| The Canon | `vote_average.gte: 8.0`, `vote_count.gte: 1000` |
| Midnight Selections | years: before 2005, `vote_average.gte: 7.0`, `vote_count: 200-2000` |
| Beyond Borders | `with_original_language` not en, `vote_average.gte: 7.0` |
| One Wild Night | runtime <= 100 min, Comedy/Action/Thriller, `vote_average.gte: 6.5`, year >= 2000 |
| First Features | Debut directors, `vote_average.gte: 7.0` |
| The Long Game | runtime >= 130 min, Drama/Thriller, `vote_average.gte: 7.0` |

### Row Order (Interleaved)

Everyone's Watching → Serotonin Boost → Action (genre) → Standing Ovation → Hold Your Breath → Comedy (genre) → Rewound → Neon Noir → Drama (genre) → Down the Rabbit Hole → Under the Radar → Stranger Than Fiction → Unhinged Comedy → Sci-Fi (genre) → Neon Rearview → Slow Burn → One Wild Night → Horror (genre) → The Canon → Existential Drift → Warm Blanket Cinema → Midnight Selections → The Long Game → Beyond Borders → First Features → 2 AM Rabbit Hole → Terrifyingly True → remaining genres...

## Time-Based Categories

### Schedule Type

```ts
interface CategorySchedule {
  type: 'day-of-week' | 'seasonal';
  dayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0=Sunday, 6=Saturday
  startDate?: string;                         // "MM-DD" format
  endDate?: string;                           // "MM-DD" format
}
```

### Activation Logic

A pure function `getActiveTimeCategories(categories, date)` filters the full category list to return only time-based categories whose schedule matches the current date. Runs client-side on mount using the user's local time. No server dependency, no timezone issues.

### Placement

Active time-based rows render pinned after the hero carousel, before the regular interleaved rows. When multiple are active, seasonal rows appear first, then day-of-week rows. Both can coexist (e.g., Christmas Special + Sunday Comedy on Dec 22).

### Day-of-Week Categories (7)

| Day | Category | Vibe / Filters |
|---|---|---|
| Monday | The Quiet Hours | Drama, melancholic, introspective |
| Tuesday | Fresh Off the Reel | Recently released, high popularity |
| Wednesday | Who Did It? | Mystery, whodunnits, detective stories |
| Thursday | Lost Reels | Pre-2000s classics |
| Friday | Lights Out, Volume Up | Action, explosions, high energy |
| Saturday | The Deep End | Highly-rated shows with 3+ seasons |
| Sunday | Easy Watching | Light comedies, feel-good, family |

### Seasonal/Holiday Categories (8)

| Period | Category | Date Range |
|---|---|---|
| Valentine's | Written in the Stars | Feb 1 - Feb 14 |
| Oscar Season | For Your Consideration | Feb 15 - Mar 15 |
| Spring | Rainy Day Cinema | Mar 16 - Apr 30 |
| Summer | Big Screen Energy | Jun 1 - Aug 31 |
| Early Autumn | The Long Light | Sep 1 - Oct 14 |
| Halloween | After Dark | Oct 15 - Oct 31 |
| Christmas | By the Fire | Dec 1 - Dec 25 |
| New Year's | One More Year | Dec 26 - Jan 2 |

## Library Row: Recently Added

### Data Source

Uses existing `fetchMovieItems()` and `fetchShowItems()` functions from Radarr/Sonarr. Both `MovieItem` and `ShowItem` already have a `dateAdded` field. No new API functions needed.

### Implementation

A dedicated query option (`recentlyAddedQueryOptions()`) that:
1. Fetches both movie and show library items in parallel
2. Merges them into a single list
3. Sorts by `dateAdded` descending
4. Takes the top 20 items

### Placement

Pinned after time-based rows, before interleaved discovery rows. This is the only library-sourced row — it provides a personal touch between the contextual/time content and the TMDB discovery content.

### Edge Case

If the library is empty (new user, no Radarr/Sonarr items), the row is hidden entirely. No empty state shown — the page just flows from time-based rows straight into interleaved rows.

## Inline Expansion (See All)

When "See All" is clicked on a row:

1. Row transitions from horizontal scroll to full grid layout
2. Infinite scroll query activates using the same TMDB filters, fetching multiple pages
3. A collapse button appears at the top of the expanded grid
4. Rows above/below remain visible; expanded grid pushes content down
5. Only one row can be expanded at a time — expanding a new one collapses the previous

**Scroll handling:** When collapsed, scroll position snaps back to the row's original position.

**Animation:** CSS transition on row height. Cards fade/scale in with staggered animation.

## Data Flow

```
browse-categories.ts (config)
  -> categoryQueryOptions(category)          // single page, row preview
  -> categoryInfiniteQueryOptions(category)  // multi-page, expanded grid
    -> fetchFilteredMovies / fetchFilteredShows  // existing functions
      -> TMDB discover endpoint

recentlyAddedQueryOptions()
  -> fetchMovieItems() + fetchShowItems()    // existing Radarr/Sonarr functions
    -> merge, sort by dateAdded, take top 20
```

## New Files

| File | Purpose |
|---|---|
| `api/config/browse-categories.ts` | Category definitions + row ordering |
| `options/queries/browse.ts` | Factory functions: config -> queryOptions |
| `app/(protected)/browse/page.tsx` | Server Component shell |
| `app/(protected)/browse/_components/browse-feed.tsx` | Client component orchestrating rows |
| `app/(protected)/browse/_components/browse-row.tsx` | Row with expand/collapse |
| `app/(protected)/browse/_components/browse-hero.tsx` | Hero carousel (combined movies + shows) |

## Reused Components

- `FeaturedMedia` — Hero carousel
- `MediaCard` — Cards in rows and grids
- `MediaGrid` — Grid layout for expanded state
- `MediaRow` — Base horizontal row

## No Changes Needed

- API clients, functions, mappers, entities
- Existing `/media/movies` and `/media/shows` pages

## Boundary Compliance

`api/config/` is a new directory, peer to `api/types/`. Dependency flow:
`api/config/` -> `options/queries/` -> `components` -> `app/`

Needs to be added to `boundary-spec.mjs`.

## Future Enhancements (Not In Scope)

- Additional library rows: "Continue Collecting", "Ready to Watch", "Airing Soon"
- Time-of-day triggers: "Late Night Thrillers", "Morning Feel-Good"
- Daily shuffle of row order
- User-personalized row ordering
