---
name: component-architecture
description: Use when creating, modifying, or organizing React components. Covers file organization, naming conventions, composition patterns, export rules, prop design, and component splitting strategies specific to this codebase.
---

# Component Architecture

This skill defines how components are structured, organized, and composed in the homeflix frontend.

## File Organization

### Route-Level Components

Components for a specific route live in `_components/` under that route:

```
app/(protected)/library/movies/
├── page.tsx                    # Server component, composition root
└── _components/
    ├── featured-movie.tsx      # Standalone single-file component
    ├── movies-filter/          # Multi-file component (folder)
    │   ├── index.tsx           # Main export
    │   ├── active-filters.tsx
    │   ├── filter-badge.tsx
    │   └── filter-popover.tsx
    └── movies-grid/
        ├── index.tsx
        ├── movie-card.tsx
        └── movie-item.tsx
```

### Rules

1. **Single-file components** — Use a flat `.tsx` file when the component has no sub-components (e.g., `featured-movie.tsx`)
2. **Multi-file components** — Use a folder with `index.tsx` when the component has private sub-components (e.g., `movies-filter/`)
3. **`_components/` prefix** — All route-private components go in `_components/`
4. **Shared components** — Reusable cross-route components go in `/components/` (e.g., `components/media/`, `components/query/`, `components/ui/`)

## Component File Structure

Every component file follows this internal structure with section separators:

```tsx
'use client';

// 1. External library imports
import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';

// 2. API/entity/type imports
import { type MovieCredits } from '@/api/entities';
import { tmdbCreditsQueryOptions } from '@/options/queries/tmdb';

// 3. Shared component imports
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// 4. Local component imports
import { SectionHeader } from './section-header';

// ============================================================================
// Utilities (if needed, small helpers private to this file)
// ============================================================================

function getInitials(name: string): string {
  // ...
}

// ============================================================================
// Sub-Components (private to this file)
// ============================================================================

interface CastCardProps {
  name: string;
  character: string;
}

function CastCard({ name, character }: CastCardProps) {
  // ...
}

// ============================================================================
// Loading
// ============================================================================

function CastSectionLoading() {
  // Skeleton UI matching the success layout
}

// ============================================================================
// Error (if applicable)
// ============================================================================

function CastSectionError({ error }: { error: Error }) {
  // Error UI
}

// ============================================================================
// Success
// ============================================================================

function CastSectionContent({ credits }: { credits: MovieCredits }) {
  // Actual rendered content
}

// ============================================================================
// Main
// ============================================================================

interface CastSectionProps {
  tmdbId: number;
}

function CastSection({ tmdbId }: CastSectionProps) {
  const query = useQuery(tmdbCreditsQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: CastSectionLoading,
        error: () => null,
        success: (credits) => <CastSectionContent credits={credits} />,
      }}
    />
  );
}

export type { CastSectionProps };
export { CastSection };
```

### Section Order

1. `'use client'` directive (if needed)
2. Imports (external → api/types → shared components → local components)
3. `// Utilities` — Small private helpers
4. Sub-components — Private components used only in this file
5. `// Loading` — Skeleton/loading state
6. `// Error` — Error state (optional, some sections fail silently)
7. `// Success` — Content when data is available
8. `// Main` — The exported component that wires query → states

Use `// ====...====` separators between major sections.

## Exports

**Critical rule from CLAUDE.md: Never reexport for convenience.**

```tsx
// At the bottom of every component file:
export type { CastSectionProps };
export { CastSection };
```

- Named exports only (no `export default`)
- Type exports separated from value exports
- Only use `export * from './file'` in barrel files for utilities/types, not for component convenience re-exports

## Prop Design

### Interface-first approach

Always define a `Props` interface (not `type`) above the component, using `function` declarations (not arrows):

```tsx
interface MovieCardProps {
  movie: MovieItem;
  status: StatusConfig;
}

function MovieCard({ movie, status }: MovieCardProps) {
  // ...
}
```

### Slot-based composition (over prop explosion)

When a component needs customizable regions, use slots:

```tsx
// GOOD: Slot-based
interface MediaCardProps {
  href: string;
  title: string;
  status: StatusConfig;
  topRightSlot?: ReactNode;    // Custom content in top-right
  overlaySlot?: ReactNode;     // Custom overlay content
  children?: ReactNode;        // Hover overlay content
}

// BAD: Prop explosion
interface MediaCardProps {
  showRating: boolean;
  ratingPosition: string;
  ratingStyle: string;
  showGenres: boolean;
  genreLimit: number;
  // ... 20 more props
}
```

### Generic type constraints for reusable components

```tsx
interface BaseMediaItem {
  id: string | number;
  title: string;
  year?: number;
  posterUrl?: string;
}

function MediaGrid<T extends BaseMediaItem>({
  items,
  renderCard,
}: {
  items: T[];
  renderCard: (item: T, index: number) => ReactNode;
}) {
  // Works with MovieItem, ShowItem, or any media type
}
```

## Composition Patterns

### Specialized wraps Generic

```
MovieCard (movie-specific props + logic)
  → wraps MediaCard (generic media props + slots)
    → uses shadcn/ui primitives (Badge, AspectRatio, Tooltip)
```

Each layer adds domain-specific behavior without modifying the generic layer.

### Page as pure composition root

Page components (`page.tsx`) are server components with zero business logic:

```tsx
export default function MoviesPage() {
  return (
    <>
      <FeaturedMovie />
      <section>
        <MoviesFilter />
        <MoviesGrid />
      </section>
    </>
  );
}
```

Each child component manages its own data. No props drilling from pages.

### Detail page composition

Detail pages parse the route param and pass it to major sections:

```tsx
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const tmdbId = parseInt(id, 10);
  if (isNaN(tmdbId) || tmdbId <= 0) notFound();

  return (
    <>
      <MovieHeader tmdbId={tmdbId} />
      <MovieStats tmdbId={tmdbId} />
      <MovieTabs tmdbId={tmdbId} />
    </>
  );
}
```

### Conditional composition

Components conditionally render based on data state:

```tsx
function MovieTabsContent({ tmdbId, inLibrary }: MovieTabsContentProps) {
  return inLibrary ? (
    <Tabs defaultValue="overview">
      <TabsList>...</TabsList>
      <TabsContent value="overview"><OverviewTab tmdbId={tmdbId} /></TabsContent>
      <TabsContent value="files"><FilesTab tmdbId={tmdbId} /></TabsContent>
      {/* ... */}
    </Tabs>
  ) : (
    <OverviewTab tmdbId={tmdbId} />
  );
}
```

## Component Splitting Decision

### When to split into a folder

Split when a component has **2+ private sub-components** that are only used by it:
- `movies-grid/` → `index.tsx` + `movie-card.tsx` + `movie-item.tsx`
- `movie-header/` → `index.tsx` + `library-status-badge.tsx`

### When to keep as a single file

Keep as a single file when sub-components are small and tightly coupled:
- `cast-section.tsx` contains `CastCard` internally (small, only used here)
- `featured-movie.tsx` contains loading/error/success states internally

### Rule of thumb

If the sub-component could be useful outside this component → extract to its own file in the same folder. If it's small (<30 lines) and only used here → keep it internal.
