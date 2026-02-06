'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Film } from 'lucide-react';

import { type MovieCredits } from '@/api/entities';
import { tmdbCreditsQueryOptions } from '@/options/queries/tmdb';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { SectionHeader } from './section-header';

// ============================================================================
// Utilities
// ============================================================================

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

type CrewMember = MovieCredits['crew'][number];

/** Groups crew by department, preserving original order within each group. */
function groupByDepartment(crew: CrewMember[]): Map<string, CrewMember[]> {
  const groups = new Map<string, CrewMember[]>();
  for (const person of crew) {
    const dept = person.department || 'Other';
    const existing = groups.get(dept);
    if (existing) {
      existing.push(person);
    } else {
      groups.set(dept, [person]);
    }
  }
  return groups;
}

// ============================================================================
// Crew Card
// ============================================================================

interface CrewCardProps {
  name: string;
  job: string;
  profileUrl?: string;
}

function CrewCard({ name, job, profileUrl }: CrewCardProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group flex items-center gap-3 rounded-lg border border-border/60 p-2.5 transition-all duration-200 hover:border-border hover:bg-accent/50 hover:shadow-sm hover:shadow-black/5 dark:hover:shadow-black/20">
          {/* Avatar */}
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border/60">
            {profileUrl ? (
              <Image src={profileUrl} alt={name} fill className="object-cover" sizes="40px" />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-xs font-medium text-muted-foreground/60">{getInitials(name)}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
              {name}
            </p>
            <p className="truncate text-xs text-muted-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400/80">
              {job}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-52">
        <span className="font-medium">{name}</span>
        <span className="opacity-60"> — {job}</span>
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================================================
// Loading
// ============================================================================

function CrewSectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-5">
        {Array.from({ length: 2 }).map((_, g) => (
          <div key={g}>
            <Skeleton className="mb-2.5 h-3 w-20" />
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
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

const COLLAPSED_DEPARTMENT_LIMIT = 2;

function CrewSectionContent({ credits }: { credits: MovieCredits }) {
  const departments = useMemo(() => groupByDepartment(credits.crew), [credits.crew]);
  const [expanded, setExpanded] = useState(false);

  if (credits.crew.length === 0) return null;

  const allEntries = [...departments.entries()];
  const needsExpansion = allEntries.length > COLLAPSED_DEPARTMENT_LIMIT;
  const visibleEntries = expanded ? allEntries : allEntries.slice(0, COLLAPSED_DEPARTMENT_LIMIT);

  const hiddenCount =
    needsExpansion && !expanded
      ? allEntries.slice(COLLAPSED_DEPARTMENT_LIMIT).reduce((sum, [, members]) => sum + members.length, 0)
      : 0;

  return (
    <section>
      <SectionHeader icon={Film} title="Crew" count={credits.crew.length} />
      <div className="space-y-5">
        {visibleEntries.map(([department, members]) => (
          <div key={department}>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {department}
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {members.map((person, index) => (
                <CrewCard
                  key={`${person.name}-${person.job}-${index}`}
                  name={person.name}
                  job={person.job}
                  profileUrl={person.profileUrl}
                />
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
}

function CrewSection({ tmdbId }: CrewSectionProps) {
  const query = useQuery(tmdbCreditsQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: CrewSectionLoading,
        error: () => null,
        success: (credits) => <CrewSectionContent credits={credits} />,
      }}
    />
  );
}

export type { CrewSectionProps };
export { CrewSection };
