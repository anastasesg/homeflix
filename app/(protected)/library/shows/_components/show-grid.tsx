'use client';

import Link from 'next/link';

import { AlertCircle, Calendar, CheckCircle2, Clock, Download, type LucideIcon, Star, Tv2 } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { DisplayStatus, EnrichedShow } from './types';

interface ShowGridProps {
  shows: EnrichedShow[];
  isLoading?: boolean;
}

// Compute display status based on episode counts
function getDisplayStatus(show: EnrichedShow): DisplayStatus {
  if (show.totalEpisodes === 0) return 'wanted';
  if (show.downloadedEpisodes === show.totalEpisodes) return 'complete';
  if (show.downloadedEpisodes > 0) return 'partial';
  return 'missing';
}

const statusConfig: Record<
  DisplayStatus,
  { icon: LucideIcon; label: string; color: string; bg: string; glow: string }
> = {
  complete: {
    icon: CheckCircle2,
    label: 'Complete',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    glow: 'shadow-emerald-500/20',
  },
  partial: {
    icon: Download,
    label: 'In Progress',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    glow: 'shadow-blue-500/20',
  },
  downloading: {
    icon: Download,
    label: 'Downloading',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    glow: 'shadow-blue-500/20',
  },
  missing: {
    icon: AlertCircle,
    label: 'Missing',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    glow: 'shadow-amber-500/20',
  },
  wanted: {
    icon: Clock,
    label: 'Wanted',
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    glow: '',
  },
};

function ShowGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
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

function ShowGridEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/20 py-20">
      <div className="rounded-full bg-muted/50 p-4">
        <Tv2 className="size-10 text-muted-foreground/50" />
      </div>
      <h3 className="mt-4 text-lg font-medium">No shows found</h3>
      <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
    </div>
  );
}

interface ShowCardProps {
  show: EnrichedShow;
  index: number;
}

function ShowCard({ show, index }: ShowCardProps) {
  const displayStatus = getDisplayStatus(show);
  const status = statusConfig[displayStatus];
  const StatusIcon = status.icon;
  const progressPercent = show.totalEpisodes > 0 ? Math.round((show.downloadedEpisodes / show.totalEpisodes) * 100) : 0;

  return (
    <Link
      href={`/library/shows/${show.id}`}
      className="group relative block overflow-hidden rounded-xl ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-primary/40 hover:shadow-xl hover:shadow-primary/10"
      style={{
        animationDelay: `${index * 30}ms`,
      }}
    >
      <AspectRatio ratio={2 / 3}>
        {/* Poster image or placeholder */}
        {show.posterUrl ? (
          <img
            src={show.posterUrl}
            alt={show.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-850 to-zinc-900">
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
              <Tv2 className="size-8 text-muted-foreground/30" />
              <span className="text-xs font-medium text-muted-foreground">{show.title}</span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute left-2 top-2 z-10">
              <Badge
                variant="secondary"
                className={cn(
                  'size-6 p-0 shadow-md backdrop-blur-sm transition-transform duration-200 group-hover:scale-110',
                  status.bg,
                  status.glow && `shadow-lg ${status.glow}`
                )}
              >
                <StatusIcon className={cn('size-3.5', status.color)} />
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {status.label} ({show.downloadedEpisodes}/{show.totalEpisodes} episodes)
          </TooltipContent>
        </Tooltip>

        {/* Quality & Season badges */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1">
          {show.quality && displayStatus === 'complete' && (
            <Badge
              variant="secondary"
              className="h-5 bg-black/70 px-1.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md"
            >
              {show.quality}
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="h-5 bg-black/70 px-1.5 text-[10px] font-semibold text-white/80 backdrop-blur-md"
          >
            {show.seasonCount} {show.seasonCount === 1 ? 'Season' : 'Seasons'}
          </Badge>
        </div>

        {/* Rating badge */}
        {show.rating && (
          <div className="absolute bottom-2 right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-black/70 px-1.5 text-yellow-400 backdrop-blur-md"
            >
              <Star className="size-3 fill-current" />
              <span className="text-[10px] font-semibold tabular-nums">{show.rating.toFixed(1)}</span>
            </Badge>
          </div>
        )}

        {/* Episode Progress Bar */}
        {displayStatus === 'partial' && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
            <Progress value={progressPercent} className="h-1 bg-white/20" />
            <p className="mt-1 text-center text-[9px] font-medium text-white/70">
              {show.downloadedEpisodes}/{show.totalEpisodes} episodes
            </p>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="p-3">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white">{show.title}</h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {show.year && (
                <span className="text-[11px] font-medium tabular-nums text-white/70">
                  {show.year}
                  {show.endYear && show.endYear !== show.year ? `–${show.endYear}` : ''}
                </span>
              )}

              {show.network && (
                <>
                  <span className="text-white/30">·</span>
                  <span className="text-[11px] text-white/70">{show.network}</span>
                </>
              )}
            </div>

            {/* Next Episode */}
            {show.nextEpisode && (
              <div className="mt-2 flex items-center gap-1.5 rounded bg-white/10 px-2 py-1">
                <Calendar className="size-3 text-amber-400" />
                <span className="text-[10px] text-white/90">
                  S{show.nextEpisode.seasonNumber.toString().padStart(2, '0')}E
                  {show.nextEpisode.episodeNumber.toString().padStart(2, '0')}
                </span>
                {show.nextEpisode.airDate && (
                  <span className="text-[10px] text-white/60">· {show.nextEpisode.airDate}</span>
                )}
              </div>
            )}

            {/* Genres */}
            {show.genres && show.genres.length > 0 && !show.nextEpisode && (
              <div className="mt-2 flex flex-wrap gap-1">
                {show.genres.slice(0, 2).map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="h-4 border-white/20 bg-white/5 px-1.5 text-[9px] text-white/80"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subtle top gradient for status badges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
      </AspectRatio>
    </Link>
  );
}

function ShowGrid({ shows, isLoading }: ShowGridProps) {
  if (isLoading) {
    return <ShowGridSkeleton />;
  }

  if (shows.length === 0) {
    return <ShowGridEmpty />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {shows.map((show, index) => (
        <ShowCard key={show.id} show={show} index={index} />
      ))}
    </div>
  );
}

export { ShowGrid, ShowGridEmpty, ShowGridSkeleton };
