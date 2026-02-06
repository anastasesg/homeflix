'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { Calendar, Layers, Tv } from 'lucide-react';

import { type ShowBasic, type ShowLibraryInfo } from '@/api/entities';
import { cn } from '@/lib/utils';
import { sonarrLookupQueryOptions, tmdbTVShowQueryOptions } from '@/options/queries/tmdb';

import { Queries } from '@/components/query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { SectionHeader } from './section-header';

// ============================================================================
// Season Card
// ============================================================================

interface SeasonCardProps {
  tmdbId: number;
  season: ShowBasic['seasons'][number];
  progress?: { fileCount: number; episodeCount: number };
}

function SeasonCard({ tmdbId, season, progress }: SeasonCardProps) {
  return (
    <Link href={`/media/shows/${tmdbId}/seasons/${season.seasonNumber}`} className="group block pb-0.5">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border/60 shadow-sm transition-all duration-300 group-hover:border-border group-hover:shadow-md group-hover:shadow-black/10 dark:group-hover:shadow-black/30">
        {season.posterUrl ? (
          <Image
            src={season.posterUrl}
            alt={season.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Tv className="size-8 text-muted-foreground/40" />
          </div>
        )}

        {/* Episode count badge */}
        <div className="absolute bottom-2 right-2">
          <Badge
            variant="secondary"
            className="border border-border/40 bg-background/80 text-[10px] font-semibold backdrop-blur-sm"
          >
            {season.episodeCount} ep{season.episodeCount !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Download progress bar */}
        {progress && progress.episodeCount > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/50 backdrop-blur-sm">
            <div
              className={cn('h-full', progress.fileCount >= progress.episodeCount ? 'bg-emerald-500' : 'bg-blue-500')}
              style={{ width: `${Math.round((progress.fileCount / progress.episodeCount) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Text below image */}
      <div className="mt-2 px-0.5">
        <p className="truncate text-[13px] font-semibold leading-tight text-foreground/90 transition-colors group-hover:text-foreground">
          Season {season.seasonNumber}
        </p>
        {season.airDate && (
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs leading-tight text-muted-foreground">
            <Calendar className="size-3 shrink-0" />
            {season.airDate.substring(0, 4)}
          </p>
        )}
      </div>
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <div className="mt-2 space-y-1 px-0.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
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
  show: ShowBasic;
  libraryInfo?: ShowLibraryInfo;
}

function SeasonsSectionContent({ show, libraryInfo }: SeasonsSectionContentProps) {
  if (show.seasons.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={Layers} title="Seasons" count={show.seasons.length} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {show.seasons.map((season) => {
          const libSeason = libraryInfo?.seasons.find((s) => s.seasonNumber === season.seasonNumber);
          const progress = libSeason
            ? { fileCount: libSeason.episodeFileCount, episodeCount: libSeason.episodeCount }
            : undefined;
          return <SeasonCard key={season.id} tmdbId={show.tmdbId} season={season} progress={progress} />;
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
}

function SeasonsSection({ tmdbId }: SeasonsSectionProps) {
  const showQuery = useQuery(tmdbTVShowQueryOptions(tmdbId));
  const libraryQuery = useQuery({ ...sonarrLookupQueryOptions(tmdbId), retry: false });

  return (
    <Queries
      results={[showQuery, libraryQuery] as const}
      callbacks={{
        loading: SeasonsSectionLoading,
        error: () => null,
        success: ([show, library]) => <SeasonsSectionContent show={show} libraryInfo={library} />,
      }}
    />
  );
}

export type { SeasonsSectionProps };
export { SeasonsSection };
