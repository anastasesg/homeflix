'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Film } from 'lucide-react';

import { MovieItemsResponse } from '@/api/functions';
import { useMovieFilters } from '@/hooks/filters';
import { movieItemsQueryOptions } from '@/options/queries/movies/library';

import { MediaCard, MediaGrid, MediaItem } from '@/components/media';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type MoviesGridFailedProps = {
  error: Error;
  refetch: () => void;
};

type MoviesGridSuccessProps = MovieItemsResponse & {
  isRefetching?: boolean;
};

function MoviesGridFailed({ error, refetch }: MoviesGridFailedProps) {
  return (
    <div className="mt-4">
      {/* Skeleton tabs */}
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
        {['All', 'Downloaded', 'Downloading', 'Wanted', 'Missing'].map((label, i) => (
          <div key={label} className={`rounded-md px-3 py-1.5 text-sm ${i === 0 ? 'bg-background/50' : ''}`}>
            <span className="text-muted-foreground/50">{label}</span>
          </div>
        ))}
      </div>

      {/* Error state */}
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-destructive/20">
        {/* Moody gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-background to-background" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="size-8 text-destructive" />
          </div>

          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">Unable to load movies</h2>
            <p className="text-sm text-muted-foreground">
              {error.message || 'Something went wrong while fetching your movie library.'}
            </p>
          </div>

          <button
            onClick={refetch}
            className="mt-2 inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
          >
            <Film className="size-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

function MoviesGridLoading() {
  return (
    <div className="mt-4">
      {/* Skeleton tabs */}
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
        {[
          { label: 'All', width: 'w-3' },
          { label: 'Downloaded', width: 'w-3' },
          { label: 'Downloading', width: 'w-3' },
          { label: 'Wanted', width: 'w-3' },
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
            {/* Poster skeleton */}
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />

            {/* Status badge skeleton */}
            <Skeleton className="absolute right-2 top-2 h-5 w-16 rounded-full" />

            {/* Bottom gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Title & meta skeleton */}
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

function MoviesGridSuccess({ movies, stats, isRefetching }: MoviesGridSuccessProps) {
  const { filters, setTab } = useMovieFilters();

  return (
    <Tabs value={filters.tab} onValueChange={(v) => setTab(v)} className="mt-4">
      <TabsList className="bg-muted/50 max-w-full overflow-y-hidden overflow-x-scroll">
        <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
        <TabsTrigger value="downloaded">Downloaded ({stats.downloaded})</TabsTrigger>
        <TabsTrigger value="downloading">Downloading ({stats.downloading})</TabsTrigger>
        <TabsTrigger value="wanted">Wanted ({stats.wanted})</TabsTrigger>
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
            items={movies}
            viewMode={filters.view}
            emptyIcon={Film}
            emptyTitle="No movies found"
            emptyDescription="Try adjusting your search or filters"
            renderCard={(movie, index) => <MediaCard type="movie" data={movie} index={index} />}
            renderListItem={(movie) => <MediaItem type="movie" data={movie} />}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

type MoviesGridProps = object;

function MoviesGrid({}: MoviesGridProps) {
  const { filters } = useMovieFilters();
  const moviesQuery = useQuery(movieItemsQueryOptions({ status: filters.tab }));

  return (
    <Query
      result={moviesQuery}
      callbacks={{
        loading: () => <MoviesGridLoading />,
        error: (error) => <MoviesGridFailed error={error} refetch={moviesQuery.refetch} />,
        success: (data, { isRefetching }) => (
          <MoviesGridSuccess stats={data.stats} movies={data.movies} isRefetching={isRefetching} />
        ),
      }}
    />
  );
}

export type { MoviesGridProps };
export { MoviesGrid };
