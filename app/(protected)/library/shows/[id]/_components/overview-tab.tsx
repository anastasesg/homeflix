'use client';

import Image from 'next/image';

import {
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Film,
  Globe,
  Languages,
  Play,
  Sparkles,
  Star,
  Tag,
  Tv2,
  User,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { SeasonBrowser } from './season-browser';
import type { Show } from './types';

interface OverviewTabProps {
  show: Show;
}

function formatRuntime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function OverviewTab({ show }: OverviewTabProps) {
  const hasCrew = show.crew && show.crew.length > 0;
  const hasMedia = show.media && show.media.backdrops && show.media.backdrops.length > 0;
  const hasKeywords = show.keywords && show.keywords.length > 0;
  const hasNetwork = show.network;

  // Calculate totals
  const totalEpisodes = show.seasons.reduce((sum, s) => sum + s.episodeCount, 0);
  const downloadedEpisodes = show.seasons.reduce((sum, s) => sum + s.downloadedCount, 0);

  return (
    <div className="space-y-8">
      {/* Tagline & Synopsis Section */}
      <section className="relative">
        {show.tagline && (
          <p className="mb-4 text-lg font-light italic text-amber-400/90">&ldquo;{show.tagline}&rdquo;</p>
        )}
        <div className="relative">
          <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent" />
          <p className="pl-2 text-[15px] leading-relaxed text-muted-foreground/90">{show.overview}</p>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-white/[0.06] bg-gradient-to-r from-white/[0.03] to-transparent px-5 py-4">
        <div className="flex items-center gap-2">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold tabular-nums">{show.rating}</span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          <span>{formatRuntime(show.runtime)}/ep</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>
            {show.year}
            {show.endYear && show.endYear !== show.year
              ? `–${show.endYear}`
              : show.showStatus === 'continuing'
                ? '–'
                : ''}
          </span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Tv2 className="size-4" />
          <span>{show.seasons.length} Seasons</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Film className="size-4" />
          <span className="tabular-nums">
            {downloadedEpisodes}/{totalEpisodes} Episodes
          </span>
        </div>
        {show.certification && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="outline" className="border-white/20 text-xs font-medium">
              {show.certification}
            </Badge>
          </>
        )}
        {show.originalLanguage && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Languages className="size-4" />
              <span className="capitalize">{show.originalLanguage}</span>
            </div>
          </>
        )}
        {show.media?.trailerUrl && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="ghost"
              size="sm"
              className="h-auto gap-1.5 p-0 text-sm text-amber-400 hover:bg-transparent hover:text-amber-300"
              asChild
            >
              <a href={show.media.trailerUrl} target="_blank" rel="noopener noreferrer">
                <Play className="size-3.5 fill-current" />
                Watch Trailer
              </a>
            </Button>
          </>
        )}
      </section>

      {/* Season Browser */}
      <section className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent p-5">
        <SeasonBrowser
          seasons={show.seasons}
          defaultExpandedSeason={show.seasons[show.seasons.length - 1]?.seasonNumber}
        />
      </section>

      {/* Media Gallery */}
      {hasMedia && (
        <section>
          <SectionHeader icon={Film} title="Gallery" />
          <Carousel opts={{ align: 'start', loop: false }} className="w-full">
            <CarouselContent className="-ml-2">
              {show.media!.backdrops.map((url, index) => (
                <CarouselItem key={index} className="basis-[85%] pl-2 sm:basis-[70%] md:basis-[55%] lg:basis-[45%]">
                  <div className="group relative aspect-video overflow-hidden rounded-lg ring-1 ring-white/10 transition-all duration-300 hover:ring-2 hover:ring-amber-500/50">
                    <Image
                      src={url}
                      alt={`${show.title} backdrop ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 55vw, 45vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-3 left-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Badge className="bg-black/60 text-xs backdrop-blur-sm">
                        {index + 1} / {show.media!.backdrops.length}
                      </Badge>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-3 size-8 border-white/10 bg-black/60 backdrop-blur-sm hover:bg-black/80" />
            <CarouselNext className="-right-3 size-8 border-white/10 bg-black/60 backdrop-blur-sm hover:bg-black/80" />
          </Carousel>
        </section>
      )}

      {/* Cast Section */}
      {show.cast.length > 0 && (
        <section>
          <SectionHeader icon={Sparkles} title="Cast" count={show.cast.length} />
          <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
            <CarouselContent className="-ml-2">
              {show.cast.map((person, index) => (
                <CarouselItem key={person.name} className="basis-[140px] pl-2 sm:basis-[150px]">
                  <div className="group relative" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg ring-1 ring-white/10 transition-all duration-300 group-hover:ring-2 group-hover:ring-amber-500/40">
                      {person.profileUrl ? (
                        <Image
                          src={person.profileUrl}
                          alt={person.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="150px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                          <User className="size-10 text-zinc-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-2.5">
                        <p className="truncate text-xs font-semibold leading-tight text-white">{person.name}</p>
                        <p className="mt-0.5 truncate text-[10px] leading-tight text-amber-400/80">
                          {person.character}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-3 size-8 border-white/10 bg-black/60 backdrop-blur-sm hover:bg-black/80" />
            <CarouselNext className="-right-3 size-8 border-white/10 bg-black/60 backdrop-blur-sm hover:bg-black/80" />
          </Carousel>
        </section>
      )}

      {/* Crew Section */}
      {hasCrew && (
        <section>
          <SectionHeader icon={Film} title="Crew" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {show.crew!.map((person) => (
              <div
                key={`${person.name}-${person.job}`}
                className="group flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="relative size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
                  {person.profileUrl ? (
                    <Image src={person.profileUrl} alt={person.name} fill className="object-cover" sizes="44px" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
                      <User className="size-5 text-zinc-500" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{person.name}</p>
                  <p className="truncate text-xs text-amber-400/70">{person.job}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Genres & Keywords */}
      <section className="flex flex-col gap-6 sm:flex-row sm:gap-12">
        <div className="flex-1">
          <SectionHeader icon={Tag} title="Genres" />
          <div className="flex flex-wrap gap-2">
            {show.genres.map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                className="border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/[0.08]"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
        {hasKeywords && (
          <div className="flex-1">
            <SectionHeader icon={Sparkles} title="Keywords" />
            <div className="flex flex-wrap gap-1.5">
              {show.keywords!.slice(0, 8).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-white/[0.04] bg-white/[0.02] px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-white/10 hover:text-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Network & External Links */}
      <section className="grid gap-6 sm:grid-cols-2">
        {hasNetwork && (
          <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-5">
            <SectionHeader icon={Building2} title="Network" className="mb-4" />
            <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              {show.network!.logoUrl ? (
                <div className="relative h-8 w-16">
                  <Image
                    src={show.network!.logoUrl}
                    alt={show.network!.name}
                    fill
                    className="object-contain brightness-0 invert"
                    sizes="64px"
                  />
                </div>
              ) : (
                <Building2 className="size-6 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">{show.network!.name}</span>
            </div>
          </div>
        )}

        {(show.imdbId || show.tvdbId) && (
          <div className="flex flex-col justify-center gap-3 rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-5">
            <SectionHeader icon={Globe} title="External Links" className="mb-2" />
            <div className="flex flex-wrap items-center gap-3">
              {show.imdbId && (
                <Button variant="outline" size="sm" className="h-8 gap-1.5 border-white/10 text-xs" asChild>
                  <a href={`https://www.imdb.com/title/${show.imdbId}`} target="_blank" rel="noopener noreferrer">
                    <Globe className="size-3.5" />
                    IMDb
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              )}
              {show.tvdbId && (
                <Button variant="outline" size="sm" className="h-8 gap-1.5 border-white/10 text-xs" asChild>
                  <a href={`https://thetvdb.com/series/${show.tvdbId}`} target="_blank" rel="noopener noreferrer">
                    <Tv2 className="size-3.5" />
                    TVDB
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  count?: number;
  className?: string;
}

function SectionHeader({ icon: Icon, title, count, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-center gap-2', className)}>
      <Icon className="size-4 text-amber-500/80" />
      <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  );
}
