'use client';

import { useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { ClapperboardIcon, PenTool } from 'lucide-react';

import type { EpisodeBasic, SeasonDetail } from '@/api/entities';
import { showSeasonQueryOptions } from '@/options/queries/shows/detail';

import { SectionHeader } from '@/components/media/sections/section-header';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// ============================================================================
// Types & Utilities
// ============================================================================

const DIRECTOR_JOBS = new Set(['director']);
const WRITER_JOBS = new Set(['writer', 'teleplay', 'story', 'screenplay', 'co-writer']);

interface CreditGroup {
  name: string;
  profileUrl?: string;
  episodes: EpisodeBasic[];
}

function groupByPerson(episodes: EpisodeBasic[], jobSet: Set<string>): CreditGroup[] {
  const byName = new Map<string, CreditGroup>();

  for (const episode of episodes) {
    for (const credit of episode.crew) {
      if (!jobSet.has(credit.job.toLowerCase())) continue;
      const existing = byName.get(credit.name);
      if (existing) {
        if (!existing.episodes.some((e) => e.id === episode.id)) existing.episodes.push(episode);
        if (credit.profileUrl && !existing.profileUrl) existing.profileUrl = credit.profileUrl;
      } else {
        byName.set(credit.name, {
          name: credit.name,
          profileUrl: credit.profileUrl,
          episodes: [episode],
        });
      }
    }
  }

  return [...byName.values()].sort((a, b) => b.episodes.length - a.episodes.length || a.name.localeCompare(b.name));
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatEpisodeNumber(num: number): string {
  return String(num).padStart(2, '0');
}

// ============================================================================
// Sub-components
// ============================================================================

interface SubHeadingProps {
  icon: React.ElementType;
  label: string;
  count: number;
}

function SubHeading({ icon: Icon, label, count }: SubHeadingProps) {
  return (
    <h4 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
      <Icon className="size-3.5" />
      {label}
      <span className="text-muted-foreground/40">{count}</span>
    </h4>
  );
}

interface EpisodeChipProps {
  episode: EpisodeBasic;
  tmdbId: number;
  seasonNumber: number;
}

function EpisodeChip({ episode, tmdbId, seasonNumber }: EpisodeChipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={`/media/shows/${tmdbId}/seasons/${seasonNumber}/episodes/${episode.episodeNumber}`}
          className="inline-flex items-center rounded-md border border-border/40 bg-muted/20 px-2 py-0.5 text-[11px] font-mono font-medium tabular-nums text-muted-foreground transition-colors hover:border-border hover:bg-accent/60 hover:text-foreground"
        >
          E{formatEpisodeNumber(episode.episodeNumber)}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <span className="font-medium">{episode.name}</span>
      </TooltipContent>
    </Tooltip>
  );
}

interface CreditCardProps {
  group: CreditGroup;
  tmdbId: number;
  seasonNumber: number;
}

function CreditCard({ group, tmdbId, seasonNumber }: CreditCardProps) {
  const sortedEpisodes = [...group.episodes].sort((a, b) => a.episodeNumber - b.episodeNumber);

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/10 p-3">
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border/60">
        {group.profileUrl ? (
          <Image src={group.profileUrl} alt={group.name} fill className="object-cover" sizes="40px" />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-xs font-medium text-muted-foreground/60">{getInitials(group.name)}</span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground/90">{group.name}</p>
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
            {group.episodes.length} ep{group.episodes.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {sortedEpisodes.map((episode) => (
            <EpisodeChip key={episode.id} episode={episode} tmdbId={tmdbId} seasonNumber={seasonNumber} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Loading
// ============================================================================

function CreditsByEpisodeSectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-5">
        {Array.from({ length: 2 }).map((_, g) => (
          <div key={g}>
            <Skeleton className="mb-3 h-3 w-24" />
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-10 rounded-md" />
                      <Skeleton className="h-5 w-10 rounded-md" />
                      <Skeleton className="h-5 w-10 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
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

interface CreditsByEpisodeContentProps {
  season: SeasonDetail;
  tmdbId: number;
  seasonNumber: number;
}

function CreditsByEpisodeContent({ season, tmdbId, seasonNumber }: CreditsByEpisodeContentProps) {
  const directors = useMemo(() => groupByPerson(season.episodes, DIRECTOR_JOBS), [season.episodes]);
  const writers = useMemo(() => groupByPerson(season.episodes, WRITER_JOBS), [season.episodes]);

  if (directors.length === 0 && writers.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={ClapperboardIcon} title="Credits by Episode" />
      <div className="space-y-6">
        {directors.length > 0 && (
          <div>
            <SubHeading icon={ClapperboardIcon} label="Directors" count={directors.length} />
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {directors.map((group) => (
                <CreditCard key={group.name} group={group} tmdbId={tmdbId} seasonNumber={seasonNumber} />
              ))}
            </div>
          </div>
        )}

        {writers.length > 0 && (
          <div>
            <SubHeading icon={PenTool} label="Writers" count={writers.length} />
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {writers.map((group) => (
                <CreditCard key={group.name} group={group} tmdbId={tmdbId} seasonNumber={seasonNumber} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface CreditsByEpisodeSectionProps {
  tmdbId: number;
  seasonNumber: number;
}

function CreditsByEpisodeSection({ tmdbId, seasonNumber }: CreditsByEpisodeSectionProps) {
  const query = useQuery(showSeasonQueryOptions(tmdbId, seasonNumber));

  return (
    <Query
      result={query}
      callbacks={{
        loading: CreditsByEpisodeSectionLoading,
        error: () => null,
        success: (season) => <CreditsByEpisodeContent season={season} tmdbId={tmdbId} seasonNumber={seasonNumber} />,
      }}
    />
  );
}

export type { CreditsByEpisodeSectionProps };
export { CreditsByEpisodeSection };
