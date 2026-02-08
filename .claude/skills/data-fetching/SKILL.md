---
name: data-fetching
description: Use when creating components that fetch data, defining query options, building loading/error/success states, or working with the Query/Queries wrapper components. Covers the full data fetching pipeline from API clients to rendered UI.
---

# Data Fetching Patterns

This skill covers the query-driven data architecture used throughout the homeflix frontend.

## Core Principle: Modular Queries

**From CLAUDE.md: Each component manages its own query. No god queries that fill the entire page.**

```tsx
// GOOD: Each component fetches its own data
function MoviesPage() {
  return (
    <>
      <FeaturedMovie />  {/* Manages own query */}
      <MoviesGrid />     {/* Manages own query */}
    </>
  );
}

// BAD: God query that fetches everything
function MoviesPage() {
  const { featured, movies } = useQuery(allMoviesPageData());
  return (
    <>
      <FeaturedMovie data={featured} />
      <MoviesGrid data={movies} />
    </>
  );
}
```

## Data Flow Pipeline

```
API Client (openapi-fetch, typed)
  → API Function (fetch + map to entity)
    → Query Options (queryKey + queryFn + staleTime)
      → useQuery() hook in component
        → Query/Queries wrapper component
          → loading() | error() | success() callbacks
```

## Query Options

Query options are factory functions that live in `/options/queries/`. They return `queryOptions()` from TanStack Query.

### File location

```
options/queries/
├── movies/
│   ├── detail.ts       # TMDB movie data + credits + images + videos + keywords
│   ├── discover.ts     # TMDB discover/trending movies
│   ├── library.ts      # Radarr library movies + lookup
│   └── metadata.ts     # Radarr metadata (history, files, etc.)
├── shows/
│   ├── detail.ts       # TMDB show data + credits + images + videos + keywords
│   ├── discover.ts     # TMDB discover/trending shows
│   ├── library.ts      # Sonarr library shows + lookup
│   └── metadata.ts     # Sonarr metadata (history, files, etc.)
└── search.ts           # Cross-media search
```

### Pattern

```tsx
import { queryOptions } from '@tanstack/react-query';

export function tmdbMovieQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'movie', tmdbId] as const,
    queryFn: async (): Promise<MovieBasic> => {
      const client = createTMDBClient();
      const response = await client.GET('/3/movie/{movie_id}', {
        params: { path: { movie_id: tmdbId } },
      });
      if (response.error) throw new Error('Failed to fetch movie');
      return mapToMovieBasic(response.data);
    },
    staleTime: 10 * 60 * 1000,  // 10 minutes
  });
}
```

### Stale time conventions

| Data source | Stale time | Reason |
|---|---|---|
| TMDB (movie info, credits, images) | 10 minutes | Rarely changes |
| Radarr/Sonarr (library data) | 2 minutes | More dynamic (downloads, status) |
| Radarr lookup | 2 minutes + `retry: false` | Fail fast if service down |

### Query key conventions

Build query keys as descriptive arrays:

```tsx
['movies', { status, search, genres, ... }]   // Library movies with filters
['movies', 'featured']                         // Featured movie
['tmdb', 'movie', tmdbId]                      // TMDB movie basic
['tmdb', 'movie', tmdbId, 'credits']           // TMDB credits
['tmdb', 'movie', tmdbId, 'images']            // TMDB images
['tmdb', 'movie', tmdbId, 'videos']            // TMDB videos
['tmdb', 'movie', tmdbId, 'keywords']          // TMDB keywords
['radarr', 'lookup', 'tmdb', tmdbId]           // Radarr lookup by TMDB ID
['radarr', 'history', radarrId]                // Radarr history
```

## Query/Queries Wrapper Components

**From CLAUDE.md: Always use `components/query` components to render queries.**

### Single query: `<Query>`

```tsx
import { Query } from '@/components/query';

function CastSection({ tmdbId }: CastSectionProps) {
  const query = useQuery(tmdbCreditsQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: CastSectionLoading,           // Function reference (no args)
        error: (error) => null,                // Silent failure for sections
        success: (credits) => (                // Receives typed data
          <CastSectionContent credits={credits} />
        ),
      }}
    />
  );
}
```

### Multiple queries: `<Queries>`

Use when a component needs data from multiple sources:

```tsx
import { Queries } from '@/components/query';

function MovieStats({ tmdbId }: MovieStatsProps) {
  const movieQuery = useQuery(tmdbMovieQueryOptions(tmdbId));
  const libraryQuery = useQuery(radarrLookupQueryOptions(tmdbId));

  return (
    <Queries
      results={[movieQuery, libraryQuery] as const}
      callbacks={{
        loading: MovieStatsLoading,
        error: (error) => <MovieStatsError error={error} />,
        success: ([movie, library]) => (    // Tuple, typed per query
          <MovieStatsSuccess movie={movie} libraryInfo={library} />
        ),
      }}
    />
  );
}
```

### Behavior

- **Loading**: Shown only when there's no cached data (initial load)
- **Error**: Shown when query fails (first error for `Queries`)
- **Success**: Shown when data is available, including stale data during background refetch
- **`isRefetching`**: Boolean flag passed in success meta — use for subtle loading indicators

### Error handling strategies

| Component type | Error behavior | Example |
|---|---|---|
| Page-level section | Show error UI with retry button | `<FeaturedMovieFailed error={error} refetch={query.refetch} />` |
| Tab container | Show error UI with message | `<MovieTabsError error={error} />` |
| Detail section | Silent failure (return null) | `error: () => null` |
| Stats/info card | Show error state | `<MovieStatsError error={error} />` |

**Rule**: Sections that are supplementary (cast, crew, gallery) fail silently. Primary content (header, tabs, grid) shows explicit error UIs.

## Loading States

### Skeleton pattern

Loading skeletons should **mirror the layout** of the success state:

```tsx
function CastSectionLoading() {
  return (
    <section>
      {/* Mirror the SectionHeader layout */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>
      {/* Mirror the carousel layout */}
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[130px] shrink-0 sm:w-[150px]">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <div className="mt-2 space-y-1 px-0.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Key loading patterns

- Use `<Skeleton>` from shadcn/ui
- Match exact dimensions/spacing of success layout
- Use `Array.from({ length: N })` for repeated items
- Stagger animations with `style={{ animationDelay: `${i * 50}ms` }}`
- Featured sections get rich skeletons (gradient backgrounds, shimmer effects, film grain)

## Stale-While-Revalidate

Show cached data immediately; overlay a subtle indicator during background refetch:

```tsx
function MoviesGridSuccess({ movies, stats, isRefetching }: Props) {
  return (
    <div className="relative">
      {isRefetching && (
        <div className="absolute right-0 top-0 z-10">
          <div className="size-2 animate-pulse rounded-full bg-primary" />
        </div>
      )}
      <MediaGrid items={movies} ... />
    </div>
  );
}
```

## Conditional Queries

Disable queries when prerequisites aren't met:

```tsx
// Only fetch history if we have a Radarr ID
export function radarrHistoryQueryOptions(radarrId: number | null) {
  return queryOptions({
    queryKey: ['radarr', 'history', radarrId],
    queryFn: async () => { /* ... */ },
    enabled: !!radarrId,  // Don't fetch if null
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
```

## Graceful Service Degradation

When an external service (Radarr/Sonarr) might be unavailable:

```tsx
export function radarrLookupQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['radarr', 'lookup', 'tmdb', tmdbId],
    queryFn: async () => {
      try {
        const client = createRadarrClient();
        const { data } = await client.GET('/api/v3/movie/lookup/tmdb', { ... });
        return mapToLibraryInfo(data);
      } catch {
        // Gracefully handle: treat as "not in library"
        return { inLibrary: false } as LibraryInfo;
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: false,  // Don't retry if service is down
  });
}
```

## Entity Mapping

### Pipeline

```
Raw API Response (Radarr/Sonarr/TMDB types)
  → mapToEntity() function in api/mappers/
    → Clean domain entity (MovieItem, ShowItem, MovieBasic, etc.)
      → Used by component props
```

### Entity file locations

```
api/entities/
├── movies/
│   ├── movie-item.ts       # Grid/list item (shared across library + browse)
│   ├── movie-detail.ts     # Detail page types (MovieBasic, MovieCredits, etc.)
│   ├── movie-discover.ts   # Discover/trending item type
│   └── movie-library.ts    # Library-specific info (file status, quality, etc.)
├── shows/
│   ├── show-item.ts        # Grid/list item (shared across library + browse)
│   ├── show-detail.ts      # Detail page types
│   ├── show-discover.ts    # Discover/trending item type
│   └── show-library.ts     # Library-specific info
└── index.ts                # Re-exports via export * from
```

### Type design principles

- Optional fields use `?` (not `| undefined`)
- Include a `type` discriminator (`type: 'movie'`) for union types
- Flatten nested API structures (e.g., `genres: string[]` not `genres: {id, name}[]`)
- Computed fields derived during mapping (e.g., `posterUrl` from `poster_path`)

## Checklist: Adding Data to a New Component

1. Define the entity type in `api/entities/` (if new)
2. Create/find the API function in `api/functions/` (handles fetch + mapping)
3. Create query options in `options/queries/` (queryKey + queryFn + staleTime)
4. In the component:
   a. Call `useQuery(yourQueryOptions(params))`
   b. Wrap with `<Query result={...} callbacks={{...}} />`
   c. Implement Loading, Error (or null), and Success callbacks
5. Export the component with named exports + type exports
