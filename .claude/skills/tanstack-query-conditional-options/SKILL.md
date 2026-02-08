---
name: tanstack-query-conditional-options
description: "Fix TypeScript errors when conditionally selecting between two queryOptions() factories with different query key shapes in TanStack React Query. Use when: (1) useQuery() errors with 'No overload matches this call' when passed a union of two queryOptions results, (2) query keys have different tuple lengths (e.g., ['x', 'movie', number] vs ['x', 'episode', number, number, number]), (3) ternary selection between queryOptions factories fails type checking. Solution: split into separate components that each call useQuery with a single concrete queryOptions type."
---

# TanStack Query: Conditional queryOptions Union Type Error

## Problem
When you conditionally select between two `queryOptions()` factories that produce different
query key tuple shapes, TypeScript rejects the union type passed to `useQuery()`.

## Context / Trigger Conditions
- Error: `No overload matches this call` on `useQuery(options)` where `options` is a union
- Two `queryOptions()` factories return different `queryKey` tuple lengths
- You're using a ternary or conditional to pick which query options to use
- Example failing code:
  ```tsx
  const options = condition
    ? moviePlaybackQueryOptions({ tmdbId })        // key: ['playback', 'movie', number]
    : episodePlaybackQueryOptions({ tmdbId, s, e }) // key: ['playback', 'episode', number, number, number]
  const query = useQuery(options) // TS ERROR: No overload matches
  ```

## Solution
Split into separate components, each calling `useQuery` with a single concrete type:

```tsx
// Instead of one component with conditional queryOptions:
function MovieOverlay({ request, onClose }) {
  const query = useQuery(moviePlaybackQueryOptions({ ... }));
  return <OverlayShell data={query.data} ... />;
}

function EpisodeOverlay({ request, onClose }) {
  const query = useQuery(episodePlaybackQueryOptions({ ... }));
  return <OverlayShell data={query.data} ... />;
}

// Parent picks the right component:
function PlayerOverlay({ request, onClose }) {
  if (request.mediaType === 'movie') {
    return <MovieOverlay request={request} onClose={onClose} />;
  }
  return <EpisodeOverlay request={request} onClose={onClose} />;
}
```

Extract shared rendering into a shell component that receives the resolved data.

## Verification
Run `bun check` / `tsc --noEmit` — the `No overload matches this call` error should be gone.

## Notes
- This is a TypeScript limitation, not a React Query bug — TS can't narrow the union
- The same pattern applies to `useSuspenseQuery`, `useInfiniteQuery`, etc.
- Shared rendering logic goes in a "shell" component that takes resolved `data`/`isLoading`/`error`
- This pattern also applies when query key shapes differ in value types, not just length
