# Curated Rows & Explore Page Design

**Goal:** Expand the homepage with rotating curated content rows and add a dedicated Explore page for browsing all curated categories. Transform Homeflix into a cinephile's discovery platform.

**Approach:** Extend the existing contextual recommendations system (Approach A) — add curated rules with an `always` matcher, daily-seed rotation for homepage, and a new Explore route.

---

## 1. Extended Type System

### New Matcher

```typescript
interface AlwaysMatcher { type: 'always' }
```

Added to the existing `ContextMatcher` union. Rules with `always` matcher are unconditionally active — they form the curated pool.

### New Rule Types

Extend `ContextRuleType`:

```typescript
type ContextRuleType =
  | 'holiday' | 'time-of-day' | 'day-of-week' | 'season' | 'festival'  // existing
  | 'director' | 'curated-list' | 'thematic' | 'era' | 'world-cinema' | 'movement';  // new
```

### Row Mode

Each rule gets a `mode` field:

```typescript
interface ContextRule {
  // ... existing fields
  mode: 'paired' | 'movies-only' | 'shows-only';
}
```

- `paired` — produces 2 rows (movie + show). Used by contextual rules and thematic categories.
- `movies-only` — produces 1 row. Used by directors.
- `shows-only` — produces 1 row. Available for future use.

Existing contextual rules default to `paired`.

### Curated Rule Extras

Curated rules get additional metadata for the Explore page:

```typescript
interface CuratedRuleMeta {
  slug: string;              // URL-safe ID for /explore/[slug]
  description: string;       // 1-2 sentence description for collection page
  category: CuratedCategory; // grouping for Explore page sections
}

type CuratedCategory = 'director' | 'movement' | 'world-cinema' | 'era' | 'thematic' | 'collection';
```

---

## 2. Selection Algorithm

### Homepage — Two-Phase Picker

**Phase 1 — Contextual (time-based):** Unchanged. Evaluate rules with time matchers, return top 2 by priority. Always shown.

**Phase 2 — Curated (always-match):**
1. Collect all rules with `always` matcher
2. Shuffle with daily seed (`hashString(new Date().toDateString())`)
3. Pick rules until 6 row slots are filled:
   - `paired` rule costs 2 slots
   - `movies-only` or `shows-only` costs 1 slot
4. Return selected rules

**Daily seed:** Simple string hash → deterministic shuffle. Same day = same rows. New day = fresh rotation.

```typescript
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
    const j = ((s >>> 0) % (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

### Homepage Row Order

1. Continue Watching (stub)
2. Recently Added (stub)
3. Contextual rows (up to 4 rows from 2 time-based rules)
4. Trending Movies / Trending Shows
5. **Curated rows (6 rows from rotating pool)**
6. Recommended for You (stub)

---

## 3. Curated Rule Catalog

### Directors (~20 entries, `movies-only`)

Mix of classic and modern masters. Each rule uses `crewIds` filter with the director's TMDB person ID.

Directors: Kubrick, Kurosawa, Hitchcock, Scorsese, Coppola, Tarkovsky, Bergman, Fellini, Lynch, Fincher, PTA, Villeneuve, Nolan, Bong Joon-ho, Park Chan-wook, Wong Kar-wai, Miyazaki, Wes Anderson, Joel Coen, Sofia Coppola.

TMDB person IDs stored in `lib/contextual/data/directors.json`.

### Cinematic Movements (~8 entries, `paired`)

- French New Wave — keywords: [nouvelle vague, french new wave] + language: fr + years: 1958-1975
- Italian Neorealism — keywords: [neorealism] + language: it + years: 1943-1960
- German Expressionism — keywords: [expressionism] + language: de + years: 1920-1935
- New Hollywood — years: 1967-1982 + genres: drama + rating: 7.0+
- Dogme 95 — keywords: [dogme 95] + years: 1995-2005
- Mumblecore — keywords: [mumblecore] + years: 2002-2015
- Korean New Wave — language: ko + rating: 7.0+ + years: 2000-present
- Japanese New Wave — language: ja + rating: 7.0+ + years: 1956-1975

### World Cinema Regions (~6 entries, `paired`)

- Korean Cinema — language: ko + rating: 6.5+
- Japanese Masters — language: ja + rating: 7.0+
- Scandinavian Noir — language: sv/da/no + genres: crime, thriller
- French Cinema — language: fr + rating: 6.5+
- Italian Cinema — language: it + rating: 6.5+
- Latin American Cinema — language: es/pt + rating: 6.5+

### Eras (~6 entries, `paired`)

- Golden Age Hollywood — years: 1930-1959 + rating: 7.0+
- 70s New Hollywood — years: 1967-1982 + rating: 7.0+
- 80s Classics — years: 1980-1989 + rating: 6.5+
- 90s Indie — years: 1990-1999 + rating: 7.0+ + keywords: [independent film]
- 2000s Cinema — years: 2000-2009 + rating: 7.0+
- Modern Masterpieces — years: 2015-present + rating: 7.5+ + votes: 1000+

### Themes & Moods (~10 entries, `paired`)

- Film Noir — keywords: [film noir, neo-noir] + genres: crime, mystery
- Psychological Thrillers — keywords: [psychological thriller] + genres: thriller
- Coming-of-Age — keywords: [coming-of-age] + genres: drama
- Feel-Good — genres: comedy, family + rating: 7.0+
- Mind-Bending — keywords: [surrealism, mindfuck, plot twist] + genres: sci-fi, thriller
- Cyberpunk — keywords: [cyberpunk] + genres: sci-fi
- Heist & Caper — keywords: [heist] + genres: crime, action
- War Epics — genres: war, drama + runtime: 120+
- Courtroom Drama — keywords: [courtroom, trial] + genres: drama
- Road Movies — keywords: [road trip, road movie] + genres: adventure, drama

### Collections (~1+ entries, special handling)

- The Criterion Collection — fetched from `lib/contextual/data/criterion-collection.json` (array of TMDB movie IDs)
- Future: uploadable JSON lists

**Total: ~51+ curated rules** in the pool.

---

## 4. Criterion Collection

### Data Source

Download the Criterion Collection spine list from a public source. Store as a JSON array of TMDB movie IDs:

```
lib/contextual/data/criterion-collection.json
→ [858, 389, 914, 1051, ...]  // TMDB movie IDs
```

### Fetch Strategy

Can't use discover API with a list of IDs. Instead:

1. On homepage row: pick a random page of 20 IDs from the list, batch-fetch via `/3/movie/{id}`
2. On collection page: paginate through the full list, 20 per page
3. Cache aggressively: `staleTime: 30 * 60 * 1000` (30 min)

New fetch function: `fetchMoviesByIds(ids: number[]): Promise<MovieItem[]>`

Uses `Promise.allSettled` to fetch in parallel, filters out failures.

### Upload Mechanism

Replace the JSON file and commit. No UI upload needed — this is a dev-managed list.

---

## 5. Explore Page

### Route Structure

```
app/(protected)/explore/
├── page.tsx              — Category browser (all categories grouped by type)
├── _components/
│   ├── explore-section.tsx    — Section with title + category cards
│   └── category-card.tsx      — Clickable card for a category
└── [slug]/
    ├── page.tsx              — Collection detail page
    └── _components/
        └── collection-detail.tsx — Hero + description + media grid
```

### Explore Index Page (`/explore`)

Groups all curated rules by `category`:

```
DIRECTORS         [Kubrick] [Kurosawa] [Hitchcock] [Scorsese] ...
MOVEMENTS         [French New Wave] [Italian Neorealism] [German Expressionism] ...
WORLD CINEMA      [Korean Cinema] [Japanese Masters] [Scandinavian Noir] ...
ERAS              [Golden Age] [70s New Hollywood] [80s Classics] ...
THEMES & MOODS    [Film Noir] [Psychological Thrillers] [Coming-of-Age] ...
COLLECTIONS       [The Criterion Collection]
```

Each card shows the category title. Clicking navigates to `/explore/[slug]`.

### Collection Detail Page (`/explore/[slug]`)

- Hero section with title and description
- Full media grid using existing `MediaGrid` component
- For discover-based rules: paginated results from TMDB discover API
- For ID-list rules (Criterion): paginated batch-fetch from the ID list

---

## 6. New Files Summary

### Data Files
- `lib/contextual/data/criterion-collection.json` — TMDB movie ID array
- `lib/contextual/data/directors.json` — director name + TMDB person ID + slug

### Contextual System Extensions
- `lib/contextual/types.ts` — add `AlwaysMatcher`, `mode`, `CuratedRuleMeta`, `CuratedCategory`
- `lib/contextual/matchers.ts` — add `always` case
- `lib/contextual/curated-rules.ts` — all ~51 curated rules
- `lib/contextual/get-curated-rows.ts` — daily-seed shuffle + slot picker
- `lib/contextual/index.ts` — update barrel exports

### API Layer
- `api/functions/movies/collection.ts` — `fetchMoviesByIds(ids: number[])`
- `options/queries/movies/collection.ts` — query options for ID-based fetching

### Homepage
- `app/(protected)/home/_components/home-browse.tsx` — add `HomeCurated` after trending
- `app/(protected)/home/_components/home-curated.tsx` — renders 6 curated rows

### Explore Pages
- `app/(protected)/explore/page.tsx` — category browser
- `app/(protected)/explore/_components/explore-section.tsx` — section component
- `app/(protected)/explore/_components/category-card.tsx` — card component
- `app/(protected)/explore/[slug]/page.tsx` — collection detail
- `app/(protected)/explore/[slug]/_components/collection-detail.tsx` — detail view

---

## 7. TMDB Keyword IDs to Look Up

Before implementation, look up these keyword IDs via TMDB search:

- film noir, neo-noir, nouvelle vague, french new wave, neorealism
- expressionism, dogme 95, mumblecore, independent film
- psychological thriller, coming-of-age, surrealism, cyberpunk
- heist, courtroom, trial, road trip, road movie, mindfuck, plot twist

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Extend contextual system (Approach A) | Reuses existing infrastructure, minimal new code |
| Homepage behavior | Rotating 6 rows, daily seed | Fresh each day, consistent within a day |
| Director format | Movie-only rows | Directors are primarily known for films |
| Criterion data | Real list from web, JSON file | Accurate, simple update mechanism |
| Explore page UX | Dedicated collection pages per category | Premium feel, room for description + full grid |
| Row count | 6 curated rows on homepage | Good variety without overwhelming |
