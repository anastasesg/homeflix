# CLAUDE.md

Project-specific instructions for Claude Code.

## General Rules

- Always read files before attempting edits. Never assume file contents from prior context — files may have been modified externally or by other agents.
- When the user asks for a specific change, implement exactly that scope. Do not expand into adjacent concerns (API layer, pattern changes, etc.) unless explicitly asked. If you think broader changes are needed, mention them briefly but wait for approval.
- Never overwrite or delete files the user is actively working on without asking first. If a file needs to be replaced, confirm with the user before proceeding.
- When dispatching subagents, prefer `Write` tool over `Bash` for file creation — subagents may have restricted Bash permissions.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
  - This project uses Next.js with typed routes. Dynamic URLs passed to `<Link href>` require casting with `as Route`. Always apply this pattern proactively rather than waiting for type errors.
- **Styling**: Tailwind CSS 4, shadcn/ui (Radix), `cn()` from `lib/utils`
- **Data Fetching**: TanStack React Query, `openapi-fetch` (typed API clients)
- **State**: URL state via `nuqs`, React Query cache
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Code Style Rules

### Exports
- **Never reexport for convenience** - No convenience re-exports
- Only use `export * from './file'` or `export type * from './file'` patterns
- Named exports only (no `export default` for components)
- Separate type exports: `export type { Props }; export { Component };`

### Imports
- Order: `'use client'` → external libs → `@/api` / `@/options` → `@/components` → local `./`
- Always use `@/` path alias

### Data Fetching
- **Modular queries** - Each component manages its own query, no god queries that fill the entire page
- Always use `components/query` components (`Query`/`Queries`) to render queries
- Query options live in `options/queries/` as factory functions returning `queryOptions()`
- API functions live in `api/functions/`, entity types in `api/entities/`
- Mappers live in `api/mappers/`, utilities (filters/sorters) in `api/utils/`

### Components
- Route-private components go in `_components/` under the route
- Single-file for standalone components, folder with `index.tsx` for multi-file
- File sections separated by `// ====...====` comments: Utilities → Sub-components → Loading → Error → Success → Main
- Props: always define `interface {Name}Props` above the component
- Use slot-based composition (`children`, named slots) over prop explosion

### Styling
- **Never hardcode colors** — always use semantic theme tokens (`border`, `muted`, `foreground`, `accent`, etc.) so both light and dark themes work correctly.
  - e.g. `border-white/10` → `border-border/40`, `bg-white/5` → `bg-muted/20`, `text-gray-400` → `text-muted-foreground`
  - Use `foreground/[opacity]` only when you need the text color at reduced opacity.

### Utilities
- Before defining any utility function, always check the `utilities/` directory first to see if it already exists

## Refactoring

- When refactoring components, always remove the old/base components after migration is complete. Do not keep deprecated components alongside new ones unless explicitly asked.
- When consolidating or restructuring imports across many files, do a final grep/search pass for any stale imports referencing old paths. Subagent-driven bulk rewrites frequently miss edge cases.

## Directory Structure

- `app/(protected)/` — All authenticated routes (library, browse, discover, media, activity, system)
- `api/clients/` — `openapi-fetch` clients (radarr, sonarr, tmdb, prowlarr)
- `api/entities/` — Domain types
- `api/functions/` — Fetch + mapping functions
- `api/mappers/` — Entity mappers (genres, movies, shows)
- `api/types/` — Shared API types (media status, sort types)
- `api/openapi/` — OpenAPI JSON specs (generated, do not edit)
- `components/media/` — Shared media components (grid, cards, browse, details, sections)
- `components/query/` — `Query`/`Queries` wrapper components
- `components/ui/` — shadcn/ui primitives (auto-generated, ESLint-ignored)
- `context/` — React contexts (breadcrumbs)
- `hooks/filters/` — URL filter hooks (nuqs)
- `options/queries/` — Query option factories
- `utilities/` — Formatters (currency, duration)
- `.claude/skills/` — Claude Code skills (auto-discovered)
- `.claude/commands/` — Slash commands (thin wrappers delegating to skills)
- `.claude/agents/` — Subagent definitions (task-implementer, task-reviewer)
- `.working/` — Workflow workspaces (gitignored, created by `/work` command)

## Environment

Requires `.env.local` with API URLs and keys for four services:
- `NEXT_PUBLIC_RADARR_API_URL` / `NEXT_PUBLIC_RADARR_API_KEY` — Movie management
- `NEXT_PUBLIC_SONARR_API_URL` / `NEXT_PUBLIC_SONARR_API_KEY` — Show management
- `NEXT_PUBLIC_PROWLARR_API_URL` / `NEXT_PUBLIC_PROWLARR_API_KEY` — Indexer management
- `NEXT_PUBLIC_TMDB_API_URL` / `NEXT_PUBLIC_TMDB_API_KEY` — Metadata & images

## Quality Checks

- This is a TypeScript-first codebase. After any multi-file refactor, always run type checking (`bun check`) and lint (`bun lint --fix`) before considering work complete. Fix all errors before committing.

## Workflow System

When a task is too complex for simple chat (multi-file features, architectural changes, anything needing design decisions), suggest using the workflow system: **"This looks like it could benefit from the workflow system — want me to start with `/workflow:work`?"**

- **Commands**: `/workflow:work`, `/workflow:design`, `/workflow:plan`, `/workflow:implement`, `/workflow:review`, `/workflow:complete`
- **Flow**: discussion → design → plan → implementation → review → commit
- **Workspaces**: `.working/{type}/{slug}/` (gitignored) — type is feat/bug/refactor/docs/chore
- **Agents**: `task-implementer` (sonnet, implements single tasks), `task-reviewer` (sonnet, reviews tasks)
- Skills, agents, and commands live in `.claude/` (gitignored, local-only)

## Commands

- `bun dev` - Start development server
- `bun build` - Production build
- `bun check` - Check TypeScript issues
- `bun lint --fix` - Check and auto-fix ESLint issues
- `bun generate:api` - Regenerate OpenAPI types from specs in `api/openapi/`
- `bun reset` - Clean reinstall (removes node_modules, .next, bun.lock)
