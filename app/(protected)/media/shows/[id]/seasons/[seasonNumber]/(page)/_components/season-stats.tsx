'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, Film, HardDrive, Layers, Star, Tv } from 'lucide-react';

import type { SeasonDetail, ShowLibraryInfo } from '@/api/entities';
import { cn } from '@/lib/utils';
import { showSeasonQueryOptions } from '@/options/queries/shows/detail';
import { showLibraryInfoQueryOptions } from '@/options/queries/shows/library';

import { Queries } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Utilities
// ============================================================================

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[i]}`;
}

function computeAverageRating(season: SeasonDetail): { avg: number; count: number } {
  const rated = season.episodes.filter((e) => e.rating > 0 && e.voteCount > 0);
  if (rated.length === 0) return { avg: 0, count: 0 };
  return {
    avg: rated.reduce((sum, e) => sum + e.rating, 0) / rated.length,
    count: rated.length,
  };
}

function getSeasonStatus(season: SeasonDetail, sonarrSeason?: ShowLibraryInfo['seasons'][number]) {
  const now = new Date();
  const airedCount = season.episodes.filter((e) => e.airDate && new Date(e.airDate) <= now).length;
  const totalCount = season.episodes.length;
  const downloadedCount = sonarrSeason?.episodeFileCount ?? 0;

  if (airedCount === totalCount && downloadedCount === totalCount && totalCount > 0) {
    return { label: 'Complete', icon: CheckCircle2, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' };
  }
  if (airedCount === 0) {
    return { label: 'Upcoming', icon: Clock, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' };
  }
  if (airedCount < totalCount) {
    return { label: 'Airing', icon: Tv, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' };
  }
  return { label: 'Partial', icon: Layers, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' };
}

// ============================================================================
// Error
// ============================================================================

function SeasonStatsError() {
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
              <Film className="size-5 text-destructive/30" />
            </div>
          </div>
          <Skeleton className="mt-3 h-3 w-24 bg-destructive/10" />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Loading
// ============================================================================

function SeasonStatsLoading() {
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

interface SeasonStatsSuccessProps {
  season: SeasonDetail;
  library: ShowLibraryInfo;
  seasonNumber: number;
}

function SeasonStatsSuccess({ season, library, seasonNumber }: SeasonStatsSuccessProps) {
  const sonarrSeason = library.inLibrary ? library.seasons.find((s) => s.seasonNumber === seasonNumber) : undefined;

  const episodeFileCount = sonarrSeason?.episodeFileCount ?? 0;
  const episodeCount = sonarrSeason?.episodeCount ?? season.episodes.length;
  const progressPercent = episodeCount > 0 ? Math.round((episodeFileCount / episodeCount) * 100) : 0;

  const sizeOnDisk = sonarrSeason?.sizeOnDisk ?? 0;
  const { avg: avgRating, count: ratedCount } = computeAverageRating(season);
  const status = getSeasonStatus(season, sonarrSeason);
  const StatusIcon = status.icon;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {/* Episodes */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Episodes</p>
            <p className="text-2xl font-bold tabular-nums">
              {library.inLibrary ? `${episodeFileCount}/${episodeCount}` : season.episodes.length}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
            <Film className="size-5 text-blue-400" />
          </div>
        </div>
        {library.inLibrary && (
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
        )}
        {!library.inLibrary && <p className="mt-3 text-xs text-muted-foreground">Not in library</p>}
      </div>

      {/* Storage */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Storage</p>
            <p className="text-2xl font-bold tabular-nums">{sizeOnDisk > 0 ? formatBytes(sizeOnDisk) : '\u2014'}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10">
            <HardDrive className="size-5 text-amber-400" />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {episodeFileCount > 0 ? `${episodeFileCount} episode files` : 'No files'}
        </p>
      </div>

      {/* Rating */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Rating</p>
            <p className="text-2xl font-bold tabular-nums">{avgRating > 0 ? avgRating.toFixed(1) : '\u2014'}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-yellow-500/10">
            <Star className="size-5 text-yellow-400" />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {ratedCount > 0 ? `${ratedCount} rated episodes` : 'No ratings'}
        </p>
      </div>

      {/* Status */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Status</p>
            <p className="text-xl font-bold">{status.label}</p>
          </div>
          <div className={cn('flex size-10 items-center justify-center rounded-full', status.iconBg)}>
            <StatusIcon className={cn('size-5', status.iconColor)} />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{sonarrSeason?.monitored ? 'Monitored' : 'Not monitored'}</p>
      </div>
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface SeasonStatsProps {
  tmdbId: number;
  seasonNumber: number;
}

function SeasonStats({ tmdbId, seasonNumber }: SeasonStatsProps) {
  const seasonQuery = useQuery(showSeasonQueryOptions(tmdbId, seasonNumber));
  const libraryQuery = useQuery(showLibraryInfoQueryOptions(tmdbId));

  return (
    <Queries
      results={[seasonQuery, libraryQuery] as const}
      callbacks={{
        loading: SeasonStatsLoading,
        error: () => <SeasonStatsError />,
        success: ([season, library]) => (
          <SeasonStatsSuccess season={season} library={library} seasonNumber={seasonNumber} />
        ),
      }}
    />
  );
}

export type { SeasonStatsProps };
export { SeasonStats };
