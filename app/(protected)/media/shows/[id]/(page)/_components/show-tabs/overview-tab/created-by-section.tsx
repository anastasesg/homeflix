import Image from 'next/image';

import { PenTool } from 'lucide-react';

import { type ShowBasic } from '@/api/entities';

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
// Main
// ============================================================================

interface CreatedBySectionProps {
  creators: ShowBasic['createdBy'];
}

function CreatedBySection({ creators }: CreatedBySectionProps) {
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
}

export type { CreatedBySectionProps };
export { CreatedBySection };
