'use client';

import { useQuery } from '@tanstack/react-query';
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
} from 'lucide-react';

import { type HistoryEvent } from '@/api/entities';
import { cn } from '@/lib/utils';
import { radarrHistoryQueryOptions, radarrLookupQueryOptions } from '@/options/queries/tmdb';

import { Query } from '@/components/query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// ============================================================================
// Event Config
// ============================================================================

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
  downloadFolderImported: {
    icon: CheckCircle2,
    label: 'Downloaded',
    description: 'Download completed successfully',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  downloadFailed: {
    icon: AlertCircle,
    label: 'Failed',
    description: 'Download failed',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  movieFileDeleted: {
    icon: Trash2,
    label: 'Deleted',
    description: 'File was removed',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  movieFileRenamed: {
    icon: ArrowUpCircle,
    label: 'Renamed',
    description: 'File was renamed',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  unknown: {
    icon: History,
    label: 'Unknown',
    description: 'Unknown event',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
    borderColor: 'border-border',
  },
};

// ============================================================================
// Helpers
// ============================================================================

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

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getRelativeTime(dateStr: string): string {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ============================================================================
// Timeline Event
// ============================================================================

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
  const isSuccess = event.type === 'downloadFolderImported';
  const isFailed = event.type === 'downloadFailed';

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        {/* Top connector */}
        {!isFirst && <div className="h-4 w-px bg-gradient-to-b from-border/50 to-border" />}
        {isFirst && <div className="h-4" />}

        {/* Node */}
        <div className="relative">
          <div
            className={cn(
              'relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300',
              config.bgColor,
              config.borderColor,
              isLatest && 'ring-4 ring-border'
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
        {!isLast && <div className="min-h-4 w-px flex-1 bg-gradient-to-b from-border to-border/50" />}
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex-1 rounded-xl border bg-gradient-to-br p-4 transition-all duration-300',
          isLatest
            ? 'border-border from-muted/40 to-transparent'
            : 'border-border/60 from-muted/20 to-transparent hover:border-border hover:from-muted/30',
          isFirst ? 'mb-3' : 'my-3'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('font-semibold', config.color)}>{config.label}</span>

              {/* Quality badge */}
              <Badge
                className={cn(
                  'px-2 py-0.5 text-[10px] font-semibold',
                  qualityTier.tier === 'premium'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                    : qualityTier.tier === 'high'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-muted text-muted-foreground'
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

            {/* Source title */}
            {event.sourceTitle && (
              <p className="mt-1.5 truncate font-mono text-xs text-muted-foreground/80">{event.sourceTitle}</p>
            )}

            <p className="mt-1 text-xs text-muted-foreground/60">{config.description}</p>
          </div>

          {/* Time */}
          <div className="text-right">
            <Tooltip>
              <TooltipTrigger>
                <time className="text-sm font-medium text-muted-foreground">{relativeTime}</time>
              </TooltipTrigger>
              <TooltipContent>{formatDate(event.date)}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Metadata */}
        {(event.indexer || event.downloadClient || event.reason) && (
          <>
            <Separator className="my-3" />
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

// ============================================================================
// Empty State
// ============================================================================

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl" />
        <History className="relative size-14 text-muted-foreground/30" />
      </div>
      <h3 className="mt-6 text-lg font-medium">No history yet</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Download activity will appear here once the movie is grabbed or downloaded.
      </p>
      <Button variant="outline" size="sm" className="mt-6 gap-2">
        <RefreshCw className="size-4" />
        Search for releases
      </Button>
    </div>
  );
}

// ============================================================================
// Loading
// ============================================================================

function HistoryTabLoading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-24 flex-1 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Error
// ============================================================================

function HistoryTabError({ error }: { error: unknown }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 py-16 text-center">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-destructive/10 blur-xl" />
        <AlertCircle className="relative size-14 text-destructive/40" />
      </div>
      <h3 className="mt-6 text-lg font-medium text-destructive">Failed to load history</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {error instanceof Error ? error.message : 'An unexpected error occurred'}
      </p>
    </div>
  );
}

// ============================================================================
// Content
// ============================================================================

function HistoryTabContent({ events }: { events: HistoryEvent[] }) {
  if (events.length === 0) {
    return <EmptyHistory />;
  }

  // Sort by most recent first
  const sortedHistory = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
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
  );
}

// ============================================================================
// Main
// ============================================================================

interface HistoryTabProps {
  tmdbId: number;
}

function HistoryTab({ tmdbId }: HistoryTabProps) {
  const libraryQuery = useQuery(radarrLookupQueryOptions(tmdbId));
  const radarrId = libraryQuery.data?.radarrId;

  const historyQuery = useQuery({
    ...radarrHistoryQueryOptions(radarrId ?? 0),
    enabled: !!radarrId,
  });

  if (!radarrId) {
    if (libraryQuery.isLoading) return <HistoryTabLoading />;
    return <EmptyHistory />;
  }

  return (
    <Query
      result={historyQuery}
      callbacks={{
        loading: HistoryTabLoading,
        error: (error) => <HistoryTabError error={error} />,
        success: (events) => <HistoryTabContent events={events} />,
      }}
    />
  );
}

export type { HistoryTabProps };
export { HistoryTab };
