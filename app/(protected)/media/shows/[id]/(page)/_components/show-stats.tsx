'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, Film, HardDrive, Layers, Plus, Tv } from 'lucide-react';

import { type ShowDetail, type ShowLibraryInfo } from '@/api/entities';
import { cn } from '@/lib/utils';
import { showDetailQueryOptions } from '@/options/queries/shows/detail';
import { showLibraryInfoQueryOptions } from '@/options/queries/shows/library';

import { Queries } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Error
// ============================================================================

interface ShowStatsErrorProps {
  error: unknown;
}

function ShowStatsError({ error }: ShowStatsErrorProps) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-3 w-12 bg-destructive/10" />
              <Skeleton className="mt-2 h-6 w-20 bg-destructive/10" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <Tv className="size-5 text-destructive/30" />
            </div>
          </div>
          {i === 0 && <p className="mt-3 text-xs text-destructive/60">{message}</p>}
          {i !== 0 && <Skeleton className="mt-3 h-3 w-24 bg-destructive/10" />}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Loading
// ============================================================================

function ShowStatsLoading() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-3 w-12" />
              <Skeleton className="mt-2 h-7 w-20" />
            </div>
            <Skeleton className="size-10 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Success
// ============================================================================

interface ShowStatsSuccessProps {
  show: ShowDetail;
  libraryInfo: ShowLibraryInfo;
}

function ShowStatsSuccess({ show, libraryInfo }: ShowStatsSuccessProps) {
  const statusConfig = {
    downloaded: { label: 'Downloaded', icon: CheckCircle2, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
    partial: { label: 'Partial', icon: Layers, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
    downloading: { label: 'Downloading', icon: HardDrive, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
    wanted: { label: 'Wanted', icon: Clock, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
    missing: { label: 'Missing', icon: Film, iconBg: 'bg-red-500/10', iconColor: 'text-red-400' },
    not_in_library: { label: 'Not in Library', icon: Plus, iconBg: 'bg-muted', iconColor: 'text-muted-foreground' },
  }[libraryInfo.status];

  const StatusIcon = statusConfig.icon;

  const totalEpisodes = libraryInfo.totalEpisodes || show.numberOfEpisodes;
  const downloadedEpisodes = libraryInfo.downloadedEpisodes;
  const progressPercent = totalEpisodes > 0 ? Math.round((downloadedEpisodes / totalEpisodes) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {/* Status */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Status</p>
            <p className="text-xl font-bold">{statusConfig.label}</p>
          </div>
          <div className={cn('flex size-10 items-center justify-center rounded-full', statusConfig.iconBg)}>
            <StatusIcon className={cn('size-5', statusConfig.iconColor)} />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {show.numberOfSeasons} {show.numberOfSeasons === 1 ? 'season' : 'seasons'} / {show.numberOfEpisodes} episodes
        </p>
      </div>

      {/* Storage */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Storage</p>
            <p className="text-2xl font-bold tabular-nums">{libraryInfo.sizeOnDisk || '\u2014'}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10">
            <HardDrive className="size-5 text-amber-400" />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {downloadedEpisodes > 0 ? `${downloadedEpisodes} episode files` : 'No files'}
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Progress</p>
            <p className="text-2xl font-bold tabular-nums">
              {downloadedEpisodes}/{totalEpisodes}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
            <Tv className="size-5 text-blue-400" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                progressPercent >= 100
                  ? 'bg-emerald-500'
                  : progressPercent > 0
                    ? 'bg-blue-500'
                    : 'bg-muted-foreground/30'
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{progressPercent}%</span>
        </div>
      </div>

      {/* Monitoring */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Monitoring</p>
            <p className="text-xl font-bold">{libraryInfo.monitored ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-full',
              libraryInfo.monitored ? 'bg-emerald-500/10' : 'bg-muted'
            )}
          >
            {libraryInfo.monitored ? (
              <CheckCircle2 className="size-5 text-emerald-400" />
            ) : (
              <Clock className="size-5 text-muted-foreground" />
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {libraryInfo.nextAiring
            ? `Next: ${new Date(libraryInfo.nextAiring).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            : libraryInfo.monitored
              ? 'Auto-searching for new episodes'
              : 'Not searching'}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface ShowStatsProps {
  tmdbId: number;
}

function ShowStats({ tmdbId }: ShowStatsProps) {
  const showQuery = useQuery(showDetailQueryOptions(tmdbId));
  const libraryQuery = useQuery(showLibraryInfoQueryOptions(tmdbId));

  return (
    <Queries
      results={[showQuery, libraryQuery]}
      callbacks={{
        loading: ShowStatsLoading,
        error: (error) => <ShowStatsError error={error} />,
        success: ([show, library]) => <ShowStatsSuccess show={show} libraryInfo={library} />,
      }}
    />
  );
}

export type { ShowStatsProps };
export { ShowStats };
