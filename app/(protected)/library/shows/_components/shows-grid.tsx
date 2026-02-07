'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Tv2 } from 'lucide-react';

import { ShowItemsResponse } from '@/api/functions';
import { type ShowTabValueType, useShowFilters } from '@/hooks/filters';
import { showItemsQueryOptions } from '@/options/queries/shows/library';

import { MediaCard, MediaGrid, MediaItem } from '@/components/media';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ShowsGridFailedProps = {
  error: Error;
  refetch: () => void;
};

type ShowsGridSuccessProps = ShowItemsResponse & {
  isRefetching?: boolean;
};

function ShowsGridFailed({ error, refetch }: ShowsGridFailedProps) {
  return (
    <div className="mt-4">
      {/* Skeleton tabs */}
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
        {['All', 'Continuing', 'Complete', 'Missing'].map((label, i) => (
          <div key={label} className={`rounded-md px-3 py-1.5 text-sm ${i === 0 ? 'bg-background/50' : ''}`}>
            <span className="text-muted-foreground/50">{label}</span>
          </div>
        ))}
      </div>

      {/* Error state */}
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-destructive/20">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-background to-background" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="size-8 text-destructive" />
          </div>

          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">Unable to load shows</h2>
            <p className="text-sm text-muted-foreground">
              {error.message || 'Something went wrong while fetching your show library.'}
            </p>
          </div>

          <button
            onClick={refetch}
            className="mt-2 inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
          >
            <Tv2 className="size-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

function ShowsGridLoading() {
  return (
    <div className="mt-4">
      {/* Skeleton tabs */}
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
        {[
          { label: 'All', width: 'w-3' },
          { label: 'Continuing', width: 'w-3' },
          { label: 'Complete', width: 'w-3' },
          { label: 'Missing', width: 'w-3' },
        ].map(({ label, width }, i) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 ${i === 0 ? 'bg-background/50' : ''}`}
          >
            <span className="text-sm text-muted-foreground/70">{label}</span>
            (<Skeleton className={`h-4 ${width}`} />)
          </div>
        ))}
      </div>

      {/* Skeleton grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="group relative overflow-hidden rounded-xl">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="absolute right-2 top-2 h-5 w-16 rounded-full" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <Skeleton className="h-4 w-3/4" />
              <div className="mt-1.5 flex gap-2">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowsGridSuccess({ shows, stats, isRefetching }: ShowsGridSuccessProps) {
  const { filters, setTab } = useShowFilters();

  return (
    <Tabs value={filters.tab} onValueChange={(v) => setTab(v as ShowTabValueType)} className="mt-4">
      <TabsList className="bg-muted/50 max-w-full overflow-y-hidden overflow-x-scroll">
        <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
        <TabsTrigger value="continuing">Continuing ({stats.continuing})</TabsTrigger>
        <TabsTrigger value="complete">Complete ({stats.complete})</TabsTrigger>
        <TabsTrigger value="missing">Missing ({stats.missing})</TabsTrigger>
      </TabsList>

      <TabsContent value={filters.tab} className="mt-6">
        <div className="relative">
          {isRefetching && (
            <div className="absolute right-0 top-0 z-10">
              <div className="size-2 animate-pulse rounded-full bg-primary" />
            </div>
          )}
          <MediaGrid
            items={shows}
            viewMode={filters.view}
            emptyIcon={Tv2}
            emptyTitle="No shows found"
            emptyDescription="Try adjusting your search or filters"
            renderCard={(show, index) => <MediaCard type="show" data={show} index={index} />}
            renderListItem={(show) => <MediaItem type="show" data={show} />}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function ShowsGrid() {
  const { filters } = useShowFilters();

  const showsQuery = useQuery(
    showItemsQueryOptions({
      tab: filters.tab,
      search: filters.q,
      genres: filters.genres,
      networks: filters.networks,
      yearMin: filters.yearMin,
      yearMax: filters.yearMax,
      ratingMin: filters.ratingMin,
      sortField: filters.sort,
      sortDirection: filters.dir,
    })
  );

  return (
    <Query
      result={showsQuery}
      callbacks={{
        loading: () => <ShowsGridLoading />,
        error: (error) => <ShowsGridFailed error={error} refetch={showsQuery.refetch} />,
        success: (data, { isRefetching }) => (
          <ShowsGridSuccess stats={data.stats} shows={data.shows} isRefetching={isRefetching} />
        ),
      }}
    />
  );
}

export { ShowsGrid };
