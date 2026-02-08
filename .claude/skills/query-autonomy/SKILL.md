---
name: query-autonomy
description: Use when refactoring a detail page to eliminate prop passthrough by giving each section its own query. Invoke with page path as argument. Covers analysis of component data flow and refactoring sections to use select-based query options.
---

# Query Autonomy

Refactor detail pages so every section owns its own data. No prop passthrough from parent queries.

**Core technique:** TanStack React Query `select` option — one shared cache entry, many typed views.

## Invocation

```
/query-autonomy app/(protected)/media/movies/[id]
```

Argument: relative path to a page directory containing `_components/`.

## Phase 1: Analysis (always runs first)

Scan the page and present findings. Do NOT write code yet.

### Steps

1. Read `page.tsx` — identify the root ID param (e.g., `tmdbId`, `showId`)
2. Recursively read every component in `_components/`
3. For each component, classify:
   - **Autonomous** — has `useQuery`, owns its data
   - **Receiver** — accepts data via props from a parent's query
   - **Pure** — no external data (static layout, children only)
4. For each Receiver, identify:
   - Which parent passes the data
   - Which base query the data originates from
   - The exact fields the Receiver uses from the passed data
5. For components that are already Autonomous but receive *additional* props from a parent query (e.g., GallerySection gets `tmdbId` for its own query + `movieTitle` from parent), note the extra prop passthrough

### Output Format

Present a table to the user:

```
AUTONOMOUS (no changes needed):
  CastSection        → movieCreditsQueryOptions(tmdbId)
  CrewSection         → movieCreditsQueryOptions(tmdbId)
  GallerySection      → movieImagesQueryOptions(tmdbId) + receives movieTitle prop
  KeywordsSection     → movieKeywordsQueryOptions(tmdbId)
  LibraryStatusBadge  → movieLibraryInfoQueryOptions(tmdbId)

RECEIVERS (will get their own query):
  OverviewSection     ← parent: OverviewTab
    base query: movieDetailQueryOptions(tmdbId)
    fields used: overview
    new option: movieOverviewQueryOptions (select: movie.overview)

  DetailsSection      ← parent: OverviewTab
    base query: movieDetailQueryOptions(tmdbId)
    fields used: genres
    new option: movieGenresQueryOptions (select: movie.genres)

  ProductionSection   ← parent: OverviewTab
    base query: movieDetailQueryOptions(tmdbId)
    fields used: budget, revenue, productionCompanies
    new option: movieProductionQueryOptions (select)

  ExternalLinksSection ← parent: OverviewTab
    base query: movieDetailQueryOptions(tmdbId)
    fields used: imdbId, tmdbId, homepage
    new option: movieExternalLinksQueryOptions (select)

PARENTS TO SIMPLIFY:
  OverviewTab — currently fetches movieDetailQueryOptions, distributes to 4 children
    after: becomes pure layout, passes only tmdbId to all children

EXTRA PROP PASSTHROUGH (autonomous components receiving additional props):
  GallerySection — receives movieTitle from parent
    option: add select-based query for the extra field, or merge into existing query
```

After presenting, ask: **"Proceed with refactor?"**

## Phase 2: Refactor

### Step 1: Create select-based query options

Add new options to the existing query options file (e.g., `options/queries/movies/detail.ts`).

**Pattern — using `select` to narrow the base query:**

```tsx
// Existing base query (unchanged — shared cache entry)
export function movieDetailQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', tmdbId] as const,
    queryFn: () => fetchMovieDetail(tmdbId),
    staleTime: 10 * 60 * 1000,
  });
}

// NEW: Per-section views into the same cache
export function movieOverviewQueryOptions(tmdbId: number) {
  return queryOptions({
    ...movieDetailQueryOptions(tmdbId),
    select: (movie) => movie.overview,
  });
}

export function movieProductionQueryOptions(tmdbId: number) {
  return queryOptions({
    ...movieDetailQueryOptions(tmdbId),
    select: (movie) => ({
      budget: movie.budget,
      revenue: movie.revenue,
      productionCompanies: movie.productionCompanies,
    }),
  });
}
```

**Key:** Spread the base query options and add `select`. Same `queryKey` = same cache = one network request.

### Step 2: Convert each Receiver to Autonomous

For each Receiver section:

1. Add `'use client'` directive (if not present)
2. Replace props interface: `{ movie: MovieBasic }` → `{ tmdbId: number }`
3. Add `useQuery` with the new select-based query option
4. Wrap render with `<Query>` component using project conventions:
   - `loading:` — skeleton matching the section layout
   - `error:` — silent failure (`() => null`) for supplementary sections
   - `success:` — existing render logic, now receiving narrowed data

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { movieOverviewQueryOptions } from '@/options/queries/movies/detail';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

function OverviewSectionLoading() {
  return (
    <section className="relative">
      <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-transparent" />
      <div className="flex flex-col gap-2 pl-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </section>
  );
}

interface OverviewSectionProps {
  tmdbId: number;
}

function OverviewSection({ tmdbId }: OverviewSectionProps) {
  const query = useQuery(movieOverviewQueryOptions(tmdbId));
  return (
    <Query
      result={query}
      callbacks={{
        loading: OverviewSectionLoading,
        error: () => null,
        success: (overview) => (
          <section className="relative">
            <div className="absolute -left-4 top-0 h-full w-1 ..." />
            <p className="...">{overview}</p>
          </section>
        ),
      }}
    />
  );
}
```

### Step 3: Simplify parent components

Remove the parent's query and distribution logic. The parent becomes a pure layout:

```tsx
// BEFORE: OverviewTab fetches and distributes
function OverviewTab({ tmdbId }: OverviewTabProps) {
  const movieQuery = useQuery(movieDetailQueryOptions(tmdbId));
  return (
    <Query
      result={movieQuery}
      callbacks={{
        success: (movie) => (
          <>
            <OverviewSection overview={movie.overview} />
            <ProductionSection movie={movie} />
          </>
        ),
      }}
    />
  );
}

// AFTER: Pure layout, all children autonomous
function OverviewTab({ tmdbId }: OverviewTabProps) {
  return (
    <div className="flex flex-col space-y-8">
      <OverviewSection tmdbId={tmdbId} />
      <GallerySection tmdbId={tmdbId} />
      <CastSection tmdbId={tmdbId} />
      <CrewSection tmdbId={tmdbId} />
      <DetailsSection tmdbId={tmdbId} />
      <ProductionSection tmdbId={tmdbId} />
      <ExternalLinksSection tmdbId={tmdbId} />
    </div>
  );
}
```

**Key changes to parent:**
- Remove `'use client'` if no longer needed (parent has no hooks)
- Remove `useQuery` import and call
- Remove `Query`/`Queries` wrapper
- Remove loading/error states (each section handles its own)
- All children receive only the ID prop

### Step 4: Handle extra prop passthrough on Autonomous components

For components that are already Autonomous but receive additional props from a parent (e.g., `GallerySection` receiving `movieTitle`):

- If the extra prop is a single field from a base query, add a `select`-based query to fetch it independently
- If the component already has a query, consider using `Queries` wrapper to combine its existing query with the new select-based query

### Step 5: Type check

Run `bun check` to verify all TypeScript types are correct after refactoring.

## Why `select` over separate fetch functions

All sections consuming `MovieBasic` slices hit the same TMDB endpoint (`/movie/{id}`). Creating separate fetch functions would mean:
- Different query keys → no cache deduplication → multiple network calls
- Or a manual caching layer → reimventing what React Query already does

`select` gives each section its own typed view into a single cache entry. One fetch, many consumers.

## Checklist

- [ ] Read page.tsx and all _components/ recursively
- [ ] Classify every component (Autonomous / Receiver / Pure)
- [ ] Map all passthrough chains with exact fields
- [ ] Present analysis table to user
- [ ] Wait for user confirmation before refactoring
- [ ] Create select-based query options in options/queries/
- [ ] Convert each Receiver to Autonomous with Query wrapper
- [ ] Add loading skeleton + error handler to each converted section
- [ ] Simplify parent components (remove query, become pure layout)
- [ ] Handle extra prop passthrough on Autonomous components
- [ ] Run bun check to verify types
