# Homeflix Android TV App — React Native Implementation Plan

## Context

Homeflix is a Next.js web app for managing and browsing a home media library (Radarr, Sonarr, TMDB, Prowlarr). The goal is to build a React Native Android TV client that reuses the existing data layer (types, entities, mappers, API functions, query options) with **zero duplication**, while adding TV-native UX (D-pad navigation, 10-foot UI, sidebar shell).

The TV app lives in a `/tv` subdirectory of the existing repo. Metro bundler is configured to resolve shared code from the parent directory. The existing web app structure is untouched.

---

## What's Reusable (zero changes needed)

| Layer | Path | Contents |
|-------|------|----------|
| Types | `api/types/` | MediaStatus, SortField, Genre, etc. |
| Entities | `api/entities/` | MovieItem, ShowItem, MovieDetail, ShowDetail, etc. |
| DTOs | `api/dtos/` | Request/response wrappers |
| Mappers | `api/mappers/` | 40+ pure transform functions |
| Utils | `api/utils/` | Filter/sort functions (filterByStatus, sortMovies, etc.) |
| Query Options | `options/queries/` | All queryOptions factories (TanStack Query is RN-compatible) |
| Utilities | `utilities/` | formatCurrency, formatRuntime |

## What Needs a Small Refactor

| Layer | Path | Change |
|-------|------|--------|
| Client factories | `api/clients/*/` | Add config store so TV app can provide URLs/keys without process.env |
| API functions | `api/functions/` | No changes — they call the same factory functions |

## What's TV-Only (new code in `/tv`)

- Expo project scaffold + Metro config for shared code resolution
- React Navigation shell (sidebar drawer + stack)
- TV components (TVMediaCard, TVHeroCarousel, TVMediaRow, TVMediaGrid)
- Config screen (first-launch API endpoint setup, stored in SecureStore)
- Focus management (TVFocusGuideView, hasTVPreferredFocus)
- All screen implementations

---

## Tech Stack

- **Framework**: Expo SDK 52+ with `react-native-tvos` (aliased as `react-native`)
- **TV Config**: `@react-native-tvos/config-tv` Expo plugin (handles Android manifest)
- **Navigation**: React Navigation (Drawer + Stack) — no bottom tabs
- **Spatial Nav**: Native RNTV APIs (TVFocusGuideView, hasTVPreferredFocus, nextFocusUp/Down/Left/Right)
- **Data**: `@tanstack/react-query` + `openapi-fetch` (same as web)
- **Images**: `expo-image`
- **Video**: `react-native-video` v6+
- **Icons**: `lucide-react-native`
- **Config Storage**: `expo-secure-store`

---

## Phase 0 — API Client Config Store (web repo change)

**Goal**: Let the TV app provide API URLs/keys at runtime instead of relying on `process.env.NEXT_PUBLIC_*`.

**Approach**: Add a module-level config store. Client factories check the store first, fall back to `process.env`. This means **zero changes to `api/functions/`** — they keep calling `createRadarrClient()` with no args.

### New file: `api/clients/config.ts`

```typescript
interface ClientConfig {
  radarrUrl: string; radarrKey: string;
  sonarrUrl: string; sonarrKey: string;
  tmdbKey: string;
  prowlarrUrl?: string; prowlarrKey?: string;
}

let config: ClientConfig | null = null;

export function setClientConfig(cfg: ClientConfig) { config = cfg; }
export function getClientConfig() { return config; }
```

### Modify each client factory (4 files, same pattern)

```typescript
// api/clients/radarr/radarr-client.ts — before:
const radarrApiUrl = process.env.NEXT_PUBLIC_RADARR_API_URL;

// after:
import { getClientConfig } from '@/api/clients/config';
const cfg = getClientConfig();
const radarrApiUrl = cfg?.radarrUrl ?? process.env.NEXT_PUBLIC_RADARR_API_URL;
```

**Sonarr special case**: The web client uses proxy URL `/api/sonarr`. The TV client calls Sonarr directly. After refactor, Sonarr reads `cfg?.sonarrUrl` (the real URL for TV) or falls back to `/api/sonarr` (the proxy for web).

### Files modified
- `api/clients/config.ts` (new)
- `api/clients/radarr/radarr-client.ts`
- `api/clients/sonarr/sonarr-client.ts`
- `api/clients/tmdb/tmdb-client.ts`
- `api/clients/prowlarr/prowlarr-client.ts`

### Verification
- `bun check` passes (no type errors)
- `bun dev` → web app works identically (falls back to process.env)

---

## Phase 1 — Expo TV Project Scaffold

**Goal**: Runnable Expo TV project in `/tv` that imports shared code from parent.

### 1.1 Project structure

```
tv/
  app/                          # Expo Router screens
    _layout.tsx                 # Root: loads config, wraps in providers
    (setup)/
      config.tsx                # First-launch server configuration
    (main)/
      _layout.tsx               # Sidebar drawer + stack
      home.tsx
      movies/
        index.tsx               # Movie Browse
        [id].tsx                # Movie Detail
      shows/
        index.tsx               # Show Browse
        [id].tsx                # Show Detail
        [id]/seasons/
          [seasonNumber].tsx    # Season Detail
          [seasonNumber]/episodes/
            [episodeNumber].tsx  # Episode Detail
      library/
        movies.tsx
        shows.tsx
      discover.tsx
      system.tsx
      settings.tsx
  components/
    layout/                     # TVSidebar, TVScreenShell
    media/                      # TVMediaCard, TVHeroCarousel, TVMediaRow, TVMediaGrid
    query/                      # Query/Queries (copied from web — pure React, no DOM)
    ui/                         # TVButton, TVFocusRing, TVText
  config/
    api-config.ts               # SecureStore read/write for API endpoints
    query-client.ts             # TV QueryClient instance
  hooks/
    use-tv-focus.ts             # Focus utilities
  metro.config.js
  tsconfig.json
  app.config.ts
  package.json
```

### 1.2 Metro config for shared code

```javascript
// tv/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const repoRoot = path.resolve(projectRoot, '..');
const config = getDefaultConfig(projectRoot);

// Watch parent repo for shared code
config.watchFolders = [repoRoot];

// Custom resolver: @/ in shared files → repo root, @/ in tv files → tv root
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@/')) {
    const isSharedFile = !context.originModulePath.startsWith(projectRoot + '/');
    const base = isSharedFile ? repoRoot : projectRoot;
    return context.resolveRequest(context, moduleName.replace('@/', base + '/'), platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Deduplicate React — only use tv/node_modules
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
```

### 1.3 Key dependencies

```
react-native: npm:react-native-tvos@~0.76.0
expo: ~52.0.0
@react-native-tvos/config-tv
@react-navigation/native, @react-navigation/drawer, @react-navigation/stack
@tanstack/react-query: ^5.90.0
openapi-fetch: ^0.15.0
expo-image, expo-secure-store, expo-router
@react-native-async-storage/async-storage
lucide-react-native, react-native-svg
react-native-video: ^6.0.0
```

### 1.4 App config

```typescript
// tv/app.config.ts
export default {
  name: 'Homeflix TV',
  slug: 'homeflix-tv',
  orientation: 'landscape',
  platforms: ['android'],
  plugins: ['@react-native-tvos/config-tv'],
  android: { package: 'com.homeflix.tv' },
};
```

### Verification
- `cd tv && npx expo prebuild --clean` succeeds
- `npx expo start` launches Metro without resolution errors
- Connecting to Android TV emulator shows blank root screen

---

## Phase 2 — Config Screen + API Bootstrap

**Goal**: First-run UX for entering service URLs/API keys, persisted to SecureStore.

### Config screen (`tv/app/(setup)/config.tsx`)
- Text inputs for: Radarr URL + key, Sonarr URL + key, TMDB key, Prowlarr URL + key (optional)
- "Test Connections" button — hits each API, shows green/red per service
- "Save & Continue" button — writes to SecureStore, calls `setClientConfig()`, navigates to main app
- Accessible from Settings screen later

### Root layout (`tv/app/_layout.tsx`)
- On mount: `loadConfig()` from SecureStore
- If no config → route to `(setup)/config`
- If config exists → `setClientConfig(config)`, route to `(main)/`
- Wrap in `QueryClientProvider`

### Screen dimensions note
- Android TV = 960x540 logical dp (scale 2x → 1920x1080 physical)
- All UI designed at 960dp width
- Minimum text: 18sp body, 14sp labels, 28sp headings

### Verification
- Config screen renders on Android TV emulator
- D-pad navigates between fields, Android TV keyboard pops up
- Test connections makes real HTTP requests
- After save, navigating to main app works

---

## Phase 3 — Navigation Shell

**Goal**: TV-native sidebar drawer with stack navigator for detail pages.

### Architecture
```
Root Stack
  (setup) → Config screen
  (main) → Drawer
    Home
    Movies Browse → [id] Detail (stack push)
    Shows Browse → [id] Detail → Season → Episode
    Movie Library
    Show Library
    Discover
    System Dashboard
    Settings
```

### TVSidebar component
- Collapsed by default (80dp, icons only)
- Expands on D-pad left from leftmost content element (320dp, icon + label)
- `TVFocusGuideView` bridges sidebar ↔ content boundary
- Active route highlighted with accent border + background
- Items: Home, Movies, Shows, Library Movies, Library Shows, Search, System, Settings

### Focus flow
- Sidebar items: D-pad up/down traverses, select navigates + collapses sidebar
- `hasTVPreferredFocus` on first sidebar item when expanded
- `nextFocusRight` on all sidebar items → first focusable element in content

### Verification
- Sidebar renders, D-pad navigates between items
- Selecting an item routes to the correct (placeholder) screen
- Sidebar collapses/expands correctly

---

## Phase 4 — Core TV Components

**Goal**: Build the 5 reusable components that every screen uses.

### 4.1 TVMediaCard
- `expo-image` for poster (2:3 aspect ratio)
- `Pressable` with `onFocus`/`onBlur` for focus ring (3dp accent border + scale 1.05)
- Shows title + year overlay when focused (no hover on TV)
- Status badge (downloaded/missing/wanted) in corner
- Props: `item: MovieItem | ShowItem`, `type`, `onPress`, `hasFocus?`

### 4.2 TVHeroCarousel
- `FlatList` horizontal + pagingEnabled, full-width backdrop
- Auto-rotation (8s interval, same as web)
- D-pad left/right changes slide
- Gradient overlay with title, year, rating, "View Details" button
- Dot indicators at bottom

### 4.3 TVMediaRow
- Horizontal `FlatList` of TVMediaCards
- Row header with title + "See All" button
- D-pad naturally traverses cards, auto-scrolls to focused item
- Card width: ~200dp (fits ~4.5 visible cards at 960dp)

### 4.4 TVMediaGrid
- `FlatList` with `numColumns={5}` (5 cards at ~180dp each)
- Status tab bar above (horizontal list of focusable tabs)
- Built-in virtualization via FlatList

### 4.5 Query / Queries
- Copy from `components/query/` (pure React, zero DOM dependencies)
- Same API: `loading`, `error`, `success` render callbacks
- Adapt loading/error states for TV (shimmer skeletons, large error cards with retry button)

### Verification
- Test screen showing TVHeroCarousel + TVMediaRow with mocked data
- Focus traversal: D-pad down from carousel → first card in row → right through cards
- Focus ring visible on every focusable element

---

## Phase 5 — Screen Implementation

All screens import query options from `options/queries/` (shared, zero duplication). Each screen is independently shippable.

### Priority order

| # | Screen | Queries Used (from shared) | Complexity |
|---|--------|---------------------------|------------|
| 1 | Home | `trendingMoviesQueryOptions`, `trendingShowsQueryOptions` | Medium |
| 2 | Movie Browse | `trendingMoviesQueryOptions`, `topRatedMoviesQueryOptions`, `nowPlayingMoviesQueryOptions`, `upcomingMoviesQueryOptions`, `hiddenGemMoviesQueryOptions`, `moviesByGenreQueryOptions`, `movieGenresQueryOptions` | High |
| 3 | Show Browse | Same pattern as movies | High |
| 4 | Movie Library | `movieItemsQueryOptions` + `filterByStatus`, `sortMovies` (shared utils) | Medium |
| 5 | Show Library | `showItemsQueryOptions` + show filter/sort utils | Medium |
| 6 | Movie Detail | `movieDetailQueryOptions`, `movieCreditsQueryOptions`, `movieImagesQueryOptions`, `movieVideosQueryOptions`, `movieRecommendationsQueryOptions`, `similarMoviesQueryOptions`, `movieContentRatingQueryOptions`, `movieReviewsQueryOptions`, `movieLibraryInfoQueryOptions` | High |
| 7 | Show Detail | Same pattern as movie detail + `showSeasonsQueryOptions` | High |
| 8 | Season Detail | `showSeasonQueryOptions` + tabs (Overview, Episodes, Files, History) | Medium |
| 9 | Episode Detail | Episode query options | Low |
| 10 | Discover | `filteredMoviesInfiniteQueryOptions`, `filteredShowsInfiniteQueryOptions`, `searchMoviesInfiniteQueryOptions`, `searchShowsInfiniteQueryOptions`, metadata queries | High |
| 11 | System Dashboard | Radarr/Sonarr system API queries | Medium |

### State management note
Web uses `nuqs` (URL state) for filters — this is web-only. TV replacement: lightweight React state in each screen (no URL sync needed on TV). The filter types from `api/dtos/` (MovieItemsRequest, DiscoverMovieFilters, etc.) define the state shape.

---

## Phase 6 — TV UX Polish

### Typography scale
| Element | Size | Weight |
|---------|------|--------|
| Hero title | 48sp | Bold |
| Section heading | 28sp | SemiBold |
| Card title | 20sp | Medium |
| Body | 18sp | Regular |
| Label/badge | 14sp | Medium |

### Focus system
- All focusable: 3dp accent border + scale(1.05) on focus
- `TVFocusRing` wrapper component for consistent behavior
- `TVFocusGuideView` at every region boundary (sidebar↔content, carousel↔rows, rows↔grid)

### Loading states
- Shimmer skeleton matching component aspect ratios
- Error cards with large retry button (`hasTVPreferredFocus={true}`)
- Empty states with action button ("Go to Discover")

---

## Phase 7 — Settings + Build

### Settings screen
- Edit API endpoints (same form as config screen)
- After save: `setClientConfig(newConfig)` + `queryClient.clear()` → fresh data

### Android TV build
```bash
cd tv
EXPO_TV=1 npx expo prebuild --clean
npx expo run:android --variant release
# or: eas build --platform android --profile tv-release
```

The `@react-native-tvos/config-tv` plugin automatically handles:
- `android.intent.category.LEANBACK_LAUNCHER` intent filter
- `android.hardware.touchscreen` not required
- Leanback feature declaration
- TV banner image

### Sideloading
```bash
adb install tv/android/app/build/outputs/apk/release/app-release.apk
```

---

## Risks + Mitigations

| Risk | Mitigation |
|------|------------|
| Metro dual `@/` alias conflict (shared code uses `@/` → repo root, TV code uses `@/` → `/tv`) | Custom `resolveRequest` in metro.config.js checks origin file path |
| `openapi-fetch` needs `URL`/`Request` globals | RN 0.76+ includes them natively; polyfill `react-native-url-polyfill` if needed |
| Expo SDK + react-native-tvos version compatibility | Use the `with-tv` template's pinned versions; verify with `npx expo install --check` |
| Android TV focus jumping unpredictably in grids | `TVFocusGuideView` at region boundaries + explicit `nextFocusLeft` on leftmost grid column → sidebar |
| `process.env` not available in Hermes (RN) | Config store is checked first; `process.env` fallback only runs on web where it works |

---

## Verification Plan

After each phase:
1. **Phase 0**: `bun check && bun dev` — web app works identically
2. **Phase 1**: `cd tv && npx expo start` — Metro resolves shared imports, no crashes
3. **Phase 2**: Config screen on Android TV emulator — enter URLs, test connections, save
4. **Phase 3**: Navigate sidebar with D-pad — all routes reachable
5. **Phase 4**: Test screen with real data — carousel + row render, focus traversal works
6. **Phase 5**: Each screen individually — data loads, D-pad navigation is logical
7. **Phase 6**: Visual polish pass — focus rings visible, text readable at 10ft, skeletons match layout
8. **Phase 7**: `adb install` APK on real Android TV device — full app functional
