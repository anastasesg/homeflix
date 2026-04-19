'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Layers, Tv } from 'lucide-react';
import type { Route } from 'next';

import type { ShowDetail, ShowLibraryInfo } from '@/api/entities';
import { cn } from '@/lib/utils';
import { showLibraryInfoQueryOptions } from '@/options/queries/shows/library';

import { SectionHeader } from '@/components/media/sections/section-header';
import type { DataQueryOptions } from '@/components/media/sections/types';
import { Queries } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Season Row
// ============================================================================

interface SeasonRowProps {
  tmdbId: number;
  season: ShowDetail['seasons'][number];
  progress?: { fileCount: number; episodeCount: number };
}

function SeasonRow({ tmdbId, season, progress }: SeasonRowProps) {
  const progressPercent =
    progress && progress.episodeCount > 0 ? Math.round((progress.fileCount / progress.episodeCount) * 100) : undefined;
  const isComplete = progressPercent === 100;
  const airYear = season.airDate ? season.airDate.substring(0, 4) : undefined;

  return (
    <Link
      href={`/media/shows/${tmdbId}/seasons/${season.seasonNumber}` as Route}
      className="group flex items-start gap-3 rounded-lg border border-border/40 bg-muted/10 p-2.5 transition-all duration-200 hover:border-border hover:bg-accent/40"
    >
      {/* Thumbnail */}
      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
        {season.posterUrl ? (
          <Image src={season.posterUrl} alt={season.name} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Tv className="size-5 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Text + progress */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground/90 transition-colors group-hover:text-foreground">
            {season.name}
          </p>
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
            {season.episodeCount} ep{season.episodeCount !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {airYear && <span>{airYear}</span>}
          {progress && progressPercent !== undefined && (
            <>
              {airYear && <span className="text-muted-foreground/40">·</span>}
              <span className={cn('tabular-nums', isComplete && 'text-emerald-500')}>
                {isComplete ? 'Complete' : `${progress.fileCount}/${progress.episodeCount}`}
              </span>
            </>
          )}
        </div>

        {season.overview && (
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground/80">{season.overview}</p>
        )}

        {progress && progressPercent !== undefined && (
          <div className="mt-auto h-1 overflow-hidden rounded-full bg-muted/60">
            <div
              className={cn('h-full transition-all', isComplete ? 'bg-emerald-500' : 'bg-blue-500')}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
    </Link>
  );
}

// ============================================================================
// Loading
// ============================================================================

function SeasonsSectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border/40 p-2.5">
            <Skeleton className="h-24 w-16 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-1 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface SeasonsSectionContentProps {
  seasons: ShowDetail['seasons'];
  tmdbId: number;
  libraryInfo?: ShowLibraryInfo;
}

function SeasonsSectionContent({ seasons, tmdbId, libraryInfo }: SeasonsSectionContentProps) {
  if (seasons.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={Layers} title="Seasons" count={seasons.length} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {seasons.map((season) => {
          const libSeason = libraryInfo?.seasons.find((s) => s.seasonNumber === season.seasonNumber);
          const progress = libSeason
            ? { fileCount: libSeason.episodeFileCount, episodeCount: libSeason.episodeCount }
            : undefined;
          return <SeasonRow key={season.id} tmdbId={tmdbId} season={season} progress={progress} />;
        })}
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface SeasonsSectionProps {
  tmdbId: number;
  queryOptions: DataQueryOptions<ShowDetail['seasons']>;
}

function SeasonsSection({ tmdbId, queryOptions }: SeasonsSectionProps) {
  const seasonsQuery = useQuery(queryOptions);
  const libraryQuery = useQuery({ ...showLibraryInfoQueryOptions(tmdbId), retry: false });

  return (
    <Queries
      results={[seasonsQuery, libraryQuery] as const}
      callbacks={{
        loading: SeasonsSectionLoading,
        error: () => null,
        success: ([seasons, library]) => (
          <SeasonsSectionContent seasons={seasons} tmdbId={tmdbId} libraryInfo={library} />
        ),
      }}
    />
  );
}

export type { SeasonsSectionProps };
export { SeasonsSection };
