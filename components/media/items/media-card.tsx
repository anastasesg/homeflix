'use client';

import { ReactNode } from 'react';

import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Film, LucideIcon, Star, Tv } from 'lucide-react';

import type { MovieItem, ShowItem } from '@/api/entities';
import { cn } from '@/lib/utils';

import { AspectRatio } from '@/components/ui/aspect-ratio';
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

interface MovieCardProps {
  type: 'movie';
  data: MovieItem;
  index: number;
}

interface ShowCardProps {
  type: 'show';
  data: ShowItem;
  index: number;
}

type MediaCardProps = MovieCardProps | ShowCardProps;

// ============================================================================
// Loading
// ============================================================================

interface MediaCardLoadingProps {
  count?: number;
}

function MediaCardLoading({ count = 12 }: MediaCardLoadingProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl bg-muted/50"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <AspectRatio ratio={2 / 3}>
            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50" />
          </AspectRatio>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Error
// ============================================================================

interface MediaCardErrorProps {
  type: 'movie' | 'show';
  error: Error;
}

function MediaCardError({ type, error }: MediaCardErrorProps) {
  const label = type === 'movie' ? 'movies' : 'shows';

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <h2 className="text-lg font-semibold text-destructive">Failed to load {label}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  );
}

// ============================================================================
// Sub-components: Generic Card Content (used by both movies and shows)
// ============================================================================

interface GenericMediaCardProps<TRoute extends string = string> {
  /** Navigation href */
  href: Route<TRoute>;
  /** Media title (used for alt text and placeholder) */
  title: string;
  /** Poster image URL */
  posterUrl?: string;
  /** Resolved status configuration */
  status: StatusConfig;
  /** Status tooltip text (defaults to status.label) */
  statusTooltip?: string;
  /** Quality badge text (e.g., "1080p", "4K") */
  qualityBadge?: string;
  /** Whether to show quality badge (defaults to true when qualityBadge is provided) */
  showQualityBadge?: boolean;
  /** Custom content for top-right area (rendered after quality badge) */
  topRightSlot?: ReactNode;
  /** Icon for placeholder when no poster is available */
  placeholderIcon?: LucideIcon;
  /** Content rendered in the hover overlay */
  children?: ReactNode;
  /** Animation delay in ms (for staggered animations) */
  animationDelay?: number;
  /** Additional content rendered above the hover overlay (e.g., progress bars) */
  overlaySlot?: ReactNode;
}

function GenericCardContent<TRoute extends string = string>({
  href,
  title,
  posterUrl,
  status,
  statusTooltip,
  qualityBadge,
  showQualityBadge = true,
  topRightSlot,
  placeholderIcon: PlaceholderIcon,
  children,
  animationDelay,
  overlaySlot,
}: GenericMediaCardProps<TRoute>) {
  const StatusIcon = status.icon;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl border border-border/20 transition-colors duration-300 hover:border-primary/40"
      style={animationDelay ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      <AspectRatio ratio={2 / 3}>
        {/* Poster image or placeholder */}
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-850 to-zinc-900">
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
              {PlaceholderIcon && <PlaceholderIcon className="size-8 text-muted-foreground/30" />}
              <span className="text-xs font-medium text-muted-foreground">{title}</span>
            </div>
          </div>
        )}

        {/* Status Badge (top-left) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute left-2 top-2 z-10">
              <Badge
                variant="secondary"
                className={cn(
                  'size-6 p-0 shadow-md transition-transform duration-200 group-hover:scale-110',
                  status.bg,
                  status.glow && `shadow-lg ${status.glow}`
                )}
              >
                <StatusIcon className={cn('size-3.5', status.color)} />
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {statusTooltip ?? status.label}
          </TooltipContent>
        </Tooltip>

        {/* Top-right badges area */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1">
          {qualityBadge && showQualityBadge && (
            <Badge
              variant="secondary"
              className="h-5 bg-black/70 px-1.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md"
            >
              {qualityBadge}
            </Badge>
          )}
          {topRightSlot}
        </div>

        {/* Custom overlay content (e.g., progress bars) */}
        {overlaySlot}

        {/* Hover Overlay with gradient */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="p-3">{children}</div>
        </div>

        {/* Subtle top gradient for status badges visibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
      </AspectRatio>
    </Link>
  );
}

// ============================================================================
// Main
// ============================================================================

function MediaCard<TRoute extends string>(props: MediaCardProps | GenericMediaCardProps<TRoute>) {
  if (!('type' in props)) return <GenericCardContent {...props} />;

  const isMovie = props.type === 'movie';
  const Icon = isMovie ? Film : Tv;

  return (
    <GenericCardContent
      href={`/media/${isMovie ? 'movies' : 'shows'}/${props.data.tmdbId}` as Route}
      title={props.data.title}
      posterUrl={props.data.posterUrl}
      status={DISCOVER_STATUS[props.type]}
      placeholderIcon={Icon}
      animationDelay={props.index * 30}
      overlaySlot={
        props.data.rating > 0 && (
          <div className="absolute bottom-2 right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-black/70 px-1.5 text-yellow-400 backdrop-blur-md"
            >
              <Star className="size-3 fill-current" />
              <span className="text-[10px] font-semibold tabular-nums">{props.data.rating.toFixed(1)}</span>
            </Badge>
          </div>
        )
      }
    >
      <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white">{props.data.title}</h3>

      {props.data.year > 0 && (
        <div className="mt-1.5">
          <span className="text-[11px] font-medium tabular-nums text-white/70">{props.data.year}</span>
        </div>
      )}
    </GenericCardContent>
  );
}

export type { MediaCardErrorProps, MediaCardLoadingProps, MediaCardProps };
export { MediaCard, MediaCardError, MediaCardLoading };
