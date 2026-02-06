'use client';

import { useState } from 'react';

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  type LucideIcon,
  Search,
  Tv2,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type { EpisodeStatus, Season } from './types';

interface SeasonBrowserProps {
  seasons: Season[];
  defaultExpandedSeason?: number;
}

const episodeStatusConfig: Record<EpisodeStatus, { icon: LucideIcon; label: string; color: string; bg: string }> = {
  downloaded: {
    icon: CheckCircle2,
    label: 'Downloaded',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
  },
  downloading: {
    icon: Download,
    label: 'Downloading',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  missing: {
    icon: AlertCircle,
    label: 'Missing',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
  },
  wanted: {
    icon: Clock,
    label: 'Wanted',
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  },
  unaired: {
    icon: Calendar,
    label: 'Unaired',
    color: 'text-muted-foreground/50',
    bg: 'bg-muted/50',
  },
};

function SeasonBrowser({ seasons, defaultExpandedSeason }: SeasonBrowserProps) {
  const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(
    new Set(defaultExpandedSeason ? [defaultExpandedSeason] : [])
  );

  const toggleSeason = (seasonNumber: number) => {
    setExpandedSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(seasonNumber)) {
        next.delete(seasonNumber);
      } else {
        next.add(seasonNumber);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSeasons(new Set(seasons.map((s) => s.seasonNumber)));
  };

  const collapseAll = () => {
    setExpandedSeasons(new Set());
  };

  // Sort seasons (most recent first, but Season 1 logic applies)
  const sortedSeasons = [...seasons].sort((a, b) => b.seasonNumber - a.seasonNumber);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tv2 className="size-5 text-amber-500" />
          <h3 className="text-lg font-semibold">Seasons & Episodes</h3>
          <Badge variant="secondary" className="ml-2">
            {seasons.length} {seasons.length === 1 ? 'Season' : 'Seasons'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs">
            Expand All
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs">
            Collapse All
          </Button>
        </div>
      </div>

      {/* Season List */}
      <div className="space-y-2">
        {sortedSeasons.map((season) => {
          const isExpanded = expandedSeasons.has(season.seasonNumber);
          const progressPercent =
            season.episodeCount > 0 ? Math.round((season.downloadedCount / season.episodeCount) * 100) : 0;
          const isComplete = season.downloadedCount === season.episodeCount;
          const isMissing = season.downloadedCount === 0 && season.episodeCount > 0;

          return (
            <Collapsible key={season.id} open={isExpanded} onOpenChange={() => toggleSeason(season.seasonNumber)}>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] transition-colors hover:bg-white/[0.04]">
                {/* Season Header */}
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center gap-4 p-4 text-left">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400">
                      {isExpanded ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Season {season.seasonNumber}</h4>
                        {isComplete && (
                          <Badge className="bg-emerald-500/20 text-emerald-400">
                            <CheckCircle2 className="mr-1 size-3" />
                            Complete
                          </Badge>
                        )}
                        {isMissing && (
                          <Badge className="bg-amber-500/20 text-amber-400">
                            <AlertCircle className="mr-1 size-3" />
                            Missing
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{season.episodeCount} episodes</span>
                        <span className="text-muted-foreground/50">·</span>
                        <span className="tabular-nums">
                          {season.downloadedCount}/{season.episodeCount} downloaded
                        </span>
                        {season.airDate && (
                          <>
                            <span className="text-muted-foreground/50">·</span>
                            <span>{season.airDate}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="hidden w-32 sm:block">
                      <Progress value={progressPercent} className="h-2" />
                      <p className="mt-1 text-right text-xs text-muted-foreground tabular-nums">{progressPercent}%</p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8" onClick={(e) => e.stopPropagation()}>
                            <Search className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Search season</TooltipContent>
                      </Tooltip>
                    </div>
                  </button>
                </CollapsibleTrigger>

                {/* Episodes */}
                <CollapsibleContent>
                  <div className="border-t border-white/[0.06] px-4 pb-4">
                    <div className="mt-3 space-y-1">
                      {season.episodes.map((episode) => {
                        const status = episodeStatusConfig[episode.status];
                        const StatusIcon = status.icon;

                        return (
                          <div
                            key={episode.id}
                            className={cn(
                              'group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.04]',
                              episode.status === 'unaired' && 'opacity-50'
                            )}
                          >
                            {/* Episode Number */}
                            <span className="w-8 shrink-0 text-center text-sm font-medium tabular-nums text-muted-foreground">
                              {episode.episodeNumber.toString().padStart(2, '0')}
                            </span>

                            {/* Status Icon */}
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="secondary" className={cn('size-6 p-0', status.bg)}>
                                  <StatusIcon className={cn('size-3.5', status.color)} />
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>{status.label}</TooltipContent>
                            </Tooltip>

                            {/* Episode Info */}
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-medium">
                                {episode.title || `Episode ${episode.episodeNumber}`}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {episode.airDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    {episode.airDate}
                                  </span>
                                )}
                                {episode.runtime && (
                                  <>
                                    <span className="text-muted-foreground/30">·</span>
                                    <span>{episode.runtime}m</span>
                                  </>
                                )}
                                {episode.quality && episode.status === 'downloaded' && (
                                  <>
                                    <span className="text-muted-foreground/30">·</span>
                                    <Badge variant="outline" className="h-4 px-1 text-[10px]">
                                      {episode.quality}
                                    </Badge>
                                  </>
                                )}
                                {episode.size && episode.status === 'downloaded' && (
                                  <>
                                    <span className="text-muted-foreground/30">·</span>
                                    <span className="tabular-nums">{episode.size}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Episode Actions */}
                            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              {episode.status !== 'downloaded' && episode.status !== 'unaired' && (
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                  <Search className="mr-1 size-3" />
                                  Search
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}

export { SeasonBrowser };
