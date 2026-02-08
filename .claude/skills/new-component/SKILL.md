---
name: new-component
description: Scaffold a new React component following project conventions — section separators, Props interface, named exports, proper placement in _components/ or components/
---

# New Component Scaffolding

Generate a new component that follows all homeflix conventions. The user provides the component name and location.

## Inputs

The user should specify:
1. **Component name** — PascalCase (e.g., `CastSection`, `MovieStats`)
2. **Location** — Either:
   - A route path for route-private components → placed in `_components/` under that route
   - `components/` for shared cross-route components
3. **Data-fetching?** — Whether this component owns a query (most do in this codebase)
4. **Multi-file?** — Whether it needs sub-components in separate files (folder with `index.tsx`) or is standalone (single `.tsx` file)

## Template: Single-file data-fetching component

This is the most common pattern. Generate this unless told otherwise:

```tsx
'use client';

// External imports
import { useQuery } from '@tanstack/react-query';

// API/options imports
// import { someQueryOptions } from '@/options/queries/...';

// Shared component imports
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Sub-Components
// ============================================================================

// (Add private sub-components here if needed)

// ============================================================================
// Loading
// ============================================================================

function {Name}Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

// ============================================================================
// Success
// ============================================================================

interface {Name}ContentProps {
  // TODO: Define data prop from query result
}

function {Name}Content({}: {Name}ContentProps) {
  return (
    <section>
      {/* TODO: Implement success state */}
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface {Name}Props {
  // TODO: Define props (typically tmdbId, radarrId, etc.)
}

function {Name}({}: {Name}Props) {
  // const query = useQuery(someQueryOptions(...));

  // return (
  //   <Query
  //     result={query}
  //     callbacks={{
  //       loading: {Name}Loading,
  //       error: () => null,
  //       success: (data) => <{Name}Content ... />,
  //     }}
  //   />
  // );

  return null; // TODO: Wire up query
}

export type { {Name}Props };
export { {Name} };
```

## Template: Single-file static component (no query)

For components that receive all data via props:

```tsx
'use client';

// External imports

// Shared component imports

// ============================================================================
// Main
// ============================================================================

interface {Name}Props {
  // TODO: Define props
}

function {Name}({}: {Name}Props) {
  return (
    <div>
      {/* TODO: Implement */}
    </div>
  );
}

export type { {Name}Props };
export { {Name} };
```

## Template: Multi-file component (folder)

When the component has 2+ private sub-components, create a folder:

```
{kebab-name}/
├── index.tsx           # Main export, wires query → states
├── {sub-component}.tsx # Private sub-component
└── {sub-component}.tsx # Private sub-component
```

The `index.tsx` follows the same section structure. Sub-component files are simpler — just the component and its exports.

## Naming Rules

- **Files**: kebab-case (`cast-section.tsx`, `movie-header/`)
- **Components**: PascalCase (`CastSection`, `MovieHeader`)
- **Props**: `{ComponentName}Props` interface above the component
- **Loading**: `{ComponentName}Loading` function
- **Success content**: `{ComponentName}Content` function
- **Error**: `{ComponentName}Error` function (optional, many sections return `() => null`)

## Placement Rules

| Scenario | Location |
|----------|----------|
| Used only by one route | `app/(protected)/{route}/_components/{name}.tsx` |
| Used by multiple routes | `components/{domain}/{name}.tsx` (e.g., `components/media/`) |
| UI primitive | `components/ui/` (shadcn — auto-generated) |
| Query wrapper | `components/query/` |

## Checklist

After generating the component:
- [ ] `'use client'` directive present (if using hooks, state, or event handlers)
- [ ] Section separators (`// ====...====`) between major sections
- [ ] `interface {Name}Props` defined above the component
- [ ] `function` declaration (not arrow function) for all components
- [ ] Named exports at bottom: `export type { Props }; export { Component };`
- [ ] No hardcoded colors — semantic tokens only
- [ ] Import order: external → `@/api` / `@/options` → `@/components` → local `./`
- [ ] No `export default`
