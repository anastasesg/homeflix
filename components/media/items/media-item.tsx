'use client';

import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import type { LucideIcon } from 'lucide-react';
import { Film, Star, Tv } from 'lucide-react';
import type { ReactNode } from 'react';

import type { DiscoverMovie, DiscoverShow } from '@/api/entities';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type { StatusConfig } from '../types';

// ============================================================================
// Utilities
// ============================================================================

const DISCOVER_STATUS: Record<'movie' | 'show', StatusConfig> = {
  movie: { icon: Film, label: 'Movie', color: 'text-muted-foreground', bg: 'bg-muted' },
  show: { icon: Tv, label: 'TV Show', color: 'text-muted-foreground', bg: 'bg-muted' },
};

// ============================================================================
// Types
// ============================================================================

interface DiscoverMovieItemProps {
  type: 'movie';
  data: DiscoverMovie;
  genreMap: Map<number, string>;
}

interface DiscoverShowItemProps {
  type: 'show';
  data: DiscoverShow;
  genreMap: Map<number, string>;
}

type DiscoverMediaItemProps = DiscoverMovieItemProps | DiscoverShowItemProps;

interface GenericMediaItemProps<TRoute extends string = string> {
  /** Navigation href */
  href: Route<TRoute>;
  /** Media title */
  title: string;
  /** Year of release */
  year?: number;
  /** Poster image URL */
  posterUrl?: string;
  /** Resolved status configuration */
  status: StatusConfig;
  /** Icon for placeholder when no poster is available */
  placeholderIcon?: LucideIcon;
  /** Slot for metadata (genres, network, etc.) - renders below title */
  metadataSlot?: ReactNode;
  /** Slot for additional content below metadata (e.g., progress bar) */
  extraSlot?: ReactNode;
  /** Slot for stats/info on the right side (rating, episode counts, etc.) */
  statsSlot?: ReactNode;
  /** Slot for badges/actions on the far right (quality badge, etc.) */
  badgesSlot?: ReactNode;
}

type MediaItemProps<TRoute extends string = string> = DiscoverMediaItemProps | GenericMediaItemProps<TRoute>;

// ============================================================================
// Loading
// ============================================================================

interface MediaItemLoadingProps {
  count?: number;
}

function MediaItemLoading({ count = 8 }: MediaItemLoadingProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-20 animate-pulse gap-4 rounded-lg bg-muted/50 p-2"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="h-full w-12 rounded bg-muted" />
          <div className="flex flex-1 flex-col justify-center gap-2">
            <div className="h-4 w-48 rounded bg-muted" />
            <div className="h-3 w-32 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Error
// ============================================================================

interface MediaItemErrorProps {
  type: 'movie' | 'show';
  error: Error;
}

function MediaItemError({ type, error }: MediaItemErrorProps) {
  const label = type === 'movie' ? 'movies' : 'shows';

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <h2 className="text-lg font-semibold text-destructive">Failed to load {label}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  );
}

// ============================================================================
// Sub-components: Discover Item
// ============================================================================

function DiscoverItemContent({ type, data, genreMap }: DiscoverMediaItemProps) {
  const isMovie = type === 'movie';
  const Icon = isMovie ? Film : Tv;
  const genreNames = data.genreIds
    .map((id) => genreMap.get(id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <GenericItemContent
      href={`/media/${isMovie ? 'movies' : 'shows'}/${data.id}` as Route}
      title={data.title}
      year={data.year > 0 ? data.year : undefined}
      posterUrl={data.posterUrl}
      status={DISCOVER_STATUS[type]}
      placeholderIcon={Icon}
      metadataSlot={
        genreNames.length > 0 && <span className="truncate text-muted-foreground">{genreNames.join(', ')}</span>
      }
      statsSlot={
        data.rating > 0 && (
          <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium tabular-nums">{data.rating.toFixed(1)}</span>
          </div>
        )
      }
      badgesSlot={
        data.rating >= 8 && (
          <Badge variant="secondary" className="hidden bg-amber-500/10 text-amber-400 sm:inline-flex">
            Top Rated
          </Badge>
        )
      }
    />
  );
}

// ============================================================================
// Main
// ============================================================================

function GenericItemContent<TRoute extends string = string>({
  href,
  title,
  year,
  posterUrl,
  status,
  placeholderIcon: PlaceholderIcon,
  metadataSlot,
  extraSlot,
  statsSlot,
  badgesSlot,
}: GenericMediaItemProps<TRoute>) {
  const StatusIcon = status.icon;

  return (
    <Link href={href} className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50">
      {/* Poster Thumbnail */}
      <div className="relative h-[72px] w-12 shrink-0 overflow-hidden rounded-md bg-muted">
        {posterUrl ? (
          <Image src={posterUrl} alt={title} className="h-full w-full object-cover" fill />
        ) : (
          <div className="flex h-full items-center justify-center">
            {PlaceholderIcon && <PlaceholderIcon className="size-5 text-muted-foreground/30" />}
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-foreground group-hover:text-primary">{title}</h3>
          {year && <span className="shrink-0 text-sm tabular-nums text-muted-foreground">({year})</span>}
        </div>

        {metadataSlot && (
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {metadataSlot}
          </div>
        )}

        {extraSlot}
      </div>

      {/* Stats section (hidden on mobile) */}
      {statsSlot}

      {/* Badges and status */}
      <div className="flex shrink-0 items-center gap-2">
        {badgesSlot}

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="secondary"
              className={cn('size-7 p-0', status.bg, status.glow && `shadow-lg ${status.glow}`)}
            >
              <StatusIcon className={cn('size-4', status.color)} />
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-medium">
            {status.label}
          </TooltipContent>
        </Tooltip>
      </div>
    </Link>
  );
}

function MediaItem<TRoute extends string = string>(props: MediaItemProps<TRoute>) {
  if ('type' in props) {
    return <DiscoverItemContent {...props} />;
  }
  return <GenericItemContent {...props} />;
}

export type {
  DiscoverMediaItemProps,
  GenericMediaItemProps,
  MediaItemErrorProps,
  MediaItemLoadingProps,
  MediaItemProps,
};
export { MediaItem, MediaItemError, MediaItemLoading };
