'use client';

import { useMemo } from 'react';

import Image from 'next/image';

import { Sparkles } from 'lucide-react';

import type { SeasonDetail } from '@/api/entities';

import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { SectionHeader } from './section-header';

// ============================================================================
// Utilities
// ============================================================================

interface AggregatedGuestStar {
  name: string;
  character: string;
  profileUrl?: string;
  order: number;
  episodeCount: number;
}

function aggregateGuestStars(season: SeasonDetail): AggregatedGuestStar[] {
  const map = new Map<string, AggregatedGuestStar>();

  for (const episode of season.episodes) {
    for (const star of episode.guestStars) {
      const existing = map.get(star.name);
      if (existing) {
        existing.episodeCount += 1;
        // Keep the highest-billed (lowest order) appearance
        if (star.order < existing.order) {
          existing.order = star.order;
          existing.character = star.character;
          if (star.profileUrl) existing.profileUrl = star.profileUrl;
        }
      } else {
        map.set(star.name, {
          name: star.name,
          character: star.character,
          profileUrl: star.profileUrl,
          order: star.order,
          episodeCount: 1,
        });
      }
    }
  }

  // Sort: episode count desc, then order asc
  return [...map.values()].sort((a, b) => b.episodeCount - a.episodeCount || a.order - b.order);
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
// Cast Card
// ============================================================================

interface CastCardProps {
  person: AggregatedGuestStar;
  index: number;
}

function CastCard({ person, index }: CastCardProps) {
  const isTopBilled = index < 3;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group cursor-default pb-0.5">
          {/* Portrait image */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border/60 shadow-sm transition-all duration-300 group-hover:border-border group-hover:shadow-md group-hover:shadow-black/10 dark:group-hover:shadow-black/30">
            {person.profileUrl ? (
              <Image
                src={person.profileUrl}
                alt={person.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="150px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-lg font-medium text-muted-foreground/60">{getInitials(person.name)}</span>
              </div>
            )}

            {/* Top-billed indicator */}
            {isTopBilled && (
              <div className="absolute left-0 top-0 h-6 w-6">
                <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-amber-500/30 to-transparent" />
              </div>
            )}

            {/* Episode count badge */}
            {person.episodeCount > 1 && (
              <div className="absolute right-1.5 top-1.5">
                <Badge className="bg-black/70 text-[10px] text-white backdrop-blur-sm">{person.episodeCount} eps</Badge>
              </div>
            )}
          </div>

          {/* Text below image */}
          <div className="mt-2 px-0.5">
            <p className="truncate text-[13px] font-semibold leading-tight text-foreground/90 transition-colors group-hover:text-foreground">
              {person.name}
            </p>
            <p className="mt-0.5 truncate text-xs leading-tight text-muted-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400/80">
              {person.character}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-52">
        <span className="font-medium">{person.name}</span>
        {person.character && <span className="opacity-60"> as {person.character}</span>}
        {person.episodeCount > 1 && <span className="opacity-60"> ({person.episodeCount} episodes)</span>}
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================================================
// Main
// ============================================================================

interface CastSectionProps {
  season: SeasonDetail;
}

function CastSection({ season }: CastSectionProps) {
  const aggregated = useMemo(() => aggregateGuestStars(season), [season]);

  if (aggregated.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={Sparkles} title="Guest Stars" count={aggregated.length} />
      <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
        <CarouselContent className="-ml-2 py-1">
          {aggregated.map((person, index) => (
            <CarouselItem key={person.name} className="basis-[130px] pl-2 sm:basis-[150px]">
              <CastCard person={person} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
        <CarouselNext className="right-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
      </Carousel>
    </section>
  );
}

export type { CastSectionProps };
export { CastSection };
