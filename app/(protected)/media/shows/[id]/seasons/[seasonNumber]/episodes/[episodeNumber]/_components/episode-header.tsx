'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { Calendar, ChevronLeft, ChevronRight, Clock, Layers, Star, Tv } from 'lucide-react';

import type { EpisodeBasic, SeasonDetail, ShowBasic } from '@/api/entities';
import { useSetBreadcrumb } from '@/context';
import {
  showDetailQueryOptions,
  showEpisodeQueryOptions,
  showSeasonQueryOptions,
} from '@/options/queries/shows/detail';

import { Queries } from '@/components/query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

function formatEpisodeCode(seasonNumber: number, episodeNumber: number): string {
  return `S${String(seasonNumber).padStart(2, '0')}E${String(episodeNumber).padStart(2, '0')}`;
}

function isUpcoming(airDate?: string): boolean {
  if (!airDate) return true;
  return new Date(airDate) > new Date();
}

function formatVoteCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

// ============================================================================
// Error
// ============================================================================

function EpisodeHeaderError() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-destructive/20 bg-destructive/5">
      <div className="flex min-h-[240px] items-center justify-center p-6">
        <div className="text-center">
          <Tv className="mx-auto size-10 text-destructive/30" />
          <h2 className="mt-4 text-lg font-semibold text-destructive">Failed to load episode</h2>
          <p className="mt-2 text-sm text-muted-foreground">Could not retrieve episode information.</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Loading
// ============================================================================

function EpisodeHeaderLoading() {
  return (
    <section className="relative flex h-[calc(100svh-4.5rem)] overflow-hidden rounded-xl bg-accent/30 md:h-[calc(100svh-5rem)]">
      <div className="relative mt-auto px-4 pb-4 pt-16 sm:px-6 sm:pb-6 sm:pt-20 lg:px-8 lg:pb-8 lg:pt-24">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="mt-2 h-8 w-2/3" />
        <div className="mt-3 flex items-center gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface EpisodeHeaderSuccessProps {
  episode: EpisodeBasic;
  show: ShowBasic;
  season: SeasonDetail;
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeHeaderSuccess({
  episode,
  show,
  season,
  tmdbId,
  seasonNumber,
  episodeNumber,
}: EpisodeHeaderSuccessProps) {
  useSetBreadcrumb(`/media/shows/${tmdbId}`, show.name);
  useSetBreadcrumb(`/media/shows/${tmdbId}/seasons/${seasonNumber}`, `Season ${seasonNumber}`);
  useSetBreadcrumb(
    `/media/shows/${tmdbId}/seasons/${seasonNumber}/episodes/${episodeNumber}`,
    `E${episodeNumber} \u2014 ${episode.name}`
  );

  const episodeCode = formatEpisodeCode(seasonNumber, episodeNumber);
  const upcoming = isUpcoming(episode.airDate);
  const totalEpisodes = season.episodes.length;
  const isFirst = episodeNumber <= 1;
  const isLast = episodeNumber >= totalEpisodes;
  const prevEpisode = season.episodes.find((e) => e.episodeNumber === episodeNumber - 1);
  const nextEpisode = season.episodes.find((e) => e.episodeNumber === episodeNumber + 1);
  return (
    <section className="relative flex h-[calc(100svh-4.5rem)] overflow-hidden rounded-xl md:h-[calc(100svh-5rem)]">
      {/* Still Image / Placeholder */}
      {episode.stillUrl ? (
        <Image src={episode.stillUrl} alt={episode.name} fill className="object-cover" sizes="100vw" priority />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/60">
          <Tv className="size-16 text-muted-foreground/20" />
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav arrows */}
      <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-2 sm:px-4">
        {!isFirst && prevEpisode ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full bg-background/60 backdrop-blur-sm hover:bg-muted/60"
            asChild
          >
            <Link href={`/media/shows/${tmdbId}/seasons/${seasonNumber}/episodes/${prevEpisode.episodeNumber}`}>
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {!isLast && nextEpisode ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full bg-background/60 backdrop-blur-sm hover:bg-muted/60"
            asChild
          >
            <Link href={`/media/shows/${tmdbId}/seasons/${seasonNumber}/episodes/${nextEpisode.episodeNumber}`}>
              <ChevronRight className="size-5" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>

      {/* Content — pinned to bottom */}
      <div className="relative mt-auto px-4 pb-4 pt-16 sm:px-6 sm:pb-6 sm:pt-20 lg:px-8 lg:pb-8 lg:pt-24">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500/20 font-mono text-xs text-amber-400">{episodeCode}</Badge>
          {upcoming && <Badge className="bg-amber-500/20 text-amber-400">Upcoming</Badge>}
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{episode.name}</h1>

        {/* Metadata row */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {episode.rating > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-foreground/10 px-2.5 py-1.5 backdrop-blur-sm">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold tabular-nums">{episode.rating.toFixed(1)}</span>
              {episode.voteCount > 0 && (
                <span className="text-xs text-muted-foreground/70">({formatVoteCount(episode.voteCount)})</span>
              )}
            </div>
          )}

          <Separator orientation="vertical" className="h-4 bg-foreground/20" />

          <Link
            href={`/media/shows/${tmdbId}/seasons/${seasonNumber}`}
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Layers className="size-4" />
            Season {seasonNumber}
          </Link>

          <Separator orientation="vertical" className="h-4 bg-foreground/20" />

          <span className="text-muted-foreground/80 tabular-nums">
            Episode {episodeNumber} of {totalEpisodes}
          </span>

          {episode.airDate && (
            <>
              <Separator orientation="vertical" className="h-4 bg-foreground/20" />
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-4" />
                {formatAirDate(episode.airDate)}
              </span>
            </>
          )}

          {episode.runtime && episode.runtime > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 bg-foreground/20" />
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4" />
                {episode.runtime}m
              </span>
            </>
          )}

          <span className="text-muted-foreground/60">{show.name}</span>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface EpisodeHeaderProps {
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeHeader({ tmdbId, seasonNumber, episodeNumber }: EpisodeHeaderProps) {
  const episodeQuery = useQuery(showEpisodeQueryOptions(tmdbId, seasonNumber, episodeNumber));
  const showQuery = useQuery(showDetailQueryOptions(tmdbId));
  const seasonQuery = useQuery(showSeasonQueryOptions(tmdbId, seasonNumber));

  return (
    <Queries
      results={[episodeQuery, showQuery, seasonQuery] as const}
      callbacks={{
        loading: EpisodeHeaderLoading,
        error: () => <EpisodeHeaderError />,
        success: ([episode, show, season]) => (
          <EpisodeHeaderSuccess
            episode={episode}
            show={show}
            season={season}
            tmdbId={tmdbId}
            seasonNumber={seasonNumber}
            episodeNumber={episodeNumber}
          />
        ),
      }}
    />
  );
}

export type { EpisodeHeaderProps };
export { EpisodeHeader };
