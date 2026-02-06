'use client';

import { useQuery } from '@tanstack/react-query';

import { sonarrLookupQueryOptions } from '@/options/queries/tmdb';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { EpisodesTab } from './episodes-tab';
import { FilesTab } from './files-tab';
import { HistoryTab } from './history-tab';
import { ManageTab } from './manage-tab';
import { OverviewTab } from './overview-tab';

// ============================================================================
// Loading
// ============================================================================

function SeasonTabsLoading() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="grid w-full grid-cols-5 gap-1 rounded-lg bg-muted/20 p-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center rounded-md px-3 py-1.5">
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-border/40 p-3">
            <Skeleton className="aspect-video w-32 shrink-0 rounded-lg sm:w-40" />
            <div className="flex flex-1 flex-col justify-center gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Success
// ============================================================================

interface SeasonTabsContentProps {
  tmdbId: number;
  seasonNumber: number;
  inLibrary: boolean;
  sonarrId?: number;
}

function SeasonTabsContent({ tmdbId, seasonNumber, inLibrary, sonarrId }: SeasonTabsContentProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className={`mb-6 grid w-full ${inLibrary && sonarrId ? 'grid-cols-5' : 'grid-cols-2'} bg-muted/20`}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="episodes">Episodes</TabsTrigger>
        {inLibrary && sonarrId && (
          <>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="overview" className="mt-0">
        <OverviewTab tmdbId={tmdbId} seasonNumber={seasonNumber} />
      </TabsContent>

      <TabsContent value="episodes" className="mt-0">
        <EpisodesTab tmdbId={tmdbId} seasonNumber={seasonNumber} />
      </TabsContent>

      {inLibrary && sonarrId && (
        <>
          <TabsContent value="files" className="mt-0">
            <FilesTab tmdbId={tmdbId} seasonNumber={seasonNumber} sonarrId={sonarrId} />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryTab tmdbId={tmdbId} seasonNumber={seasonNumber} sonarrId={sonarrId} />
          </TabsContent>

          <TabsContent value="manage" className="mt-0">
            <ManageTab tmdbId={tmdbId} seasonNumber={seasonNumber} sonarrId={sonarrId} />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}

// ============================================================================
// Main
// ============================================================================

interface SeasonTabsProps {
  tmdbId: number;
  seasonNumber: number;
}

function SeasonTabs({ tmdbId, seasonNumber }: SeasonTabsProps) {
  const libraryQuery = useQuery(sonarrLookupQueryOptions(tmdbId));

  return (
    <Query
      result={libraryQuery}
      callbacks={{
        loading: SeasonTabsLoading,
        error: () => (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 bg-muted/20">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-0">
              <OverviewTab tmdbId={tmdbId} seasonNumber={seasonNumber} />
            </TabsContent>
            <TabsContent value="episodes" className="mt-0">
              <EpisodesTab tmdbId={tmdbId} seasonNumber={seasonNumber} />
            </TabsContent>
          </Tabs>
        ),
        success: (data) => (
          <SeasonTabsContent
            tmdbId={tmdbId}
            seasonNumber={seasonNumber}
            inLibrary={data.inLibrary}
            sonarrId={data.sonarrId}
          />
        ),
      }}
    />
  );
}

export type { SeasonTabsProps };
export { SeasonTabs };
