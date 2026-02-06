'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowUpCircle,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  History,
  type LucideIcon,
  Play,
  Search,
  Trash2,
} from 'lucide-react';

import type { EpisodeFile, ShowHistoryEvent, ShowLibraryInfo } from '@/api/entities';
import { cn } from '@/lib/utils';
import {
  showEpisodeFilesQueryOptions,
  showHistoryQueryOptions,
  showLibraryInfoQueryOptions,
} from '@/options/queries/shows/library';

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
  color: string;
  bgColor: string;
}

const eventConfig: Record<ShowHistoryEvent['type'], EventConfig> = {
  grabbed: {
    icon: Download,
    label: 'Grabbed',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  downloadFolderImported: {
    icon: CheckCircle2,
    label: 'Downloaded',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  downloadFailed: {
    icon: AlertCircle,
    label: 'Failed',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  episodeFileDeleted: {
    icon: Trash2,
    label: 'Deleted',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  episodeFileRenamed: {
    icon: ArrowUpCircle,
    label: 'Renamed',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  unknown: {
    icon: History,
    label: 'Unknown',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
  },
};

// ============================================================================
// Utilities
// ============================================================================

function getRelativeTime(dateStr: string): string {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
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

function findEpisodeFile(files: EpisodeFile[], seasonNumber: number, episodeNumber: number): EpisodeFile | undefined {
  const exactMatch = files.find((f) => f.seasonNumber === seasonNumber && f.episodeNumber === episodeNumber);
  if (exactMatch) return exactMatch;

  const seasonFiles = files.filter((f) => f.seasonNumber === seasonNumber);
  const padded = `E${String(episodeNumber).padStart(2, '0')}`;
  return seasonFiles.find((f) => f.path.toUpperCase().includes(padded));
}

// ============================================================================
// Sub-components
// ============================================================================

interface MiniTimelineEventProps {
  event: ShowHistoryEvent;
}

function MiniTimelineEvent({ event }: MiniTimelineEventProps) {
  const config = eventConfig[event.type];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className={cn('flex size-7 items-center justify-center rounded-full', config.bgColor)}>
        <Icon className={cn('size-3.5', config.color)} />
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
          <Badge className="bg-muted px-1.5 py-0 text-[10px] text-muted-foreground">{event.quality}</Badge>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <span className="shrink-0 text-xs text-muted-foreground/60">{getRelativeTime(event.date)}</span>
          </TooltipTrigger>
          <TooltipContent>{formatDate(event.date)}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

interface ActionButtonsProps {
  hasFile: boolean;
}

function ActionButtons({ hasFile }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" className="gap-2 bg-amber-600 text-white hover:bg-amber-700">
        <Search className="size-4" />
        Search for Release
      </Button>
      <Button variant="outline" size="sm" className="gap-2 border-border">
        <Eye className="size-4" />
        Toggle Monitoring
      </Button>
      {hasFile && (
        <>
          <Button variant="outline" size="sm" className="gap-2 border-border">
            <Play className="size-4" />
            Play
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
            Delete File
          </Button>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Loading
// ============================================================================

function EpisodeActionsLoading() {
  return (
    <div className="space-y-4 rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 to-transparent p-4 sm:p-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>
      <Separator className="bg-border/40" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

// ============================================================================
// Not In Library
// ============================================================================

function NotInLibrary() {
  return (
    <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted/50">
          <EyeOff className="size-5 text-muted-foreground/50" />
        </div>
        <div>
          <p className="text-sm font-medium">Not in Library</p>
          <p className="text-xs text-muted-foreground">
            This show is not monitored in Sonarr. Add it to your library to manage downloads.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Inner Actions (queries history + files once we have sonarrId)
// ============================================================================

interface EpisodeActionsInnerProps {
  sonarrId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeActionsInner({ sonarrId, seasonNumber, episodeNumber }: EpisodeActionsInnerProps) {
  const historyQuery = useQuery(showHistoryQueryOptions(sonarrId));
  const filesQuery = useQuery(showEpisodeFilesQueryOptions(sonarrId));

  const isLoading = historyQuery.isLoading || filesQuery.isLoading;
  if (isLoading) return <EpisodeActionsLoading />;

  const allHistory = historyQuery.data ?? [];
  const allFiles = filesQuery.data ?? [];

  // Filter history events for this episode
  const episodeHistory = allHistory
    .filter((e) => e.seasonNumber === seasonNumber && e.episodeNumber === episodeNumber)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Find file for this episode
  const file = findEpisodeFile(allFiles, seasonNumber, episodeNumber);
  const hasFile = !!file;

  return (
    <div className="space-y-4 rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 to-transparent p-4 sm:p-6">
      {/* Action Buttons */}
      <ActionButtons hasFile={hasFile} />

      {/* Mini History Timeline */}
      {episodeHistory.length > 0 && (
        <>
          <Separator className="bg-border/40" />
          <div>
            <div className="flex items-center gap-2 text-sm">
              <History className="size-4 text-muted-foreground/60" />
              <span className="font-medium text-muted-foreground">Recent Activity</span>
            </div>
            <div className="mt-2 space-y-0.5">
              {episodeHistory.map((event) => (
                <MiniTimelineEvent key={event.id} event={event} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface EpisodeActionsProps {
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeActions({ tmdbId, seasonNumber, episodeNumber }: EpisodeActionsProps) {
  const libraryQuery = useQuery(showLibraryInfoQueryOptions(tmdbId));

  return (
    <Query
      result={libraryQuery}
      callbacks={{
        loading: EpisodeActionsLoading,
        error: () => <NotInLibrary />,
        success: (library: ShowLibraryInfo) => {
          if (!library.inLibrary || !library.sonarrId) {
            return <NotInLibrary />;
          }
          return (
            <EpisodeActionsInner
              sonarrId={library.sonarrId}
              seasonNumber={seasonNumber}
              episodeNumber={episodeNumber}
            />
          );
        },
      }}
    />
  );
}

export type { EpisodeActionsProps };
export { EpisodeActions };
