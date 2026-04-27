# TV Experience Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/tv` route tree to Homeflix with a 10-foot UI for Android TV and LG webOS, using D-pad spatial navigation.

**Architecture:** Dedicated `app/(tv)/` route group with its own layout (rail nav + spatial nav provider). Shares the existing data layer (`api/`, `options/queries/`, `components/query/`). TV-specific components live in `app/(tv)/_components/`. No changes to the existing desktop/mobile app.

**Tech Stack:** Next.js 16, React 19, `@noriginmedia/norigin-spatial-navigation`, TanStack React Query, Tailwind CSS 4, Lucide icons.

**Design doc:** `docs/plans/2026-02-13-tv-experience-design.md`

**Verification:** No test framework. Verify with `bun check` (TypeScript) and `bun lint --fix` (ESLint) after each task. Visual testing in desktop browser at 1920x1080.

---

## Task 1: Install spatial navigation and create TV layout shell

**Files:**
- Modify: `package.json` (add dependency)
- Create: `app/(tv)/layout.tsx`
- Create: `app/(tv)/_components/tv-spatial-provider.tsx`

**Step 1: Install the spatial navigation library**

```bash
bun add @noriginmedia/norigin-spatial-navigation
```

**Step 2: Create the spatial navigation provider wrapper**

Create `app/(tv)/_components/tv-spatial-provider.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { init } from '@noriginmedia/norigin-spatial-navigation';

interface TvSpatialProviderProps {
  children: React.ReactNode;
}

function TvSpatialProvider({ children }: TvSpatialProviderProps) {
  useEffect(() => {
    init({
      debug: false,
      visualDebug: false,
    });
  }, []);

  return <>{children}</>;
}

export { TvSpatialProvider };
```

**Step 3: Create the TV layout**

Create `app/(tv)/layout.tsx`. This is the TV shell — spatial nav provider + base styles + content area. The rail nav comes in Task 2.

```tsx
import type { Metadata } from 'next';

import { TvSpatialProvider } from './_components/tv-spatial-provider';

export const metadata: Metadata = {
  title: {
    default: 'Homeflix TV',
    template: '%s | Homeflix TV',
  },
};

type TvLayoutProps = React.PropsWithChildren;

export default function TvLayout({ children }: TvLayoutProps) {
  return (
    <TvSpatialProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        {/* Rail nav slot — added in Task 2 */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </TvSpatialProvider>
  );
}
```

**Step 4: Create a placeholder TV home page**

Create `app/(tv)/page.tsx`:

```tsx
export default function TvHomePage() {
  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-5xl font-bold">Homeflix TV</h1>
    </div>
  );
}
```

**Step 5: Verify and commit**

```bash
bun check && bun lint --fix
git add app/(tv)/ package.json bun.lock
git commit -m "feat(tv): add spatial navigation and TV layout shell"
```

---

## Task 2: Build the TV rail navigation

**Files:**
- Create: `app/(tv)/_components/tv-rail-nav.tsx`
- Modify: `app/(tv)/layout.tsx` (add rail nav)

**Step 1: Create the rail nav component**

Create `app/(tv)/_components/tv-rail-nav.tsx`:

```tsx
'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { Film, Home, Search, Tv } from 'lucide-react';

import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', icon: Home, href: '/tv' },
  { key: 'movies', label: 'Movies', icon: Film, href: '/tv/movies' },
  { key: 'shows', label: 'Shows', icon: Tv, href: '/tv/shows' },
  { key: 'search', label: 'Search', icon: Search, href: '/tv/search' },
];

// ============================================================
// Sub-components
// ============================================================

interface TvRailNavItemProps {
  item: NavItem;
  isActive: boolean;
}

function TvRailNavItem({ item, isActive }: TvRailNavItemProps) {
  const router = useRouter();
  const Icon = item.icon;

  const { ref, focused } = useFocusable({
    onEnterPress: () => router.push(item.href),
  });

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-4 rounded-xl px-5 py-4 transition-all duration-150 ease-out',
        'outline-none',
        focused && 'bg-accent/20 ring-3 ring-accent scale-105',
        isActive && !focused && 'bg-accent/10',
        !focused && !isActive && 'opacity-60',
      )}
    >
      <Icon className="size-7 shrink-0" />
      <span
        className={cn(
          'text-lg font-medium whitespace-nowrap transition-all duration-150',
          focused ? 'w-auto opacity-100' : 'w-0 overflow-hidden opacity-0',
        )}
      >
        {item.label}
      </span>
    </div>
  );
}

// ============================================================
// Main
// ============================================================

function TvRailNav() {
  const pathname = usePathname();

  const { ref, focusKey } = useFocusable({
    trackChildren: true,
    saveLastFocusedChild: true,
    isFocusBoundary: false,
    focusKey: 'rail-nav',
  });

  const isActive = useCallback(
    (href: string) => {
      if (href === '/tv') return pathname === '/tv';
      return pathname.startsWith(href);
    },
    [pathname],
  );

  return (
    <FocusContext.Provider value={focusKey}>
      <nav
        ref={ref}
        className="flex h-full w-20 flex-col items-center gap-2 border-r border-border/20 py-8"
      >
        <div className="mb-8 text-2xl font-bold text-accent">H</div>
        <div className="flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <TvRailNavItem key={item.key} item={item} isActive={isActive(item.href)} />
          ))}
        </div>
      </nav>
    </FocusContext.Provider>
  );
}

export { TvRailNav };
```

**Step 2: Add rail nav to the layout**

In `app/(tv)/layout.tsx`, import and render `TvRailNav` before the `<main>` element.

**Step 3: Verify and commit**

```bash
bun check && bun lint --fix
git add app/(tv)/
git commit -m "feat(tv): add rail navigation with spatial focus"
```

---

## Task 3: Build the TV media card

**Files:**
- Create: `app/(tv)/_components/tv-media-card.tsx`

**Step 1: Create the TV media card**

Create `app/(tv)/_components/tv-media-card.tsx`:

This component receives a media item and renders a focusable poster card. On focus: scales up, shows title + year, shows focus ring. On enter: navigates to detail page.

Key patterns from existing codebase:
- Use `cn()` from `@/lib/utils` for conditional classes
- Use semantic tokens (`accent`, `border`, `muted-foreground`) not hardcoded colors
- Named export, `interface Props` above component
- Follow `useFocusable` pattern from norigin library

```tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Film } from 'lucide-react';

import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

interface TvMediaCardProps {
  id: number;
  title: string;
  year?: number;
  posterUrl?: string;
  mediaType: 'movie' | 'show';
  onFocus?: (layout: { x: number; node: HTMLElement }) => void;
}

// ============================================================
// Main
// ============================================================

function TvMediaCard({ id, title, year, posterUrl, mediaType, onFocus }: TvMediaCardProps) {
  const router = useRouter();
  const href = mediaType === 'movie' ? `/tv/movies/${id}` : `/tv/shows/${id}`;

  const { ref, focused } = useFocusable({
    onEnterPress: () => router.push(href),
    onFocus: (layout) => onFocus?.({ x: layout.x, node: layout.node }),
  });

  return (
    <div
      ref={ref}
      className={cn(
        'flex w-[200px] shrink-0 flex-col gap-2 outline-none transition-all duration-150 ease-out',
        focused ? 'scale-105 opacity-100' : 'scale-100 opacity-70',
      )}
    >
      <div
        className={cn(
          'relative aspect-[2/3] overflow-hidden rounded-xl',
          focused && 'ring-3 ring-accent ring-offset-2 ring-offset-background',
        )}
      >
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Film className="size-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <div
        className={cn(
          'transition-opacity duration-150',
          focused ? 'opacity-100' : 'opacity-0',
        )}
      >
        <p className="truncate text-lg font-medium">{title}</p>
        {year && <p className="text-base text-muted-foreground">{year}</p>}
      </div>
    </div>
  );
}

export type { TvMediaCardProps };
export { TvMediaCard };
```

**Step 2: Verify and commit**

```bash
bun check && bun lint --fix
git add app/(tv)/_components/tv-media-card.tsx
git commit -m "feat(tv): add focusable media card component"
```

---

## Task 4: Build the TV media row

**Files:**
- Create: `app/(tv)/_components/tv-media-row.tsx`

**Step 1: Create the TV media row**

This is a horizontal scrolling section with a title and a row of TV media cards. When a card receives focus, the row auto-scrolls to keep it visible.

```tsx
'use client';

import { useCallback, useRef } from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';

import { TvMediaCard } from './tv-media-card';

// ============================================================
// Types
// ============================================================

interface TvMediaItem {
  id: number;
  title: string;
  year?: number;
  posterUrl?: string;
  mediaType: 'movie' | 'show';
}

interface TvMediaRowProps {
  title: string;
  items: TvMediaItem[];
  focusKey?: string;
}

// ============================================================
// Main
// ============================================================

function TvMediaRow({ title, items, focusKey: focusKeyParam }: TvMediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { ref, focusKey } = useFocusable({
    focusKey: focusKeyParam,
    trackChildren: true,
    saveLastFocusedChild: true,
  });

  const handleCardFocus = useCallback((layout: { x: number; node: HTMLElement }) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: layout.x - 80,
      behavior: 'smooth',
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <FocusContext.Provider value={focusKey}>
      <section ref={ref} className="flex flex-col gap-4 py-4">
        <h2 className="px-12 text-2xl font-semibold">{title}</h2>
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto px-12"
        >
          {items.map((item) => (
            <TvMediaCard
              key={item.id}
              id={item.id}
              title={item.title}
              year={item.year}
              posterUrl={item.posterUrl}
              mediaType={item.mediaType}
              onFocus={handleCardFocus}
            />
          ))}
        </div>
      </section>
    </FocusContext.Provider>
  );
}

export type { TvMediaItem };
export { TvMediaRow };
```

**Step 2: Verify and commit**

```bash
bun check && bun lint --fix
git add app/(tv)/_components/tv-media-row.tsx
git commit -m "feat(tv): add auto-scrolling media row with focus tracking"
```

---

## Task 5: Build the TV featured hero

**Files:**
- Create: `app/(tv)/_components/tv-featured-hero.tsx`

**Step 1: Create the TV featured hero**

Auto-rotating hero carousel. References existing `featured-media.tsx` patterns (8s auto-advance, gradient overlays) but adapted for TV: 16:9 aspect ratio, larger text, focusable navigation, no hover/touch.

```tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

interface FeaturedItem {
  id: number;
  title: string;
  overview: string;
  year?: number;
  rating?: number;
  backdropUrl?: string;
  mediaType: 'movie' | 'show';
}

interface TvFeaturedHeroProps {
  items: FeaturedItem[];
}

// ============================================================
// Main
// ============================================================

function TvFeaturedHero({ items }: TvFeaturedHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isPaused = useRef(false);
  const router = useRouter();

  const active = items[activeIndex];

  // Auto-advance every 10 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      if (!isPaused.current) {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [items.length]);

  const { ref, focusKey, focused } = useFocusable({
    focusKey: 'featured-hero',
    trackChildren: true,
    onArrowPress: (direction) => {
      if (direction === 'left') {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
        return false; // consume the event
      }
      if (direction === 'right') {
        setActiveIndex((prev) => (prev + 1) % items.length);
        return false;
      }
      return true; // let up/down propagate
    },
    onFocus: () => {
      isPaused.current = true;
    },
    onBlur: () => {
      isPaused.current = false;
    },
  });

  const handleViewDetails = useCallback(() => {
    if (!active) return;
    const path = active.mediaType === 'movie' ? `/tv/movies/${active.id}` : `/tv/shows/${active.id}`;
    router.push(path);
  }, [active, router]);

  const { ref: buttonRef, focused: buttonFocused } = useFocusable({
    onEnterPress: handleViewDetails,
  });

  if (!active) return null;

  return (
    <FocusContext.Provider value={focusKey}>
      <section ref={ref} className="relative aspect-video w-full overflow-hidden">
        {/* Backdrop */}
        {active.backdropUrl && (
          <Image
            src={active.backdropUrl}
            alt={active.title}
            fill
            className="object-cover transition-opacity duration-700"
            priority
            sizes="100vw"
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end gap-4 p-12 pb-16">
          <h1 className="max-w-2xl text-5xl font-bold leading-tight">{active.title}</h1>

          <div className="flex items-center gap-4 text-lg text-muted-foreground">
            {active.rating && (
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="size-5 fill-current" />
                {active.rating.toFixed(1)}
              </span>
            )}
            {active.year && <span>{active.year}</span>}
          </div>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground line-clamp-3">
            {active.overview}
          </p>

          <div
            ref={buttonRef}
            className={cn(
              'mt-2 w-fit rounded-lg px-8 py-3 text-xl font-semibold transition-all duration-150',
              buttonFocused
                ? 'bg-accent text-accent-foreground scale-105 ring-3 ring-accent/50'
                : 'bg-muted/30 text-foreground',
            )}
          >
            View Details
          </div>

          {/* Slide indicators */}
          {items.length > 1 && (
            <div className="mt-4 flex gap-2">
              {items.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i === activeIndex ? 'w-8 bg-accent' : 'w-4 bg-muted-foreground/30',
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </FocusContext.Provider>
  );
}

export type { FeaturedItem };
export { TvFeaturedHero };
```

**Step 2: Verify and commit**

```bash
bun check && bun lint --fix
git add app/(tv)/_components/tv-featured-hero.tsx
git commit -m "feat(tv): add auto-rotating featured hero with D-pad navigation"
```

---

## Task 6: Build the TV home page

**Files:**
- Modify: `app/(tv)/page.tsx`

**Step 1: Wire up the TV home page with real data**

Replace the placeholder with a Netflix-style home: featured hero at top, then media rows. Uses existing query options from `options/queries/movies/` and `options/queries/shows/`.

Reference the existing movie browse pattern in `app/(protected)/media/movies/(page)/` — each row has its own query. Use `Query` wrapper from `components/query/`.

The TV home page needs a data mapper to convert API entities into the `TvMediaItem` and `FeaturedItem` shapes used by TV components. Define these mappers inline in the page (or in a `_utils.ts` file if they grow).

```tsx
'use client';

import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';

import { Query } from '@/components/query';
import { trendingMoviesQueryOptions, topRatedMoviesQueryOptions, nowPlayingMoviesQueryOptions } from '@/options/queries/movies';
import { trendingShowsQueryOptions } from '@/options/queries/shows';

import { TvFeaturedHero } from './_components/tv-featured-hero';
import { TvMediaRow } from './_components/tv-media-row';

// Map API entities to TV component props — adjust field names based on actual entity shapes
// Check api/entities/ for the exact field names (title, posterPath, releaseDate, etc.)
```

Important: Before writing this file, **read the entity types** in `api/entities/` to get exact field names for the mapper functions. The entities returned by `fetchTrendingMovies` etc. have specific shapes (likely `title`, `posterPath`, `releaseDate`, `voteAverage`, `backdropPath`, `overview`).

Also read `api/functions/` to confirm what the fetch functions return — they may already map to domain entities.

**Step 2: Verify and commit**

```bash
bun check && bun lint --fix
git add app/(tv)/page.tsx
git commit -m "feat(tv): wire up home page with featured hero and media rows"
```

---

## Task 7: Build the TV movie browse page

**Files:**
- Create: `app/(tv)/movies/page.tsx`

**Step 1: Create the movie browse grid**

A grid of focusable movie cards showing the full movie library or discovery results. Uses `trendingMoviesQueryOptions` (or a dedicated browse query if available).

Layout: responsive grid that works at 1920px — 5-6 columns of TV media cards. Vertical scrolling, focus auto-scrolls the page.

Follow the same data fetching pattern as Task 6 — `Query` wrapper + query options + TV media card.

**Step 2: Verify and commit**

```bash
bun check && bun lint --fix
git add app/(tv)/movies/
git commit -m "feat(tv): add movie browse grid page"
```

---

## Task 8: Build the TV movie detail page

**Files:**
- Create: `app/(tv)/movies/[id]/page.tsx`

**Step 1: Create the movie detail page**

Full-width backdrop (top 40%), title + metadata + synopsis below, "Similar titles" row at bottom.

Uses `movieDetailQueryOptions(tmdbId)` from `options/queries/movies/detail.ts`. Read that file first to understand the query shape.

Layout:
- Backdrop image (aspect-video, 100% width, top of page)
- Gradient overlay (bottom → background)
- Below: title (`text-4xl`), metadata row (year, runtime, rating), synopsis (`text-lg`)
- Focusable action buttons
- Similar titles `TvMediaRow` at bottom

**Step 2: Verify and commit**

```bash
bun check && bun lint --fix
git add app/(tv)/movies/[id]/
git commit -m "feat(tv): add movie detail page with backdrop and metadata"
```

---

## Task 9: Build the TV show pages (browse + detail)

**Files:**
- Create: `app/(tv)/shows/page.tsx`
- Create: `app/(tv)/shows/[id]/page.tsx`

**Step 1: Create show browse page**

Mirror the movie browse page (Task 7) but using show query options from `options/queries/shows/`.

**Step 2: Create show detail page**

Mirror the movie detail page (Task 8) but using show query options. Show detail may include season/episode info — read `options/queries/shows/detail.ts` to understand the data shape.

**Step 3: Verify and commit**

```bash
bun check && bun lint --fix
git add app/(tv)/shows/
git commit -m "feat(tv): add show browse and detail pages"
```

---

## Task 10: Build the TV search page

**Files:**
- Create: `app/(tv)/search/page.tsx`

**Step 1: Create the search page**

Accepts `?q=` URL parameter (populated by voice search or on-screen keyboard). Uses `searchMoviesQueryOptions(query)` and potentially a combined search.

Layout:
- Search input at top (focusable, triggers on-screen keyboard on Enter)
- URL state via `nuqs` `useQueryState` for the `q` parameter
- Results grid below (same pattern as browse pages)
- Empty state when no query

Uses the `searchMoviesQueryOptions` and `searchShowsQueryOptions` (check if a combined search exists in `options/queries/search.ts`).

**Step 2: Verify and commit**

```bash
bun check && bun lint --fix
git add app/(tv)/search/
git commit -m "feat(tv): add search page with voice and keyboard input"
```

---

## Task 11: Add scrollbar-hide utility and TV-specific Tailwind styles

**Files:**
- Modify: `app/globals.css` (add scrollbar-hide utility)

**Step 1: Add CSS utilities for TV**

The TV media rows use `scrollbar-hide` class for clean horizontal scrolling. Check if this utility already exists in `globals.css`. If not, add:

```css
@utility scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

Also verify that `line-clamp-3` works (Tailwind 4 includes it natively).

**Step 2: Verify and commit**

```bash
bun check && bun lint --fix
git add app/globals.css
git commit -m "feat(tv): add scrollbar-hide utility for TV media rows"
```

---

## Task 12: Update boundary spec for TV route

**Files:**
- Modify: `boundary-spec.mjs`

**Step 1: Check if `app/(tv)/` needs boundary config**

Read `boundary-spec.mjs` to understand how `app/(protected)/` is configured. The `app/` layer already exists — `app/(tv)/` should be covered by the same `app` boundary since route groups `(tv)` and `(protected)` are both under `app/`.

If the boundary spec uses specific path patterns that exclude `(tv)`, update accordingly.

**Step 2: Verify and commit**

```bash
bun lint --fix
git add boundary-spec.mjs
git commit -m "chore(tv): update boundary spec for TV route group"
```

---

## Task 13: Final verification and cleanup

**Step 1: Run full type check and lint**

```bash
bun check && bun lint --fix
```

Fix any remaining issues.

**Step 2: Test in browser at 1920x1080**

Open `http://localhost:3000/tv` in a desktop browser. Resize to 1920x1080. Verify:
- Rail nav renders on the left
- Home page shows featured hero + media rows
- Arrow keys navigate between elements (spatial nav)
- Enter key selects items / navigates to detail pages
- Movie and show browse pages render grids
- Detail pages show backdrop + metadata
- Search page accepts input and shows results

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(tv): complete Phase 1 TV experience with spatial navigation"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Install spatial nav + TV layout shell | `app/(tv)/layout.tsx`, `_components/tv-spatial-provider.tsx` |
| 2 | Rail navigation | `_components/tv-rail-nav.tsx` |
| 3 | TV media card | `_components/tv-media-card.tsx` |
| 4 | TV media row | `_components/tv-media-row.tsx` |
| 5 | Featured hero | `_components/tv-featured-hero.tsx` |
| 6 | Home page (wired up) | `app/(tv)/page.tsx` |
| 7 | Movie browse page | `app/(tv)/movies/page.tsx` |
| 8 | Movie detail page | `app/(tv)/movies/[id]/page.tsx` |
| 9 | Show browse + detail | `app/(tv)/shows/` |
| 10 | Search page | `app/(tv)/search/page.tsx` |
| 11 | CSS utilities | `app/globals.css` |
| 12 | Boundary spec update | `boundary-spec.mjs` |
| 13 | Final verification | All files |

**Dependencies:** Tasks 1-5 build components (can be parallelized after Task 1). Tasks 6-10 are pages that depend on those components. Tasks 11-12 are support tasks. Task 13 is final.

```
Task 1 (layout + spatial nav)
├── Task 2 (rail nav)
├── Task 3 (media card)
│   └── Task 4 (media row, uses card)
│       └── Task 5 (hero)
│           └── Task 6 (home page, uses hero + row)
│               ├── Task 7 (movie browse)
│               │   └── Task 8 (movie detail)
│               ├── Task 9 (show pages)
│               └── Task 10 (search page)
├── Task 11 (CSS utilities — can be done anytime)
├── Task 12 (boundary spec — can be done anytime)
└── Task 13 (final verification — last)
```
