'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, Film, HardDrive, Plus, TrendingUp } from 'lucide-react';

import { type LibraryInfo, type MovieBasic } from '@/api/entities';
import { cn } from '@/lib/utils';
import { movieDetailQueryOptions } from '@/options/queries/movies/detail';
import { movieLibraryInfoQueryOptions } from '@/options/queries/movies/library';
import { formatCurrency, formatRuntime } from '@/utilities';

import { Queries } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Error
// ============================================================================

interface MovieStatsErrorProps {
  error: unknown;
}

function MovieStatsError({ error }: MovieStatsErrorProps) {
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
              <Film className="size-5 text-destructive/30" />
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

function MovieStatsLoading() {
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

interface MovieStatsSuccessProps {
  libraryInfo: LibraryInfo;
  movie: MovieBasic;
}

function MovieStatsSuccess({ libraryInfo, movie }: MovieStatsSuccessProps) {
  const statusConfig = {
    downloaded: { label: 'Downloaded', icon: CheckCircle2, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
    downloading: { label: 'Downloading', icon: HardDrive, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
    wanted: { label: 'Wanted', icon: Clock, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
    missing: { label: 'Missing', icon: Film, iconBg: 'bg-red-500/10', iconColor: 'text-red-400' },
    not_in_library: { label: 'Not in Library', icon: Plus, iconBg: 'bg-muted', iconColor: 'text-muted-foreground' },
  }[libraryInfo.status];

  const StatusIcon = statusConfig.icon;

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
        {libraryInfo.quality && <p className="mt-3 text-xs text-muted-foreground">Quality: {libraryInfo.quality}</p>}
      </div>

      {/* Storage */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Storage</p>
            <p className="text-2xl font-bold tabular-nums">{libraryInfo.size || '—'}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10">
            <HardDrive className="size-5 text-amber-400" />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{libraryInfo.hasFile ? '1 file' : 'No files'}</p>
      </div>

      {/* Box Office / Runtime */}
      {movie.revenue && movie.revenue > 0 ? (
        <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Box Office</p>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(movie.revenue)}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
              <TrendingUp className="size-5 text-emerald-400" />
            </div>
          </div>
          {movie.budget && movie.budget > 0 && (
            <p className={cn('mt-3 text-xs', movie.revenue > movie.budget ? 'text-emerald-400' : 'text-red-400')}>
              {movie.revenue > movie.budget ? '+' : ''}
              {formatCurrency(movie.revenue - movie.budget)} profit
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Runtime</p>
              <p className="text-2xl font-bold tabular-nums">{formatRuntime(movie.runtime)}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
              <Clock className="size-5 text-blue-400" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{movie.runtime} minutes</p>
        </div>
      )}

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
          {libraryInfo.monitored ? 'Auto-searching for upgrades' : 'Not searching'}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface MovieStatsProps {
  tmdbId: number;
}

function MovieStats({ tmdbId }: MovieStatsProps) {
  const movieQuery = useQuery(movieDetailQueryOptions(tmdbId));
  const libraryQuery = useQuery(movieLibraryInfoQueryOptions(tmdbId));

  return (
    <Queries
      results={[movieQuery, libraryQuery]}
      callbacks={{
        loading: MovieStatsLoading,
        error: (error) => <MovieStatsError error={error} />,
        success: ([movie, library]) => <MovieStatsSuccess movie={movie} libraryInfo={library} />,
      }}
    />
  );
}

export type { MovieStatsProps };
export { MovieStats };
