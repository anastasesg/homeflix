'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';

import type { EpisodeBasic } from '@/api/entities';
import { showEpisodeQueryOptions } from '@/options/queries/shows/detail';

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
// Guest Star Card
// ============================================================================

interface GuestStarCardProps {
  name: string;
  character: string;
  profileUrl?: string;
  order: number;
}

function GuestStarCard({ name, character, profileUrl, order }: GuestStarCardProps) {
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
// Success
// ============================================================================

interface EpisodeCastContentProps {
  guestStars: EpisodeBasic['guestStars'];
}

function EpisodeCastContent({ guestStars }: EpisodeCastContentProps) {
  if (guestStars.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={Users} title="Guest Stars" count={guestStars.length} />
      <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
        <CarouselContent className="-ml-2 py-1">
          {guestStars.map((guest, index) => (
            <CarouselItem key={`${guest.name}-${index}`} className="basis-[110px] pl-2 sm:basis-[130px]">
              <GuestStarCard
                name={guest.name}
                character={guest.character}
                profileUrl={guest.profileUrl}
                order={guest.order}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {guestStars.length > 4 && (
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
// Main
// ============================================================================

interface EpisodeCastProps {
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeCast({ tmdbId, seasonNumber, episodeNumber }: EpisodeCastProps) {
  const query = useQuery(showEpisodeQueryOptions(tmdbId, seasonNumber, episodeNumber));

  return (
    <Query
      result={query}
      callbacks={{
        loading: EpisodeCastLoading,
        error: () => null,
        success: (episode) => <EpisodeCastContent guestStars={episode.guestStars} />,
      }}
    />
  );
}

export type { EpisodeCastProps };
export { EpisodeCast };
