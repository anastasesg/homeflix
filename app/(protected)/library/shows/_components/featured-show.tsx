'use client';

import Link from 'next/link';

import { Calendar, Clock, Play, Star, Tv2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import type { EnrichedShow } from './types';

interface FeaturedShowProps {
  show: EnrichedShow;
}

function FeaturedShow({ show }: FeaturedShowProps) {
  const formatRuntime = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const progressPercent = show.totalEpisodes > 0 ? Math.round((show.downloadedEpisodes / show.totalEpisodes) * 100) : 0;

  const isComplete = show.downloadedEpisodes === show.totalEpisodes && show.totalEpisodes > 0;

  return (
    <section className="relative overflow-hidden rounded-xl">
      {/* Backdrop Image */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[2.4/1]">
        {show.backdropUrl && (
          <img src={show.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Noise texture overlay for cinematic feel */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-end p-4 sm:p-6 lg:p-8">
          <div className="flex max-w-2xl flex-col gap-2 sm:gap-3">
            {/* Show Type Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <Tv2 className="mr-1 size-3" />
                {show.showStatus === 'continuing' ? 'Continuing' : show.showStatus === 'ended' ? 'Ended' : 'Upcoming'}
              </Badge>
              {show.network && (
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  {show.network}
                </Badge>
              )}
            </div>

            {/* Tagline - hidden on mobile for space */}
            {show.tagline && (
              <p className="hidden font-serif text-sm italic text-muted-foreground/80 sm:block md:text-base">
                &ldquo;{show.tagline}&rdquo;
              </p>
            )}

            {/* Title */}
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
              {show.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:text-sm">
              {show.rating && (
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <Star className="size-4 fill-current" />
                  <span className="font-medium tabular-nums">{show.rating.toFixed(1)}</span>
                </span>
              )}

              {show.year && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="tabular-nums">
                    {show.year}
                    {show.endYear && show.endYear !== show.year
                      ? `–${show.endYear}`
                      : show.showStatus === 'continuing'
                        ? '–'
                        : ''}
                  </span>
                </>
              )}

              {show.runtime && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {formatRuntime(show.runtime)}/ep
                  </span>
                </>
              )}

              <span className="text-muted-foreground/30">·</span>
              <span>
                {show.seasonCount} {show.seasonCount === 1 ? 'Season' : 'Seasons'}
              </span>
            </div>

            {/* Genres */}
            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {show.genres.slice(0, 3).map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="bg-white/10 px-2 py-0.5 text-[10px] backdrop-blur-sm hover:bg-white/20 sm:text-xs"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Episode Progress */}
            {!isComplete && show.totalEpisodes > 0 && (
              <div className="mt-1 max-w-xs">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Episode Progress</span>
                  <span className="tabular-nums">
                    {show.downloadedEpisodes}/{show.totalEpisodes}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-white/10" />
              </div>
            )}

            {/* Next Episode Info */}
            {show.nextEpisode && (
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2">
                <Calendar className="size-4 text-amber-400" />
                <div className="text-sm">
                  <span className="font-medium text-amber-400">Next Episode: </span>
                  <span className="text-foreground">
                    S{show.nextEpisode.seasonNumber.toString().padStart(2, '0')}E
                    {show.nextEpisode.episodeNumber.toString().padStart(2, '0')}
                    {show.nextEpisode.title && ` – ${show.nextEpisode.title}`}
                  </span>
                  {show.nextEpisode.airDate && (
                    <span className="text-muted-foreground"> · {show.nextEpisode.airDate}</span>
                  )}
                </div>
              </div>
            )}

            {/* Overview - hidden on mobile */}
            {show.overview && (
              <p className="hidden max-w-xl text-sm leading-relaxed text-muted-foreground sm:line-clamp-2 md:line-clamp-3 md:text-base">
                {show.overview}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1 sm:pt-2">
              <Button asChild size="default" className="gap-2 shadow-lg shadow-primary/20 sm:size-lg">
                <Link href={`/library/shows/${show.id}`}>
                  <Play className="size-4 fill-current" />
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Details</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { FeaturedShow };
