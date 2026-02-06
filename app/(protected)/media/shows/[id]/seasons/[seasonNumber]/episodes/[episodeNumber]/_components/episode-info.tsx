'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Clapperboard, Tv, Users } from 'lucide-react';

import type { EpisodeBasic } from '@/api/entities';
import { showEpisodeQueryOptions } from '@/options/queries/shows/detail';

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
// Sub-components
// ============================================================================

interface SynopsisProps {
  overview: string;
}

function Synopsis({ overview }: SynopsisProps) {
  return (
    <section className="relative">
      <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent" />
      <p className="pl-2 text-[15px] leading-relaxed text-muted-foreground/90">{overview}</p>
    </section>
  );
}

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

interface GuestStarsProps {
  guestStars: EpisodeBasic['guestStars'];
}

function GuestStars({ guestStars }: GuestStarsProps) {
  if (guestStars.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Users className="size-4 text-amber-500" />
        <h3 className="text-sm font-semibold">Guest Stars</h3>
        <span className="text-xs tabular-nums text-muted-foreground/60">{guestStars.length}</span>
      </div>
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

interface CrewChipProps {
  person: EpisodeBasic['crew'][number];
  role: string;
}

function CrewChip({ person, role }: CrewChipProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/40 bg-muted/20 py-1 pl-1 pr-3 transition-colors hover:border-border hover:bg-accent/50">
      {person.profileUrl ? (
        <Image
          src={person.profileUrl}
          alt={person.name}
          width={28}
          height={28}
          className="size-7 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-7 items-center justify-center rounded-full bg-muted">
          <span className="text-[10px] font-medium text-muted-foreground/60">{getInitials(person.name)}</span>
        </div>
      )}
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs font-medium">{person.name}</span>
        <span className="text-[10px] text-muted-foreground/70">{role}</span>
      </div>
    </div>
  );
}

interface CrewSectionProps {
  crew: EpisodeBasic['crew'];
}

function CrewSection({ crew }: CrewSectionProps) {
  if (crew.length === 0) return null;

  const directors = crew.filter((c) => c.job === 'Director');
  const writers = crew.filter((c) => c.job === 'Writer' || c.job === 'Teleplay' || c.job === 'Story');

  if (directors.length === 0 && writers.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Clapperboard className="size-4 text-amber-500" />
        <h3 className="text-sm font-semibold">Crew</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {directors.map((person) => (
          <CrewChip key={`dir-${person.name}`} person={person} role="Director" />
        ))}
        {writers.map((person) => (
          <CrewChip key={`wri-${person.name}`} person={person} role="Writer" />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Loading
// ============================================================================

function EpisodeInfoLoading() {
  return (
    <div className="space-y-6 rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 to-transparent p-4 sm:p-6">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-4 w-32" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

// ============================================================================
// Error
// ============================================================================

function EpisodeInfoError() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 py-12 text-center">
      <Tv className="size-10 text-destructive/30" />
      <h3 className="mt-4 text-lg font-semibold text-destructive">Failed to load episode info</h3>
    </div>
  );
}

// ============================================================================
// Success
// ============================================================================

interface EpisodeInfoSuccessProps {
  episode: EpisodeBasic;
}

function EpisodeInfoSuccess({ episode }: EpisodeInfoSuccessProps) {
  const hasContent = episode.overview || episode.guestStars.length > 0 || episode.crew.length > 0;

  if (!hasContent) return null;

  return (
    <div className="space-y-6 rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 to-transparent p-4 pl-8 sm:p-6 sm:pl-10">
      {episode.overview && <Synopsis overview={episode.overview} />}
      <GuestStars guestStars={episode.guestStars} />
      <CrewSection crew={episode.crew} />
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface EpisodeInfoProps {
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
}

function EpisodeInfo({ tmdbId, seasonNumber, episodeNumber }: EpisodeInfoProps) {
  const episodeQuery = useQuery(showEpisodeQueryOptions(tmdbId, seasonNumber, episodeNumber));

  return (
    <Query
      result={episodeQuery}
      callbacks={{
        loading: EpisodeInfoLoading,
        error: () => <EpisodeInfoError />,
        success: (episode) => <EpisodeInfoSuccess episode={episode} />,
      }}
    />
  );
}

export type { EpisodeInfoProps };
export { EpisodeInfo };
