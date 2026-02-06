'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Film, Star, Users } from 'lucide-react';

import type { EpisodeBasic, SeasonDetail } from '@/api/entities';
import { cn } from '@/lib/utils';
import { showSeasonQueryOptions } from '@/options/queries/shows/detail';

import { Query } from '@/components/query';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Utilities
// ============================================================================

function formatEpisodeNumber(num: number): string {
  return String(num).padStart(2, '0');
}

function formatAirDate(dateStr?: string): string {
  if (!dateStr) return 'TBA';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isUnaired(airDate?: string): boolean {
  if (!airDate) return true;
  return new Date(airDate) > new Date();
}

// ============================================================================
// Episode Card
// ============================================================================

interface EpisodeCardProps {
  episode: EpisodeBasic;
  tmdbId: number;
  seasonNumber: number;
}

function EpisodeCard({ episode, tmdbId, seasonNumber }: EpisodeCardProps) {
  const unaired = isUnaired(episode.airDate);

  return (
    <Link
      href={`/media/shows/${tmdbId}/seasons/${seasonNumber}/episodes/${episode.episodeNumber}`}
      className={cn(
        'group flex gap-4 rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 to-transparent p-3 transition-all hover:border-border hover:bg-muted/30',
        unaired && 'opacity-60'
      )}
    >
      {/* Still image */}
      <div className="w-32 shrink-0 sm:w-40 md:w-48">
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
          {episode.stillUrl ? (
            <>
              <Image
                src={episode.stillUrl}
                alt={episode.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 768px) 192px, (min-width: 640px) 160px, 128px"
              />
              {/* Unaired overlay */}
              {unaired && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                  <Badge className="bg-amber-500/20 text-amber-400">Upcoming</Badge>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80">
              <Film className="size-6 text-muted-foreground/30" />
              {unaired && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Badge className="bg-amber-500/20 text-amber-400">Upcoming</Badge>
                </div>
              )}
            </div>
          )}

          {/* Episode number badge */}
          <div className="absolute bottom-1.5 left-1.5">
            <Badge className="bg-black/70 font-mono text-[10px] text-white backdrop-blur-sm">
              E{formatEpisodeNumber(episode.episodeNumber)}
            </Badge>
          </div>
        </AspectRatio>
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="truncate font-semibold">{episode.name}</p>

        {/* Metadata row */}
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {episode.airDate && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {unaired && !episode.airDate ? 'TBA' : formatAirDate(episode.airDate)}
            </span>
          )}
          {!episode.airDate && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              TBA
            </span>
          )}
          {episode.runtime && episode.runtime > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {episode.runtime}m
            </span>
          )}
          {episode.rating > 0 && episode.voteCount > 0 && (
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              {episode.rating.toFixed(1)}
            </span>
          )}
          {episode.guestStars.length > 0 && (
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {episode.guestStars.length} guests
            </span>
          )}
        </div>

        {/* Overview */}
        {episode.overview && (
          <p className="mt-2 hidden line-clamp-2 text-sm text-muted-foreground/80 sm:block">{episode.overview}</p>
        )}
      </div>
    </Link>
  );
}

// ============================================================================
// Empty State
// ============================================================================

function EmptyEpisodes() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20 py-16 text-center">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl" />
        <Film className="relative size-14 text-muted-foreground/30" />
      </div>
      <h3 className="mt-6 text-lg font-medium">No episodes found</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Episode information is not yet available for this season.
      </p>
    </div>
  );
}

// ============================================================================
// Loading
// ============================================================================

function EpisodesTabLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl border border-border/40 p-3">
          <div className="w-32 shrink-0 sm:w-40 md:w-48">
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="hidden h-3 w-full sm:block" />
            <Skeleton className="hidden h-3 w-2/3 sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Content
// ============================================================================

interface EpisodesTabContentProps {
  season: SeasonDetail;
  tmdbId: number;
  seasonNumber: number;
}

function EpisodesTabContent({ season, tmdbId, seasonNumber }: EpisodesTabContentProps) {
  if (season.episodes.length === 0) {
    return <EmptyEpisodes />;
  }

  return (
    <div className="space-y-3">
      {season.episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} tmdbId={tmdbId} seasonNumber={seasonNumber} />
      ))}
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface EpisodesTabProps {
  tmdbId: number;
  seasonNumber: number;
}

function EpisodesTab({ tmdbId, seasonNumber }: EpisodesTabProps) {
  const seasonQuery = useQuery(showSeasonQueryOptions(tmdbId, seasonNumber));

  return (
    <Query
      result={seasonQuery}
      callbacks={{
        loading: EpisodesTabLoading,
        error: () => null,
        success: (season) => <EpisodesTabContent season={season} tmdbId={tmdbId} seasonNumber={seasonNumber} />,
      }}
    />
  );
}

export type { EpisodesTabProps };
export { EpisodesTab };
