'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Film } from 'lucide-react';

import type { SeasonDetail } from '@/api/entities';
import { showSeasonQueryOptions } from '@/options/queries/shows/detail';

import { Query } from '@/components/query';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { SectionHeader } from './section-header';

// ============================================================================
// Utilities
// ============================================================================

interface AggregatedCrewMember {
  name: string;
  job: string;
  department: string;
  profileUrl?: string;
  episodeCount: number;
}

function aggregateCrew(season: SeasonDetail): Map<string, AggregatedCrewMember[]> {
  const memberMap = new Map<string, AggregatedCrewMember>();

  for (const episode of season.episodes) {
    for (const crew of episode.crew) {
      const key = `${crew.name}::${crew.job}`;
      const existing = memberMap.get(key);
      if (existing) {
        existing.episodeCount += 1;
        if (crew.profileUrl && !existing.profileUrl) existing.profileUrl = crew.profileUrl;
      } else {
        memberMap.set(key, {
          name: crew.name,
          job: crew.job,
          department: crew.department || 'Other',
          profileUrl: crew.profileUrl,
          episodeCount: 1,
        });
      }
    }
  }

  // Group by department with priority ordering
  const DEPARTMENT_PRIORITY = ['Directing', 'Writing', 'Production'];
  const groups = new Map<string, AggregatedCrewMember[]>();

  for (const member of memberMap.values()) {
    const dept = member.department;
    const existing = groups.get(dept);
    if (existing) {
      existing.push(member);
    } else {
      groups.set(dept, [member]);
    }
  }

  // Re-order: priority departments first
  const sorted = new Map<string, AggregatedCrewMember[]>();
  for (const dept of DEPARTMENT_PRIORITY) {
    const members = groups.get(dept);
    if (members) {
      sorted.set(dept, members);
      groups.delete(dept);
    }
  }
  for (const [dept, members] of groups) {
    sorted.set(dept, members);
  }

  return sorted;
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

// ============================================================================
// Crew Card
// ============================================================================

interface CrewCardProps {
  person: AggregatedCrewMember;
}

function CrewCard({ person }: CrewCardProps) {
  const jobLabel = person.episodeCount > 1 ? `${person.job} \u00B7 ${person.episodeCount} eps` : person.job;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group flex items-center gap-3 rounded-lg border border-border/60 p-2.5 transition-all duration-200 hover:border-border hover:bg-accent/50 hover:shadow-sm hover:shadow-black/5 dark:hover:shadow-black/20">
          {/* Avatar */}
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border/60">
            {person.profileUrl ? (
              <Image src={person.profileUrl} alt={person.name} fill className="object-cover" sizes="40px" />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-xs font-medium text-muted-foreground/60">{getInitials(person.name)}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
              {person.name}
            </p>
            <p className="truncate text-xs text-muted-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400/80">
              {jobLabel}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-52">
        <span className="font-medium">{person.name}</span>
        <span className="opacity-60"> — {person.job}</span>
        {person.episodeCount > 1 && <span className="opacity-60"> ({person.episodeCount} episodes)</span>}
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================================================
// Content
// ============================================================================

const COLLAPSED_DEPARTMENT_LIMIT = 2;

interface CrewSectionContentProps {
  season: SeasonDetail;
}

function CrewSectionContent({ season }: CrewSectionContentProps) {
  const departments = useMemo(() => aggregateCrew(season), [season]);
  const [expanded, setExpanded] = useState(false);

  const totalCrew = useMemo(() => {
    let count = 0;
    for (const members of departments.values()) {
      count += members.length;
    }
    return count;
  }, [departments]);

  if (totalCrew === 0) return null;

  const allEntries = [...departments.entries()];
  const needsExpansion = allEntries.length > COLLAPSED_DEPARTMENT_LIMIT;
  const visibleEntries = expanded ? allEntries : allEntries.slice(0, COLLAPSED_DEPARTMENT_LIMIT);

  const hiddenCount =
    needsExpansion && !expanded
      ? allEntries.slice(COLLAPSED_DEPARTMENT_LIMIT).reduce((sum, [, members]) => sum + members.length, 0)
      : 0;

  return (
    <section>
      <SectionHeader icon={Film} title="Crew" count={totalCrew} />
      <div className="space-y-5">
        {visibleEntries.map(([department, members]) => (
          <div key={department}>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {department}
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {members.map((person) => (
                <CrewCard key={`${person.name}-${person.job}`} person={person} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {needsExpansion && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/60 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-accent/50 hover:text-foreground"
        >
          {expanded ? (
            <>
              Show less
              <ChevronDown className="size-3.5 rotate-180 transition-transform" />
            </>
          ) : (
            <>
              Show {hiddenCount} more across {allEntries.length - COLLAPSED_DEPARTMENT_LIMIT} departments
              <ChevronDown className="size-3.5 transition-transform" />
            </>
          )}
        </button>
      )}
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface CrewSectionProps {
  tmdbId: number;
  seasonNumber: number;
}

function CrewSection({ tmdbId, seasonNumber }: CrewSectionProps) {
  const query = useQuery(showSeasonQueryOptions(tmdbId, seasonNumber));

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => null,
        error: () => null,
        success: (season) => <CrewSectionContent season={season} />,
      }}
    />
  );
}

export type { CrewSectionProps };
export { CrewSection };
