'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';

import { type MediaCredits } from '@/api/entities';
import { movieCreditsQueryOptions } from '@/options/queries/movies/detail';

import { Query } from '@/components/query';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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

// ============================================================================
// Cast Card
// ============================================================================

interface CastCardProps {
  name: string;
  character: string;
  profileUrl?: string;
  order: number;
}

function CastCard({ name, character, profileUrl, order }: CastCardProps) {
  const isTopBilled = order < 3;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group cursor-default pb-0.5">
          {/* Portrait image */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border/60 shadow-sm transition-all duration-300 group-hover:border-border group-hover:shadow-md group-hover:shadow-black/10 dark:group-hover:shadow-black/30">
            {profileUrl ? (
              <Image
                src={profileUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="150px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-lg font-medium text-muted-foreground/60">{getInitials(name)}</span>
              </div>
            )}

            {/* Top-billed indicator — subtle corner accent */}
            {isTopBilled && (
              <div className="absolute top-0 left-0 h-6 w-6">
                <div className="absolute top-0 left-0 size-full bg-gradient-to-br from-amber-500/30 to-transparent" />
              </div>
            )}
          </div>

          {/* Text below image */}
          <div className="mt-2 px-0.5">
            <p className="truncate text-[13px] font-semibold leading-tight text-foreground/90 transition-colors group-hover:text-foreground">
              {name}
            </p>
            <p className="mt-0.5 truncate text-xs leading-tight text-muted-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400/80">
              {character}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-52">
        <span className="font-medium">{name}</span>
        {character && <span className="opacity-60"> as {character}</span>}
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================================================
// Loading
// ============================================================================

function CastSectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[130px] shrink-0 sm:w-[150px]">
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

function CastSectionContent({ credits }: { credits: MediaCredits }) {
  if (credits.cast.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={Sparkles} title="Cast" count={credits.cast.length} />
      <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
        <CarouselContent className="-ml-2 py-1">
          {credits.cast.map((person, index) => (
            <CarouselItem key={`${person.name}-${index}`} className="basis-[130px] pl-2 sm:basis-[150px]">
              <CastCard
                name={person.name}
                character={person.character}
                profileUrl={person.profileUrl}
                order={person.order}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
        <CarouselNext className="right-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
      </Carousel>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface CastSectionProps {
  tmdbId: number;
}

function CastSection({ tmdbId }: CastSectionProps) {
  const query = useQuery(movieCreditsQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: CastSectionLoading,
        error: () => null,
        success: (credits) => <CastSectionContent credits={credits} />,
      }}
    />
  );
}

export type { CastSectionProps };
export { CastSection };
