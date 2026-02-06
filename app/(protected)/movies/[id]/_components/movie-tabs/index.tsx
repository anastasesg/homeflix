'use client';

import { useQuery } from '@tanstack/react-query';

import { radarrLookupQueryOptions } from '@/options/queries/tmdb';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FilesTab } from './files-tab';
import { HistoryTab } from './history-tab';
import { ManageTab } from './manage-tab';
import { OverviewTab } from './overview-tab';

// ============================================================================
// Loading
// ============================================================================

function MovieTabsLoading() {
  return (
    <div className="flex flex-col space-y-8">
      {/* Tab bar skeleton */}
      <div className="grid w-full grid-cols-4 gap-1 rounded-lg bg-muted/20 p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center rounded-md px-3 py-1.5">
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Overview paragraph skeleton */}
      <section className="relative">
        <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-transparent" />
        <div className="flex flex-col gap-2 pl-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </section>

      {/* Section header + card grid skeleton */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Error
// ============================================================================

interface MovieTabsErrorProps {
  error: unknown;
}

function MovieTabsError({ error }: MovieTabsErrorProps) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';

  return (
    <div className="flex flex-col space-y-8">
      {/* Tab bar placeholder */}
      <div className="grid w-full grid-cols-4 gap-1 rounded-lg border border-destructive/20 bg-destructive/5 p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center rounded-md px-3 py-1.5">
            <Skeleton className="h-4 w-16 bg-destructive/10" />
          </div>
        ))}
      </div>

      {/* Error content area */}
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <h2 className="text-lg font-semibold text-destructive">Failed to load content</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// ============================================================================
// Success
// ============================================================================

interface MovieTabsContentProps {
  tmdbId: number;
  inLibrary: boolean;
}

function MovieTabsContent({ tmdbId, inLibrary }: MovieTabsContentProps) {
  return (
    <div className="flex flex-col space-y-8">
      {inLibrary ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4 bg-muted/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <OverviewTab tmdbId={tmdbId} />
          </TabsContent>

          <TabsContent value="files" className="mt-0">
            <FilesTab tmdbId={tmdbId} />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryTab tmdbId={tmdbId} />
          </TabsContent>

          <TabsContent value="manage" className="mt-0">
            <ManageTab tmdbId={tmdbId} />
          </TabsContent>
        </Tabs>
      ) : (
        <OverviewTab tmdbId={tmdbId} />
      )}
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface MovieTabsProps {
  tmdbId: number;
}

function MovieTabs({ tmdbId }: MovieTabsProps) {
  const libraryQuery = useQuery(radarrLookupQueryOptions(tmdbId));

  return (
    <Query
      result={libraryQuery}
      callbacks={{
        loading: MovieTabsLoading,
        error: (error) => <MovieTabsError error={error} />,
        success: (data) => <MovieTabsContent tmdbId={tmdbId} inLibrary={data.inLibrary} />,
      }}
    />
  );
}

export type { MovieTabsProps };
export { MovieTabs };
