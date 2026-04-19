'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Sparkles, Users } from 'lucide-react';

import type { EpisodeCredits } from '@/api/entities';
import { showEpisodeCreditsQueryOptions } from '@/options/queries/shows/detail';

import { SectionHeader } from '@/components/media/sections/section-header';
import { Query } from '@/components/query';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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
// Person Card
// ============================================================================

interface PersonCardProps {
  name: string;
  character: string;
  profileUrl?: string;
  order: number;
}

function PersonCard({ name, character, profileUrl, order }: PersonCardProps) {
  const isTopBilled = order < 3;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group cursor-default pb-0.5">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border/60 shadow-sm transition-all duration-300 group-hover:border-border group-hover:shadow-md group-hover:shadow-black/10 dark:group-hover:shadow-black/30">
            {profileUrl ? (
              <Image
                src={profileUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="130px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-lg font-medium text-muted-foreground/60">{getInitials(name)}</span>
              </div>
            )}
            {isTopBilled && (
              <div className="absolute left-0 top-0 h-6 w-6">
                <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-amber-500/30 to-transparent" />
              </div>
            )}
          </div>
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

function EpisodeCastLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[130px] shrink-0">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="mt-2 h-3 w-3/4" />
            <Skeleton className="mt-1 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Sub-sections
// ============================================================================

interface PeopleCarouselProps {
  title: string;
  icon: typeof Sparkles;
  people: EpisodeCredits['cast'];
}

function PeopleCarousel({ title, icon, people }: PeopleCarouselProps) {
  if (people.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={icon} title={title} count={people.length} />
      <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
        <CarouselContent className="-ml-2 py-1">
          {people.map((person, index) => (
            <CarouselItem key={`${person.id}-${index}`} className="basis-[110px] pl-2 sm:basis-[130px]">
              <PersonCard
                name={person.name}
                character={person.character}
                profileUrl={person.profileUrl}
                order={person.order}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {people.length > 4 && (
          <>
            <CarouselPrevious className="left-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
            <CarouselNext className="right-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
          </>
        )}
      </Carousel>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface EpisodeCastContentProps {
  credits: EpisodeCredits;
}

function EpisodeCastContent({ credits }: EpisodeCastContentProps) {
  if (credits.cast.length === 0 && credits.guestStars.length === 0) return null;

  return (
    <div className="flex flex-col space-y-8">
      <PeopleCarousel title="Cast" icon={Sparkles} people={credits.cast} />
      <PeopleCarousel title="Guest Stars" icon={Users} people={credits.guestStars} />
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface EpisodeCastProps {
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeCast({ tmdbId, seasonNumber, episodeNumber }: EpisodeCastProps) {
  const query = useQuery(showEpisodeCreditsQueryOptions(tmdbId, seasonNumber, episodeNumber));

  return (
    <Query
      result={query}
      callbacks={{
        loading: EpisodeCastLoading,
        error: () => null,
        success: (credits) => <EpisodeCastContent credits={credits} />,
      }}
    />
  );
}

export type { EpisodeCastProps };
export { EpisodeCast };
