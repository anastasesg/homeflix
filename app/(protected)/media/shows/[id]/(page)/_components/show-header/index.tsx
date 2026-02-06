'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Clock, Play, Star, Tv } from 'lucide-react';

import { type ShowBasic, type ShowContentRating, type ShowVideos } from '@/api/entities';
import { useSetBreadcrumb } from '@/context';
import {
  tmdbTVContentRatingsQueryOptions,
  tmdbTVShowQueryOptions,
  tmdbTVVideosQueryOptions,
} from '@/options/queries/tmdb';

import { Queries } from '@/components/query';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import { LibraryStatusBadge } from './library-status-badge';

// ============================================================================
// Utilities
// ============================================================================

function formatShowYear(year: number, endYear?: number): string {
  if (endYear) return `${year}\u2013${endYear}`;
  return `${year}\u2013`;
}

function getShowStatusBadge(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === 'returning series' || normalized === 'in production') {
    return { label: 'Continuing', className: 'bg-emerald-500/20 text-emerald-400' };
  }
  if (normalized === 'ended' || normalized === 'canceled') {
    return { label: 'Ended', className: 'bg-muted text-muted-foreground' };
  }
  if (normalized === 'planned' || normalized === 'pilot') {
    return { label: 'Upcoming', className: 'bg-amber-500/20 text-amber-400' };
  }
  return { label: status, className: 'bg-muted text-muted-foreground' };
}

// ============================================================================
// Error
// ============================================================================

interface ShowHeaderErrorProps {
  error: unknown;
}

function ShowHeaderError({ error }: ShowHeaderErrorProps) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';

  return (
    <section className="relative overflow-hidden rounded-xl border border-destructive/20 bg-destructive/5">
      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Poster placeholder */}
          <div className="shrink-0 sm:w-44 md:w-52">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl bg-destructive/10">
              <div className="flex h-full items-center justify-center">
                <Tv className="size-10 text-destructive/30" />
              </div>
            </AspectRatio>
          </div>

          {/* Error info */}
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="text-lg font-semibold text-destructive">Failed to load show</h2>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Loading
// ============================================================================

function ShowHeaderLoading() {
  return (
    <section className="relative flex overflow-hidden rounded-xl bg-accent/30 min-h-[420px] sm:min-h-[500px] lg:min-h-[560px]">
      <div className="relative mt-auto px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-24 lg:px-8 lg:pb-10 lg:pt-28">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Poster skeleton */}
          <div className="shrink-0 sm:w-44 md:w-52">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl">
              <Skeleton className="h-full w-full" />
            </AspectRatio>
          </div>

          {/* Info skeleton */}
          <div className="flex flex-1 flex-col justify-end gap-2">
            <Skeleton className="h-10 w-3/4 sm:h-12" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="mt-1 h-4 w-48" />

            {/* Metadata row */}
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-4 w-px" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-px" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-36 rounded-md" />
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

interface ShowHeaderSuccessProps {
  show: ShowBasic;
  videos: ShowVideos;
  contentRatings: ShowContentRating[];
  tmdbId: number;
}

function ShowHeaderSuccess({ show, videos, contentRatings, tmdbId }: ShowHeaderSuccessProps) {
  useSetBreadcrumb(`/media/shows/${tmdbId}`, show?.name);

  const trailerUrl = videos.trailerUrl;
  const statusBadge = getShowStatusBadge(show.status);
  const networkName = show.networks[0]?.name;
  const usRating = contentRatings.find((r) => r.country === 'US')?.rating;

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

      {/* Content -- pinned to bottom */}
      <div className="relative mt-auto px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-24 lg:px-8 lg:pb-10 lg:pt-28">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Poster */}
          <div className="shrink-0 sm:w-44 md:w-52">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-foreground/10">
              {show.posterUrl ? (
                <Image
                  src={show.posterUrl}
                  alt={show.name}
                  fill
                  className="h-full w-full object-cover"
                  sizes="(min-width: 768px) 208px, (min-width: 640px) 176px, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80 p-4 text-center text-sm text-muted-foreground">
                  {show.name}
                </div>
              )}
            </AspectRatio>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col justify-end">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{show.name}</h1>
            {show.originalName !== show.name && <p className="text-sm text-muted-foreground/70">{show.originalName}</p>}

            <div className="mt-1 flex items-center gap-2">
              <p className="text-lg text-muted-foreground">{formatShowYear(show.year, show.endYear)}</p>
              <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
              {show.type && <Badge className="bg-muted text-muted-foreground text-xs">{show.type}</Badge>}
            </div>

            {show.tagline && (
              <p className="mt-2 text-sm italic text-muted-foreground/80">&ldquo;{show.tagline}&rdquo;</p>
            )}

            {/* Metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {usRating && (
                <Badge className="border border-foreground/20 bg-foreground/10 px-2 py-0.5 text-xs font-semibold">
                  {usRating}
                </Badge>
              )}

              {show.rating > 0 && (
                <div className="flex items-center gap-1.5 rounded-lg bg-foreground/10 px-2.5 py-1.5 backdrop-blur-sm">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold tabular-nums">{show.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground/80">({show.voteCount.toLocaleString()})</span>
                </div>
              )}

              <Separator orientation="vertical" className="h-4 bg-foreground/20" />

              <span className="text-muted-foreground">
                {show.numberOfSeasons} {show.numberOfSeasons === 1 ? 'Season' : 'Seasons'}
              </span>

              {show.runtime && show.runtime > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4 bg-foreground/20" />
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-4" />~{show.runtime}m
                  </span>
                </>
              )}

              <Separator orientation="vertical" className="h-4 bg-foreground/20" />

              <span className="text-muted-foreground">{show.genres.slice(0, 3).join(' / ')}</span>

              {networkName && (
                <>
                  <Separator orientation="vertical" className="h-4 bg-foreground/20" />
                  <span className="text-muted-foreground">{networkName}</span>
                </>
              )}
            </div>

            {/* Library Status + Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <LibraryStatusBadge tmdbId={tmdbId} />

              {trailerUrl && (
                <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90" asChild>
                  <a href={trailerUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="size-4 fill-current" />
                    Watch Trailer
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface ShowHeaderProps {
  tmdbId: number;
}

function ShowHeader({ tmdbId }: ShowHeaderProps) {
  const showQuery = useQuery(tmdbTVShowQueryOptions(tmdbId));
  const videosQuery = useQuery(tmdbTVVideosQueryOptions(tmdbId));
  const contentRatingsQuery = useQuery(tmdbTVContentRatingsQueryOptions(tmdbId));

  return (
    <Queries
      results={[showQuery, videosQuery, contentRatingsQuery] as const}
      callbacks={{
        loading: ShowHeaderLoading,
        error: (error) => <ShowHeaderError error={error} />,
        success: ([show, videos, contentRatings]) => (
          <ShowHeaderSuccess show={show} videos={videos} contentRatings={contentRatings} tmdbId={tmdbId} />
        ),
      }}
    />
  );
}

export type { ShowHeaderProps };
export { ShowHeader };
