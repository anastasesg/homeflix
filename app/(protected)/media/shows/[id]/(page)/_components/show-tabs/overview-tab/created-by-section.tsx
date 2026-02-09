'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { PenTool } from 'lucide-react';

import { showCreatedByQueryOptions } from '@/options/queries/shows/detail';

import { SectionHeader } from '@/components/media/sections/section-header';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

// ============================================================================
// Creator Card
// ============================================================================

interface CreatorCardProps {
  name: string;
  profileUrl?: string;
}

function CreatorCard({ name, profileUrl }: CreatorCardProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group flex items-center gap-3 rounded-lg border border-border/60 p-2.5 transition-all duration-200 hover:border-border hover:bg-accent/50 hover:shadow-sm hover:shadow-black/5 dark:hover:shadow-black/20">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border/60">
            {profileUrl ? (
              <Image src={profileUrl} alt={name} fill className="object-cover" sizes="40px" />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-xs font-medium text-muted-foreground/60">{getInitials(name)}</span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
              {name}
            </p>
            <p className="truncate text-xs text-muted-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400/80">
              Creator
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span className="font-medium">{name}</span>
        <span className="opacity-60"> — Creator</span>
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================================================
// Loading
// ============================================================================

function CreatedBySectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
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
// Main
// ============================================================================

interface CreatedBySectionProps {
  tmdbId: number;
}

function CreatedBySection({ tmdbId }: CreatedBySectionProps) {
  const query = useQuery(showCreatedByQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: CreatedBySectionLoading,
        error: () => null,
        success: (creators) => {
          if (creators.length === 0) return null;

          return (
            <section>
              <SectionHeader icon={PenTool} title="Created By" />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {creators.map((creator) => (
                  <CreatorCard key={creator.name} name={creator.name} profileUrl={creator.profileUrl} />
                ))}
              </div>
            </section>
          );
        },
      }}
    />
  );
}

export type { CreatedBySectionProps };
export { CreatedBySection };
