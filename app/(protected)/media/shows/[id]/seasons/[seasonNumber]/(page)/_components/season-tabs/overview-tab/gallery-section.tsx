'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Film, Maximize2, X } from 'lucide-react';

import type { SeasonDetail } from '@/api/entities';
import { cn } from '@/lib/utils';
import { showSeasonQueryOptions } from '@/options/queries/shows/detail';

import { Query } from '@/components/query';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { SectionHeader } from './section-header';

// ============================================================================
// Utilities
// ============================================================================

interface EpisodeStill {
  url: string;
  episodeNumber: number;
  name: string;
}

function extractStills(season: SeasonDetail): EpisodeStill[] {
  return season.episodes
    .filter((ep) => ep.stillUrl)
    .map((ep) => ({
      url: ep.stillUrl!,
      episodeNumber: ep.episodeNumber,
      name: ep.name,
    }));
}

function formatEpisodeNumber(num: number): string {
  return `E${String(num).padStart(2, '0')}`;
}

// ============================================================================
// Lightbox
// ============================================================================

interface LightboxProps {
  stills: EpisodeStill[];
  initialIndex: number;
  seasonName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Lightbox({ stills, initialIndex, seasonName, open, onOpenChange }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : stills.length - 1));
  }, [stills.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < stills.length - 1 ? prev + 1 : 0));
  }, [stills.length]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, goToPrevious, goToNext]);

  if (stills.length === 0) return null;

  const current = stills[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[90vh] max-w-[95vw] flex-col gap-0 overflow-hidden border-border/40 bg-black/95 p-0 backdrop-blur-2xl sm:max-w-[95vw]"
      >
        <DialogTitle className="sr-only">
          {seasonName} — {current.name} ({formatEpisodeNumber(current.episodeNumber)})
        </DialogTitle>

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {formatEpisodeNumber(current.episodeNumber)} — {currentIndex + 1} / {stills.length}
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Main image area */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-12 py-4">
          {stills.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-2 z-10 rounded-full border border-border/40 bg-black/60 p-2 text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-black/80 hover:text-foreground"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}

          <div className="relative h-full w-full" style={{ aspectRatio: '16/9' }}>
            <Image
              key={current.url}
              src={current.url}
              alt={`${current.name} — ${formatEpisodeNumber(current.episodeNumber)}`}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />
          </div>

          {stills.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-2 z-10 rounded-full border border-border/40 bg-black/60 p-2 text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-black/80 hover:text-foreground"
            >
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>

        {/* Thumbnail filmstrip */}
        {stills.length > 1 && (
          <div className="border-t border-border/40 px-4 py-2.5">
            <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
              {stills.map((still, index) => (
                <button
                  key={still.url}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'relative flex-shrink-0 overflow-hidden rounded-md transition-all duration-200',
                    index === currentIndex
                      ? 'ring-2 ring-amber-500/70 ring-offset-1 ring-offset-black'
                      : 'opacity-40 ring-1 ring-border/40 hover:opacity-70'
                  )}
                >
                  <div className="h-10 w-[72px]">
                    <Image src={still.url} alt="" fill className="object-cover" sizes="80px" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Gallery Item
// ============================================================================

interface GalleryItemProps {
  still: EpisodeStill;
  onClick: () => void;
}

function GalleryItem({ still, onClick }: GalleryItemProps) {
  return (
    <CarouselItem className="basis-[85%] pl-2 sm:basis-[70%] md:basis-[55%] lg:basis-[45%]">
      <button onClick={onClick} className="group relative block w-full pb-0.5 text-left">
        <div
          className={cn(
            'relative aspect-video overflow-hidden rounded-lg border border-border/60 shadow-sm transition-all duration-300',
            'group-hover:border-border group-hover:shadow-md group-hover:shadow-black/10 dark:group-hover:shadow-black/30'
          )}
        >
          <Image
            src={still.url}
            alt={`${still.name} — ${formatEpisodeNumber(still.episodeNumber)}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 55vw, 45vw"
          />

          {/* Ambient gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Expand icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full border border-foreground/15 bg-black/40 p-2.5 shadow-lg backdrop-blur-md">
              <Maximize2 className="size-4 text-foreground/90" />
            </div>
          </div>

          {/* Episode label — bottom-left */}
          <div className="absolute bottom-2 left-2">
            <span className="text-[10px] font-semibold tabular-nums text-foreground/50 drop-shadow-sm transition-colors group-hover:text-foreground/70">
              {formatEpisodeNumber(still.episodeNumber)}
            </span>
          </div>
        </div>
      </button>
    </CarouselItem>
  );
}

// ============================================================================
// Content
// ============================================================================

interface GallerySectionContentProps {
  season: SeasonDetail;
}

function GallerySectionContent({ season }: GallerySectionContentProps) {
  const stills = extractStills(season);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (stills.length === 0) return null;

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <section>
      <SectionHeader icon={Film} title="Episode Stills" count={stills.length} />

      <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
        <CarouselContent className="-ml-2 py-1">
          {stills.map((still, index) => (
            <GalleryItem key={still.url} still={still} onClick={() => openLightbox(index)} />
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
        <CarouselNext className="right-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
      </Carousel>

      <Lightbox
        stills={stills}
        initialIndex={lightboxIndex}
        seasonName={season.name}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface GallerySectionProps {
  tmdbId: number;
  seasonNumber: number;
}

function GallerySection({ tmdbId, seasonNumber }: GallerySectionProps) {
  const query = useQuery(showSeasonQueryOptions(tmdbId, seasonNumber));

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => null,
        error: () => null,
        success: (season) => <GallerySectionContent season={season} />,
      }}
    />
  );
}

export type { GallerySectionProps };
export { GallerySection };
