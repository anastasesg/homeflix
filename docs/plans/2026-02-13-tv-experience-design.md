# TV Experience Design

**Date:** 2026-02-13
**Status:** Approved
**Platforms:** Android TV (Google TV), LG webOS
**Approach:** TV-optimized web route (`/tv`) in existing Next.js app

## Summary

Add a dedicated `/tv` route tree to Homeflix with a 10-foot UI optimized for D-pad remote and voice input. The TV experience focuses on browse, discover, and view details — no media management, no playback (deferred). Distribution via TWA (Android TV) and web app package (LG webOS).

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Platforms | Android TV + LG webOS | Largest smart TV ecosystems |
| Input | D-pad remote + Google Assistant voice | Standard TV interaction model |
| Scope | Browse, discover, details | Management stays on desktop/mobile |
| Playback | Deferred | Jellyfin integration in a later phase |
| Architecture | `/tv` route in existing Next.js app | Shares data layer, no duplication |
| Distribution | TWA (Android TV) + web app (LG) | One web codebase, two thin shells |

## Route Structure

```
app/(tv)/
├── layout.tsx          — TV shell: rail nav + spatial nav provider + 10-foot typography
├── page.tsx            — Home: featured hero + media rows
├── movies/
│   ├── page.tsx        — Movie browse grid
│   └── [id]/
│       └── page.tsx    — Movie detail
├── shows/
│   ├── page.tsx        — Show browse grid
│   └── [id]/
│       └── page.tsx    — Show detail
├── search/
│   └── page.tsx        — Voice/keyboard search results
└── _components/        — TV-specific components
```

**Shared layers (no duplication):** `api/`, `options/queries/`, `components/query/`
**TV-only layers:** `app/(tv)/_components/`

## Spatial Navigation & Focus

**Library:** `@noriginmedia/norigin-spatial-navigation` (~8KB, de facto standard for web TV apps)

**Focus architecture:**
- `SpatialNavigation` provider wraps the TV layout
- `FocusSection` groups: rail nav, hero, each media row
- `FocusableItem` wraps each interactive element (cards, buttons, nav items)

**Focus behavior:**
- Left arrow from content → rail nav
- Right arrow from rail nav → content (restores last focused item)
- Up/Down in content → moves between rows
- Left/Right in a row → moves between cards, auto-scrolls
- Enter on card → navigate to detail
- Back button → browser back (Android TV back key)

**Focus ring styling:**
- 3px solid ring using `accent` color
- `ring-offset-2` for breathing room
- `scale(1.05)` transform on focused cards
- `150ms ease-out` transition

## TV Components

All in `app/(tv)/_components/`.

### TV Media Card (`tv-media-card.tsx`)
- ~300px wide (5-6 per row on 1920px)
- 2:3 poster aspect ratio
- Unfocused: poster only, `opacity-80`
- Focused: `scale-105`, full opacity, title + year below, focus ring
- No hover states

### TV Media Row (`tv-media-row.tsx`)
- Section title (`text-2xl font-semibold`)
- Horizontal scrolling card list
- Focus on card auto-scrolls the row
- Row remembers last focused card

### TV Rail Nav (`tv-rail-nav.tsx`)
- Fixed left, full height, ~80px wide
- Icons stacked vertically with `gap-6`
- Focused: icon + label slides out to ~200px
- Sections: Home, Movies, Shows, Search
- App logo at top, clock at bottom

### TV Featured Hero (`tv-featured-hero.tsx`)
- Full-width backdrop, 16:9 aspect ratio
- Gradient overlay from left (title, year, rating, synopsis)
- Auto-advances every 10s, pauses on focus
- D-pad left/right cycles items
- "View Details" focusable button

### TV Detail Page
- Full-width backdrop (top 40%)
- Title, metadata row (year, runtime, rating), synopsis
- Action buttons: "Add to Library" / "View on Jellyfin" (future)
- "Similar titles" media row below

## Typography Scale (10-foot)

| Element | Size | Tailwind |
|---------|------|----------|
| Body text | 18px min | `text-lg` |
| Card titles | 20px | `text-xl` |
| Section headers | 24px | `text-2xl` |
| Page titles | 36px | `text-4xl` |
| Hero title | 48px | `text-5xl` |

## Data Flow

TV pages use the identical data pipeline:

```
api/clients/ → api/functions/ → options/queries/ → app/(tv)/ pages
```

Same `queryOptions` factories, same `Query`/`Queries` wrappers. Only the rendering components differ.

## Search

Two input modes:
1. **Voice:** Google Assistant sends text via Android TV `SEARCH` intent → TWA navigates to `/tv/search?q=<query>`
2. **On-screen keyboard:** Browser-native virtual keyboard, triggered on search input focus + Enter

Uses existing TMDB search API functions.

## Distribution

### Android TV — TWA
- Scaffolded with `bubblewrap` CLI
- Points to `https://<homeflix-domain>/tv`
- Digital Asset Links file at `.well-known/assetlinks.json`
- Published to Google Play Store (Android TV category)
- Receives `SEARCH` intents for voice queries
- Requires HTTPS with public domain

### LG webOS — Web App
- Packaged with `ares-cli` toolchain
- Loads `https://<homeflix-domain>/tv` in webview
- Sideload via dev mode or publish to LG Content Store

### Local-only alternative
If no public domain: skip TWA, use a sideloaded WebView-based APK for Android TV. LG can sideload directly.

## Phased Rollout

1. **Phase 1:** Build `/tv` web experience, test in desktop browser at 1920x1080
2. **Phase 2:** Package TWA for Android TV, test on emulator or device
3. **Phase 3:** Package LG webOS app, test on LG TV or emulator
