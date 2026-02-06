'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { Calendar, ChevronLeft, ChevronRight, Clock, Film, Star, Tv } from 'lucide-react';

import type { SeasonDetail, ShowBasic, ShowLibraryInfo } from '@/api/entities';
import { useSetBreadcrumb } from '@/context';
import { cn } from '@/lib/utils';
import { sonarrLookupQueryOptions, tmdbTVSeasonQueryOptions, tmdbTVShowQueryOptions } from '@/options/queries/tmdb';

import { Queries } from '@/components/query';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Utilities
// ============================================================================

function formatAirDate(dateStr?: string): string {
  if (!dateStr) return 'TBA';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function computeAverageRating(season: SeasonDetail): number {
  const ratedEpisodes = season.episodes.filter((e) => e.rating > 0 && e.voteCount > 0);
  if (ratedEpisodes.length === 0) return 0;
  return ratedEpisodes.reduce((sum, e) => sum + e.rating, 0) / ratedEpisodes.length;
}

function computeTotalRuntime(season: SeasonDetail): number {
  return season.episodes.reduce((sum, e) => sum + (e.runtime ?? 0), 0);
}

// ============================================================================
// Sub-components
// ============================================================================

interface SeasonNavProps {
  show: ShowBasic;
  seasonNumber: number;
  tmdbId: number;
}

function SeasonNav({ show, seasonNumber, tmdbId }: SeasonNavProps) {
  const currentIndex = show.seasons.findIndex((s) => s.seasonNumber === seasonNumber);
  const prevSeason = currentIndex > 0 ? show.seasons[currentIndex - 1] : undefined;
  const nextSeason = currentIndex < show.seasons.length - 1 ? show.seasons[currentIndex + 1] : undefined;

  return (
    <div className="absolute right-4 top-4 z-10 flex items-center gap-2 sm:right-6 sm:top-6">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 border-border/40 bg-background/30 backdrop-blur-sm hover:bg-background/50"
        disabled={!prevSeason}
        asChild={!!prevSeason}
      >
        {prevSeason ? (
          <Link href={`/media/shows/${tmdbId}/seasons/${prevSeason.seasonNumber}`}>
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">{prevSeason.name}</span>
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" />
          </span>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 border-border/40 bg-background/30 backdrop-blur-sm hover:bg-background/50"
        disabled={!nextSeason}
        asChild={!!nextSeason}
      >
        {nextSeason ? (
          <Link href={`/media/shows/${tmdbId}/seasons/${nextSeason.seasonNumber}`}>
            <span className="hidden sm:inline">{nextSeason.name}</span>
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span>
            <ChevronRight className="size-4" />
          </span>
        )}
      </Button>
    </div>
  );
}

// ============================================================================
// Error
// ============================================================================

function SeasonHeaderError() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-destructive/20 bg-destructive/5">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="w-40 shrink-0 sm:w-48">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl bg-destructive/10">
              <div className="flex h-full items-center justify-center">
                <Tv className="size-10 text-destructive/30" />
              </div>
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="text-lg font-semibold text-destructive">Failed to load season</h2>
            <p className="mt-2 text-sm text-muted-foreground">Could not retrieve season information.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Loading
// ============================================================================

function SeasonHeaderLoading() {
  return (
    <section className="relative flex min-h-[420px] overflow-hidden rounded-xl bg-accent/30 sm:min-h-[500px] lg:min-h-[560px]">
      <div className="relative mt-auto px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-24 lg:px-8 lg:pb-10 lg:pt-28">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="shrink-0 sm:w-44 md:w-52">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl">
              <Skeleton className="h-full w-full" />
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-3/4 sm:h-12" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-4 w-px" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-px" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface SeasonHeaderSuccessProps {
  show: ShowBasic;
  season: SeasonDetail;
  library: ShowLibraryInfo;
  seasonNumber: number;
  tmdbId: number;
}

function SeasonHeaderSuccess({ show, season, library, seasonNumber, tmdbId }: SeasonHeaderSuccessProps) {
  useSetBreadcrumb(`/media/shows/${tmdbId}`, show.name);
  useSetBreadcrumb(`/media/shows/${tmdbId}/seasons/${seasonNumber}`, season.name);

  const sonarrSeason = library.inLibrary ? library.seasons.find((s) => s.seasonNumber === seasonNumber) : undefined;
  const downloaded = sonarrSeason?.episodeFileCount ?? 0;
  const total = sonarrSeason?.episodeCount ?? season.episodes.length;
  const progressPercent = total > 0 ? (downloaded / total) * 100 : 0;

  const avgRating = computeAverageRating(season);
  const totalRuntime = computeTotalRuntime(season);

  return (
    <section className="relative flex min-h-[420px] overflow-hidden rounded-xl sm:min-h-[500px] lg:min-h-[560px]">
      {/* Backdrop Image */}
      {show.backdropUrl && (
        <Image
          src={show.backdropUrl}
          alt=""
          fill
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
        />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Season Navigation */}
      <SeasonNav show={show} seasonNumber={seasonNumber} tmdbId={tmdbId} />

      {/* Content -- pinned to bottom */}
      <div className="relative mt-auto px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-24 lg:px-8 lg:pb-10 lg:pt-28">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Poster */}
          <div className="shrink-0 sm:w-44 md:w-52">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-foreground/10">
              {season.posterUrl ? (
                <Image
                  src={season.posterUrl}
                  alt={season.name}
                  fill
                  className="h-full w-full object-cover"
                  sizes="(min-width: 768px) 208px, (min-width: 640px) 176px, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80 p-4 text-center text-sm text-muted-foreground">
                  {season.name}
                </div>
              )}
            </AspectRatio>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col justify-end">
            <p className="text-sm text-muted-foreground">{show.name}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{season.name}</h1>

            {/* Metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {avgRating > 0 && (
                <div className="flex items-center gap-1.5 rounded-lg bg-foreground/10 px-2.5 py-1.5 backdrop-blur-sm">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold tabular-nums">{avgRating.toFixed(1)}</span>
                </div>
              )}

              <Separator orientation="vertical" className="h-4 bg-foreground/20" />

              <span className="flex items-center gap-1 text-muted-foreground">
                <Film className="size-4" />
                {season.episodes.length} {season.episodes.length === 1 ? 'Episode' : 'Episodes'}
              </span>

              {season.airDate && (
                <>
                  <Separator orientation="vertical" className="h-4 bg-foreground/20" />
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="size-4" />
                    {formatAirDate(season.airDate)}
                  </span>
                </>
              )}

              {totalRuntime > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4 bg-foreground/20" />
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-4" />
                    {Math.round(totalRuntime / 60)}h {totalRuntime % 60}m
                  </span>
                </>
              )}
            </div>

            {/* Progress bar for library items */}
            {library.inLibrary && sonarrSeason && (
              <div className="mt-5">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">
                    {downloaded}/{total} episodes
                  </span>
                  <span
                    className={cn('text-xs', progressPercent === 100 ? 'text-emerald-400' : 'text-muted-foreground/60')}
                  >
                    {progressPercent === 100 ? 'Complete' : `${Math.round(progressPercent)}%`}
                  </span>
                </div>
                <Progress
                  value={progressPercent}
                  className={cn('mt-1.5 h-2 bg-muted/50', progressPercent === 100 && '[&>div]:bg-emerald-500')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface SeasonHeaderProps {
  tmdbId: number;
  seasonNumber: number;
}

function SeasonHeader({ tmdbId, seasonNumber }: SeasonHeaderProps) {
  const showQuery = useQuery(tmdbTVShowQueryOptions(tmdbId));
  const seasonQuery = useQuery(tmdbTVSeasonQueryOptions(tmdbId, seasonNumber));
  const libraryQuery = useQuery(sonarrLookupQueryOptions(tmdbId));

  return (
    <Queries
      results={[showQuery, seasonQuery, libraryQuery] as const}
      callbacks={{
        loading: SeasonHeaderLoading,
        error: () => <SeasonHeaderError />,
        success: ([show, season, library]) => (
          <SeasonHeaderSuccess
            show={show}
            season={season}
            library={library}
            seasonNumber={seasonNumber}
            tmdbId={tmdbId}
          />
        ),
      }}
    />
  );
}

export type { SeasonHeaderProps };
export { SeasonHeader };
