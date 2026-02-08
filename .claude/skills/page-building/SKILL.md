---
name: page-building
description: Use when building a new page from scratch — library listing pages, detail pages, or browse pages. Covers the full architecture including route structure, page composition, filter systems, grid/detail layouts, and tab patterns.
---

# Page Building

This skill defines how to build new pages in the homeflix frontend, covering both library listing pages and detail pages.

## Page Types

| Type | Example | Structure |
|---|---|---|
| Library listing | `/library/movies`, `/library/shows` | Featured + Filter + Grid |
| Detail page | `/media/movies/[id]`, `/media/shows/[id]` | Header + Stats + Tabs |
| Browse page | `/browse` | Featured + Browse rows + Search |

## Building a Library Listing Page

### Step 1: Route Structure

```
app/(protected)/library/{media}/
├── page.tsx
└── _components/
    ├── featured-{media}.tsx    # Hero section with random featured item
    └── {media}-grid.tsx        # Integrates filters, tabs, and grid rendering
```

The grid component owns the filter hook (`useMediaFilters`) and passes filter state to query options. Filters are integrated into the grid — no separate filter component. Card and list item rendering uses shared components from `components/media/items/`.

### Step 2: Entity Type

Define in `api/entities/{media}/`:

```tsx
// api/entities/{media}/{media}-item.ts
export interface MediaItem {
  id: string | number;
  title: string;
  year?: number;
  type: '{media}';             // Discriminator
  status: MediaStatus;
  posterUrl?: string;
  backdropUrl?: string;
  quality?: string;
  rating?: number;
  runtime?: number;
  genres?: string[];
  // ... media-specific fields
}
```

### Step 3: API Function

Create in `api/functions/{media}/library.ts`:

```tsx
export async function fetchMediaItems(props: MediaItemsRequest): Promise<MediaItemsResponse> {
  const client = createApiClient();
  const { data, error } = await client.GET('/api/endpoint');

  if (error) throw new Error('Failed to fetch');

  const items = data.map(mapToMediaItem);

  return {
    stats: {
      all: items.length,
      // ... status counts for tabs
    },
    items: items
      .filter(filterByStatus(props.status ?? 'all'))
      .filter(filterBySearch(props.search ?? ''))
      .filter(filterByGenres(props.genres ?? []))
      .sort(sortItems(props.sortField ?? 'title', props.sortDirection ?? 'asc')),
  };
}
```

### Step 4: Query Options

Create in `options/queries/{media}/library.ts`:

```tsx
export function mediaQueryOptions(props: MediaQueryProps) {
  return queryOptions({
    queryKey: ['{media}', props],
    queryFn: async () => await fetchMediaItems(props),
    staleTime: 2 * 60 * 1000,
  });
}

export function featuredMediaQuery() {
  return queryOptions({
    queryKey: ['{media}', 'featured'],
    queryFn: async () => await fetchFeaturedMedia(),
    staleTime: 2 * 60 * 1000,
  });
}
```

### Step 5: Filter Hook

Create in `hooks/filters/use-{media}-filters.ts`:

```tsx
import { parseAsString, parseAsStringLiteral, parseAsArrayOf, parseAsInteger, useQueryStates } from 'nuqs';

export const sortFields = ['added', 'title', 'year', 'rating'] as const;
export const sortDirections = ['asc', 'desc'] as const;
export const tabValues = ['all', 'downloaded', 'missing', 'wanted'] as const;
export const viewModes = ['grid', 'list'] as const;

const filterParsers = {
  q: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(sortFields).withDefault('title'),
  dir: parseAsStringLiteral(sortDirections).withDefault('asc'),
  tab: parseAsStringLiteral(tabValues).withDefault('all'),
  view: parseAsStringLiteral(viewModes).withDefault('grid'),
  genres: parseAsArrayOf(parseAsString).withDefault([]),
  yearMin: parseAsInteger,
  yearMax: parseAsInteger,
  ratingMin: parseAsInteger,
};

export function useMediaFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'replace',
    shallow: true,
  });

  // ... setter helpers, clearFilters, activeFilterCount
  return { filters, setFilters, /* helpers */ };
}
```

### Step 6: Page Component

```tsx
// page.tsx — Server component, pure composition
export default function MediaPage() {
  return (
    <Suspense>
      <FeaturedMedia />
      <MediaGrid />
    </Suspense>
  );
}
```

### Step 7: Components

Each component manages its own query. The grid owns the filter hook and passes filter state to query options. URL state is managed via `nuqs` (shareable, bookmarkable).

The grid renders status tabs with counts from `stats`, and uses `<MediaGrid>` from `components/media/` for the actual grid rendering. Card/list item rendering uses `<MediaCard>` and `<MediaItem>` from `components/media/items/`.

## Building a Detail Page

### Step 1: Route Structure

```
app/(protected)/media/{media}/[id]/
├── page.tsx
└── _components/
    ├── {media}-header/
    │   ├── index.tsx
    │   └── library-status-badge.tsx
    ├── {media}-stats.tsx
    └── {media}-tabs/
        ├── index.tsx
        ├── overview-tab/
        │   ├── index.tsx
        │   ├── section-header.tsx
        │   ├── overview-section.tsx
        │   ├── cast-section.tsx
        │   ├── gallery-section.tsx
        │   ├── recommendations-section.tsx
        │   ├── similar-section.tsx
        │   └── ... more sections
        ├── files-tab.tsx
        ├── history-tab.tsx
        └── manage-tab.tsx
```

### Step 2: Page Component

```tsx
// page.tsx — Async server component
type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId <= 0) notFound();

  return (
    <>
      <MediaHeader id={parsedId} />
      <MediaStats id={parsedId} />
      <MediaTabs id={parsedId} />
    </>
  );
}
```

### Step 3: Header Component

The header is the hero section with backdrop image, poster, title, metadata, and library status:

```
┌────────────────────────────────────────────────┐
│  Backdrop Image (original, aspect-[2.4/1])     │
│  ┌──────────┐                                  │
│  │          │  ← gradient overlays (L→R, B→T)  │
│  │  Poster  │  Title                           │
│  │ (w500)   │  Year · Runtime · Rating · Genre │
│  │ 2:3      │  [Library Badge] [Trailer Btn]   │
│  └──────────┘                                  │
└────────────────────────────────────────────────┘
```

Uses its own query (e.g., `tmdbMovieQueryOptions(id)`) with `<Query>` wrapper.

### Step 4: Stats Component

Grid of 4 stat cards showing key metrics. May combine multiple queries with `<Queries>`:

```tsx
<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
  <StatCard label="Rating" value="8.5" icon={Star} />
  <StatCard label="Status" value="Downloaded" icon={CheckCircle2} />
  {/* ... */}
</div>
```

### Step 5: Tab System

The tab container queries library status to determine which tabs to show:

```tsx
function MediaTabs({ id }: Props) {
  const libraryQuery = useQuery(libraryLookupOptions(id));

  return (
    <Query
      result={libraryQuery}
      callbacks={{
        loading: TabsLoading,
        error: (error) => <TabsError error={error} />,
        success: (data) => (
          <MediaTabsContent id={id} inLibrary={data.inLibrary} />
        ),
      }}
    />
  );
}

function MediaTabsContent({ id, inLibrary }: Props) {
  return inLibrary ? (
    <Tabs defaultValue="overview">
      <TabsList className="mb-6 grid w-full grid-cols-4 bg-muted/20">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="manage">Manage</TabsTrigger>
      </TabsList>
      <TabsContent value="overview"><OverviewTab id={id} /></TabsContent>
      <TabsContent value="files"><FilesTab id={id} /></TabsContent>
      <TabsContent value="history"><HistoryTab id={id} /></TabsContent>
      <TabsContent value="manage"><ManageTab id={id} /></TabsContent>
    </Tabs>
  ) : (
    <OverviewTab id={id} />
  );
}
```

### Step 6: Overview Tab Sections

The overview tab composes independent sections:

```tsx
function OverviewTabContent({ data }: Props) {
  return (
    <div className="flex flex-col space-y-8">
      <OverviewSection overview={data.overview} />      {/* Data-passed */}
      <GallerySection id={data.id} />                   {/* Own query */}
      <CastSection id={data.id} />                      {/* Own query */}
      <CrewSection id={data.id} />                       {/* Own query (shared cache with cast) */}
      <DetailsSection data={data} id={data.id} />       {/* Hybrid */}
      <ProductionSection data={data} />                  {/* Data-passed */}
      <ExternalLinksSection data={data} />               {/* Data-passed */}
    </div>
  );
}
```

#### Section patterns

| Pattern | When to use | Example |
|---|---|---|
| **Data-passed** | Simple display, no extra fetch needed | OverviewSection, ProductionSection |
| **Independent query** | Needs separate API data | CastSection, GallerySection |
| **Hybrid** | Receives some data, child fetches more | DetailsSection (has KeywordsSection inside) |

Every section that fetches data follows this structure:

```tsx
function Section({ id }: Props) {
  const query = useQuery(sectionQueryOptions(id));
  return (
    <Query result={query} callbacks={{
      loading: SectionLoading,
      error: () => null,        // Silent failure
      success: (data) => <SectionContent data={data} />,
    }} />
  );
}
```

## Shared Components to Use

### From `components/media/`

| Component | Purpose |
|---|---|
| `MediaGrid` | Grid/list with optional virtualization |
| `MediaCard` | Poster card with status badge + slots (`components/media/items/`) |
| `MediaItem` | Row-based list item with slots (`components/media/items/`) |
| `FeaturedMedia` | Hero featured item for browse pages (`components/media/browse/`) |
| `MediaBrowse` | Browse grid with category rows (`components/media/browse/`) |
| `MediaRow` | Horizontal scrolling category row (`components/media/browse/`) |
| `GridEmpty` | Empty state with icon + message |
| `GridSkeleton` | Loading skeleton for grid/list |

### From `components/query/`

| Component | Purpose |
|---|---|
| `Query` | Single query state handler |
| `Queries` | Multiple query state handler |

### From `components/ui/`

All shadcn/ui components. Key ones for pages:

- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` — Tab system
- `Badge` — Status, quality, count badges
- `Button` — Actions
- `Skeleton` — Loading states
- `Carousel` — Horizontal scrolling (cast, gallery)
- `Dialog` — Lightbox, modals
- `Tooltip` — Hover info
- `AspectRatio` — Consistent image ratios
- `Popover` — Filter popovers

## Query Cache Sharing

Multiple components on the same page can use the same query without duplicate requests. TanStack Query deduplicates by query key:

```
MovieHeader → tmdbMovieQueryOptions(123)   ← fetches
MovieStats  → tmdbMovieQueryOptions(123)   ← uses cache
OverviewTab → tmdbMovieQueryOptions(123)   ← uses cache

CastSection → tmdbCreditsQueryOptions(123) ← fetches
CrewSection → tmdbCreditsQueryOptions(123) ← uses cache
```

Design your query options to maximize cache sharing across components on the same page.

## Checklist: New Page

### Library listing page
- [ ] Entity type in `api/entities/`
- [ ] API functions in `api/functions/library/`
- [ ] Mapper/filter/sort utils in `api/utils/`
- [ ] Query options in `options/queries/`
- [ ] Filter hook in `hooks/filters/`
- [ ] `page.tsx` — Server component, pure composition
- [ ] Featured component with query
- [ ] Filter component (search, popover, active filters, sort, view toggle)
- [ ] Grid component with tabs + MediaGrid
- [ ] Card component wrapping MediaCard
- [ ] List item component wrapping MediaListItem
- [ ] Loading skeletons for all query states
- [ ] Error states for primary components
- [ ] Empty state for grid

### Detail page
- [ ] Detail entity types in `api/entities/`
- [ ] TMDB/API query options in `options/queries/`
- [ ] Library lookup query options
- [ ] `page.tsx` — Async server component, ID validation, three-section composition
- [ ] Header component (backdrop, poster, metadata, status badge)
- [ ] Stats component (2-4 stat cards)
- [ ] Tabs component (conditional on library status)
- [ ] Overview tab with composable sections
- [ ] Each section: Loading + Error + Success states
- [ ] Files tab (library-only)
- [ ] History tab (library-only, conditional query)
- [ ] Manage tab (library-only, actions)
