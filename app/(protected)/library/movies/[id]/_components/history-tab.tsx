'use client';

import {
  AlertCircle,
  ArrowUpCircle,
  CheckCircle2,
  Download,
  History,
  type LucideIcon,
  RefreshCw,
  Server,
  Trash2,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { HistoryEvent, Movie } from './types';

interface EventConfig {
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  pulseColor?: string;
}

const eventConfig: Record<HistoryEvent['type'], EventConfig> = {
  grabbed: {
    icon: Download,
    label: 'Grabbed',
    description: 'Release grabbed from indexer',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    pulseColor: 'bg-blue-400',
  },
  downloaded: {
    icon: CheckCircle2,
    label: 'Downloaded',
    description: 'Download completed successfully',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  upgraded: {
    icon: ArrowUpCircle,
    label: 'Upgraded',
    description: 'Replaced with higher quality',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  failed: {
    icon: AlertCircle,
    label: 'Failed',
    description: 'Download failed',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  deleted: {
    icon: Trash2,
    label: 'Deleted',
    description: 'File was removed',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
};

function getQualityTier(quality: string): { label: string; tier: 'premium' | 'high' | 'standard' } {
  const q = quality.toLowerCase();
  if (q.includes('2160') || q.includes('4k') || q.includes('uhd')) {
    return { label: '4K', tier: 'premium' };
  }
  if (q.includes('1080')) {
    return { label: 'HD', tier: 'high' };
  }
  return { label: 'SD', tier: 'standard' };
}

function getRelativeTime(dateStr: string): string {
  // Simple relative time - in production you'd use a library like date-fns
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parts = dateStr.split(' ');
  if (parts.length >= 2) {
    const monthIdx = months.indexOf(parts[0]);
    if (monthIdx !== -1) {
      const day = parseInt(parts[1].replace(',', ''));
      const year = parts[2] ? parseInt(parts[2]) : new Date().getFullYear();
      const eventDate = new Date(year, monthIdx, day);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    }
  }
  return dateStr;
}

interface HistoryTabProps {
  movie: Movie;
}

interface TimelineEventProps {
  event: HistoryEvent;
  isFirst: boolean;
  isLast: boolean;
  isLatest: boolean;
}

function TimelineEvent({ event, isFirst, isLast, isLatest }: TimelineEventProps) {
  const config = eventConfig[event.type];
  const Icon = config.icon;
  const qualityTier = getQualityTier(event.quality);
  const relativeTime = getRelativeTime(event.date);
  const isSuccess = event.type === 'downloaded' || event.type === 'upgraded';
  const isFailed = event.type === 'failed';

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        {/* Top connector */}
        {!isFirst && <div className="h-4 w-px bg-gradient-to-b from-white/[0.08] to-white/[0.15]" />}
        {isFirst && <div className="h-4" />}

        {/* Node */}
        <div className="relative">
          <div
            className={cn(
              'relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300',
              config.bgColor,
              config.borderColor,
              isLatest && 'ring-4 ring-white/5'
            )}
          >
            <Icon className={cn('size-5', config.color)} />
          </div>

          {/* Pulse animation for latest/active */}
          {isLatest && config.pulseColor && (
            <div className="absolute inset-0 z-0">
              <div
                className={cn('absolute inset-0 animate-ping rounded-full opacity-20', config.pulseColor)}
                style={{ animationDuration: '2s' }}
              />
            </div>
          )}
        </div>

        {/* Bottom connector */}
        {!isLast && <div className="flex-1 w-px min-h-4 bg-gradient-to-b from-white/[0.15] to-white/[0.08]" />}
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex-1 rounded-xl border bg-gradient-to-br p-4 transition-all duration-300',
          isLatest
            ? 'border-white/[0.1] from-white/[0.04] to-transparent'
            : 'border-white/[0.06] from-white/[0.02] to-transparent hover:border-white/[0.1] hover:from-white/[0.03]',
          isFirst ? 'mb-3' : 'my-3'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2.5">
              <span className={cn('font-semibold', config.color)}>{config.label}</span>

              {/* Quality badge */}
              <Badge
                className={cn(
                  'px-2 py-0.5 text-[10px] font-semibold',
                  qualityTier.tier === 'premium'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                    : qualityTier.tier === 'high'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-white/10 text-muted-foreground'
                )}
              >
                {event.quality}
              </Badge>

              {/* Success/fail indicator */}
              {isSuccess && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/20">
                      <CheckCircle2 className="size-3 text-emerald-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Completed successfully</TooltipContent>
                </Tooltip>
              )}

              {isFailed && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex size-5 items-center justify-center rounded-full bg-red-500/20">
                      <AlertCircle className="size-3 text-red-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Download failed</TooltipContent>
                </Tooltip>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground/70">{config.description}</p>
          </div>

          {/* Time */}
          <div className="text-right">
            <Tooltip>
              <TooltipTrigger>
                <time className="text-sm font-medium text-muted-foreground">{relativeTime}</time>
              </TooltipTrigger>
              <TooltipContent>{event.date}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Metadata */}
        {(event.indexer || event.downloadClient || event.reason) && (
          <>
            <Separator className="my-3 bg-white/[0.04]" />
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {event.indexer && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Server className="size-3.5" />
                  <span className="font-medium">{event.indexer}</span>
                </div>
              )}
              {event.downloadClient && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Download className="size-3.5" />
                  <span className="font-medium">{event.downloadClient}</span>
                </div>
              )}
              {event.reason && (
                <div className="flex items-center gap-1.5 text-red-400">
                  <AlertCircle className="size-3.5" />
                  <span className="font-medium">{event.reason}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] py-16 text-center">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl" />
        <History className="relative size-14 text-muted-foreground/30" />
      </div>
      <h3 className="mt-6 text-lg font-medium">No history yet</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Download activity will appear here once the movie is grabbed or downloaded.
      </p>
      <Button variant="outline" size="sm" className="mt-6 gap-2 border-white/10">
        <RefreshCw className="size-4" />
        Search for releases
      </Button>
    </div>
  );
}

function HistorySummary({ history }: { history: HistoryEvent[] }) {
  const downloaded = history.filter((e) => e.type === 'downloaded').length;
  const failed = history.filter((e) => e.type === 'failed').length;
  const upgraded = history.filter((e) => e.type === 'upgraded').length;

  const latestSuccess = history.find((e) => e.type === 'downloaded' || e.type === 'upgraded');

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
          <Zap className="size-4 text-amber-500" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Activity</p>
          <p className="text-lg font-semibold tabular-nums">{history.length} events</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {downloaded > 0 && (
          <div className="text-center">
            <p className="text-lg font-semibold tabular-nums text-emerald-400">{downloaded}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Downloaded</p>
          </div>
        )}
        {upgraded > 0 && (
          <div className="text-center">
            <p className="text-lg font-semibold tabular-nums text-purple-400">{upgraded}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Upgraded</p>
          </div>
        )}
        {failed > 0 && (
          <div className="text-center">
            <p className="text-lg font-semibold tabular-nums text-red-400">{failed}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Failed</p>
          </div>
        )}
      </div>

      {latestSuccess && (
        <div className="hidden sm:block">
          <p className="text-xs text-muted-foreground">Last successful</p>
          <p className="text-sm font-medium">{latestSuccess.date}</p>
        </div>
      )}
    </div>
  );
}

export function HistoryTab({ movie }: HistoryTabProps) {
  if (movie.history.length === 0) {
    return <EmptyHistory />;
  }

  // Sort by most recent first (assuming newer events have higher IDs or are first in array)
  const sortedHistory = [...movie.history].sort((a, b) => b.id - a.id);

  return (
    <div className="space-y-4">
      <HistorySummary history={movie.history} />

      <div className="relative">
        {sortedHistory.map((event, index) => (
          <TimelineEvent
            key={event.id}
            event={event}
            isFirst={index === 0}
            isLast={index === sortedHistory.length - 1}
            isLatest={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
