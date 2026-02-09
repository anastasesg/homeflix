'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Film } from 'lucide-react';

import { type MediaCredits } from '@/api/entities';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { SectionHeader } from './section-header';
import type { DataQueryOptions } from './types';

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

type CrewMember = MediaCredits['crew'][number];

/**
 * Groups crew by department.
 * When priority is provided, matching departments sort first in the specified order.
 * Otherwise, preserves original insertion order.
 */
function groupByDepartment(crew: CrewMember[], priority?: string[]): Map<string, CrewMember[]> {
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

  // If no priority specified, return original insertion order
  if (!priority || priority.length === 0) {
    return groups;
  }

  // Re-order: priority departments first, then the rest in original order
  const sorted = new Map<string, CrewMember[]>();
  for (const dept of priority) {
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

// ============================================================================
// Sub-Components
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
const COLLAPSED_MEMBER_LIMIT = 4;

// ─── Department group with its own member expansion ──────────────────────────

interface DepartmentGroupProps {
  department: string;
  members: CrewMember[];
}

function DepartmentGroup({ department, members }: DepartmentGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const needsExpansion = members.length > COLLAPSED_MEMBER_LIMIT;
  const visibleMembers = expanded ? members : members.slice(0, COLLAPSED_MEMBER_LIMIT);
  const hiddenCount = members.length - COLLAPSED_MEMBER_LIMIT;

  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {department}
        <span className="ml-1.5 text-muted-foreground/40">{members.length}</span>
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {visibleMembers.map((person, index) => (
          <CrewCard
            key={`${person.name}-${person.job}-${index}`}
            name={person.name}
            job={person.job}
            profileUrl={person.profileUrl}
          />
        ))}
      </div>
      {needsExpansion && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-[11px] font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
        >
          {expanded ? (
            <>
              Show less
              <ChevronDown className="size-3 rotate-180 transition-transform" />
            </>
          ) : (
            <>
              +{hiddenCount} more
              <ChevronDown className="size-3 transition-transform" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────

interface CrewSectionContentProps {
  credits: MediaCredits;
  departmentPriority?: string[];
}

function CrewSectionContent({ credits, departmentPriority }: CrewSectionContentProps) {
  const departments = useMemo(
    () => groupByDepartment(credits.crew, departmentPriority),
    [credits.crew, departmentPriority]
  );
  const [deptExpanded, setDeptExpanded] = useState(false);

  if (credits.crew.length === 0) return null;

  const allEntries = [...departments.entries()];
  const needsDeptExpansion = allEntries.length > COLLAPSED_DEPARTMENT_LIMIT;
  const visibleEntries = deptExpanded ? allEntries : allEntries.slice(0, COLLAPSED_DEPARTMENT_LIMIT);

  const hiddenCount =
    needsDeptExpansion && !deptExpanded
      ? allEntries.slice(COLLAPSED_DEPARTMENT_LIMIT).reduce((sum, [, members]) => sum + members.length, 0)
      : 0;

  return (
    <section>
      <SectionHeader icon={Film} title="Crew" count={credits.crew.length} />
      <div className="space-y-5">
        {visibleEntries.map(([department, members]) => (
          <DepartmentGroup key={department} department={department} members={members} />
        ))}
      </div>

      {needsDeptExpansion && (
        <button
          onClick={() => setDeptExpanded((prev) => !prev)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/60 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-accent/50 hover:text-foreground"
        >
          {deptExpanded ? (
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
  queryOptions: DataQueryOptions<MediaCredits>;
  departmentPriority?: string[];
}

function CrewSection({ queryOptions, departmentPriority }: CrewSectionProps) {
  const query = useQuery(queryOptions);

  return (
    <Query
      result={query}
      callbacks={{
        loading: CrewSectionLoading,
        error: () => null,
        success: (credits) => <CrewSectionContent credits={credits} departmentPriority={departmentPriority} />,
      }}
    />
  );
}

export type { CrewSectionProps };
export { CrewSection };
