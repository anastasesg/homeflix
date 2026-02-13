# Homeflix

A media management dashboard built with Next.js, providing a unified interface for managing movies, shows, downloads, and more through Radarr, Sonarr, Prowlarr, and TMDB.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20.9.0
- [Bun](https://bun.sh/) (package manager & runtime)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd homeflix
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure environment variables**

   Copy the example and fill in your API details:

   ```bash
   cp .env.example .env.local
   ```

   Required variables:

   | Variable | Description |
   |---|---|
   | `NEXT_PUBLIC_RADARR_API_URL` | Radarr instance URL |
   | `NEXT_PUBLIC_RADARR_API_KEY` | Radarr API key |
   | `NEXT_PUBLIC_SONARR_API_URL` | Sonarr instance URL |
   | `NEXT_PUBLIC_SONARR_API_KEY` | Sonarr API key |
   | `NEXT_PUBLIC_PROWLARR_API_URL` | Prowlarr instance URL |
   | `NEXT_PUBLIC_PROWLARR_API_KEY` | Prowlarr API key |
   | `NEXT_PUBLIC_TMDB_API_URL` | TMDB API URL |
   | `NEXT_PUBLIC_TMDB_API_KEY` | TMDB API key (v3) |

4. **Start the development server**

   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start development server (Turbopack) |
| `bun build` | Production build |
| `bun check` | TypeScript type checking |
| `bun lint --fix` | Lint and auto-fix |
| `bun generate:api` | Regenerate OpenAPI types from specs |
| `bun reset` | Clean reinstall (removes node_modules, .next, lockfile) |

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, Turbopack)
- **Styling**: Tailwind CSS 4, shadcn/ui (Radix)
- **Data Fetching**: TanStack React Query, openapi-fetch
- **State**: URL state via nuqs, React Query cache
- **Forms**: React Hook Form + Zod
