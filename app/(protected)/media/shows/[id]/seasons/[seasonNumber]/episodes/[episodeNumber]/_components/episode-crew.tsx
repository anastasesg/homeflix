'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Clapperboard, PenTool } from 'lucide-react';

import type { EpisodeBasic } from '@/api/entities';
import { showEpisodeQueryOptions } from '@/options/queries/shows/detail';

import { SectionHeader } from '@/components/media/sections/section-header';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// ============================================================================
// Utilities
// ============================================================================

const DIRECTOR_JOBS = new Set(['director']);
const WRITER_JOBS = new Set(['writer', 'teleplay', 'story', 'screenplay', 'co-writer']);

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function pickCrew(crew: EpisodeBasic['crew'], jobs: Set<string>): EpisodeBasic['crew'] {
  const seen = new Set<string>();
  const result: EpisodeBasic['crew'] = [];
  for (const person of crew) {
    if (!jobs.has(person.job.toLowerCase())) continue;
    if (seen.has(person.name)) continue;
    seen.add(person.name);
    result.push(person);
  }
  return result;
}

// ============================================================================
// Sub-components
// ============================================================================

interface CrewCardProps {
  person: EpisodeBasic['crew'][number];
  role: string;
}

function CrewCard({ person, role }: CrewCardProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group flex items-center gap-3 rounded-lg border border-border/60 bg-muted/10 p-3 transition-all duration-200 hover:border-border hover:bg-accent/50">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border/60">
            {person.profileUrl ? (
              <Image src={person.profileUrl} alt={person.name} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-xs font-medium text-muted-foreground/60">{getInitials(person.name)}</span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{person.name}</p>
            <p className="truncate text-xs font-medium text-amber-600 dark:text-amber-400/90">{role}</p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-52">
        <span className="font-medium">{person.name}</span>
        <span className="opacity-60"> — {role}</span>
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================================================
// Loading
// ============================================================================

function EpisodeCrewLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
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

interface EpisodeCrewContentProps {
  crew: EpisodeBasic['crew'];
}

function EpisodeCrewContent({ crew }: EpisodeCrewContentProps) {
  const directors = pickCrew(crew, DIRECTOR_JOBS);
  const writers = pickCrew(crew, WRITER_JOBS);

  if (directors.length === 0 && writers.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={Clapperboard} title="Crew" />
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
        {directors.map((person) => (
          <CrewCard key={`dir-${person.name}`} person={person} role="Director" />
        ))}
        {writers.map((person) => (
          <CrewCard key={`wri-${person.name}`} person={person} role={person.job} />
        ))}
      </div>
      {writers.length > 0 && directors.length === 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
          <PenTool className="size-3" />
          <span>Written only — directing credits not listed on TMDB.</span>
        </div>
      )}
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface EpisodeCrewProps {
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeCrew({ tmdbId, seasonNumber, episodeNumber }: EpisodeCrewProps) {
  const query = useQuery(showEpisodeQueryOptions(tmdbId, seasonNumber, episodeNumber));

  return (
    <Query
      result={query}
      callbacks={{
        loading: EpisodeCrewLoading,
        error: () => null,
        success: (episode) => <EpisodeCrewContent crew={episode.crew} />,
      }}
    />
  );
}

export type { EpisodeCrewProps };
export { EpisodeCrew };
