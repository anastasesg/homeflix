---
name: code-style
description: Use when writing or editing any code in this project. Ensures ESLint and Prettier compliance so output needs no auto-fixing.
---

# Code Style

Write all code compliant with the project's ESLint + Prettier config. Never produce code that would require `bun lint --fix`.

## Prettier

- Semicolons: **always**
- Quotes: **single** (`'`)
- Indentation: **2 spaces** (no tabs)
- Trailing commas: **es5** (on last item in multiline objects, arrays, params)
- Print width: **120 characters**

## Import Ordering

Imports are sorted by `eslint-plugin-simple-import-sort` into **7 groups separated by blank lines**, in this exact order:

```tsx
// 1. React
import { useState } from 'react';

// 2. Next.js
import Image from 'next/image';
import { notFound } from 'next/navigation';

// 3. External packages
import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';

// 4. Internal aliases (@/ but NOT @/components)
import { type MovieCredits } from '@/api/entities';
import { cn } from '@/lib/utils';
import { tmdbCreditsQueryOptions } from '@/options/queries/tmdb';

// 5. @/components
import { Query } from '@/components/query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// 6. Parent imports
import { SharedThing } from '../shared';

// 7. Sibling imports
import { SectionHeader } from './section-header';
```

Rules:
- Each group separated by exactly **one blank line**
- Within each group, alphabetical order
- No duplicate imports (`import/no-duplicates`)
- Imports must come before all other code (`import/first`)
- One blank line after the last import (`import/newline-after-import`)
- `'use client'` or `'use server'` directives go **above** all imports

## Exports

- **Named exports only** for components: `export { Component };`
- Separate type exports: `export type { ComponentProps };`
- `export default` only on Next.js `page.tsx` / `layout.tsx` files
- **Never re-export for convenience** — only `export * from './file'` or `export type * from './file'`

## Unused Code

- No unused imports (auto-removed by `unused-imports/no-unused-imports`)
- Unused variables prefixed with `_` to suppress warnings: `_unusedVar`
- Unused function args after the last used one prefixed with `_`: `(used, _unused)`

## Component Patterns

- Define components with `function` declarations (not arrow functions)
- Use `interface` for props (not `type` alias)
- Arrow functions for callbacks: `(item) => item.value`
