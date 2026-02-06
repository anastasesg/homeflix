'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Film, Maximize2, X } from 'lucide-react';

import type { EpisodeImages } from '@/api/entities';
import { cn } from '@/lib/utils';
import { tmdbTVEpisodeImagesQueryOptions } from '@/options/queries/tmdb';

import { Query } from '@/components/query';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Lightbox
// ============================================================================

interface LightboxProps {
  images: string[];
  initialIndex: number;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Lightbox({ images, initialIndex, title, open, onOpenChange }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, goToPrevious, goToNext]);

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[90vh] max-w-[95vw] flex-col gap-0 overflow-hidden border-border/40 bg-black/95 p-0 backdrop-blur-2xl sm:max-w-[95vw]"
      >
        <DialogTitle className="sr-only">
          {title} — Image {currentIndex + 1} of {images.length}
        </DialogTitle>

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {currentIndex + 1} / {images.length}
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
          {/* Nav: Previous */}
          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-2 z-10 rounded-full border border-border/40 bg-black/60 p-2 text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-black/80 hover:text-foreground"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}

          {/* Image */}
          <div className="relative h-full w-full" style={{ aspectRatio: '16/9' }}>
            <Image
              key={images[currentIndex]}
              src={images[currentIndex]}
              alt={`${title} — ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />
          </div>

          {/* Nav: Next */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-2 z-10 rounded-full border border-border/40 bg-black/60 p-2 text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-black/80 hover:text-foreground"
            >
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>

        {/* Thumbnail filmstrip */}
        {images.length > 1 && (
          <div className="border-t border-border/40 px-4 py-2.5">
            <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
              {images.map((url, index) => (
                <button
                  key={url}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 overflow-hidden rounded-md transition-all duration-200 ${
                    index === currentIndex
                      ? 'ring-2 ring-amber-500/70 ring-offset-1 ring-offset-black'
                      : 'opacity-40 ring-1 ring-border/40 hover:opacity-70'
                  }`}
                >
                  <div className="h-10 w-[72px]">
                    <Image src={url} alt="" fill className="object-cover" sizes="80px" />
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
  url: string;
  alt: string;
  index: number;
  onClick: () => void;
}

function GalleryItem({ url, alt, index, onClick }: GalleryItemProps) {
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
            src={url}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 55vw, 45vw"
          />

          {/* Ambient gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Expand icon — glass pill */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full border border-foreground/15 bg-black/40 p-2.5 shadow-lg backdrop-blur-md">
              <Maximize2 className="size-4 text-foreground/90" />
            </div>
          </div>

          {/* Index — bottom-left, subtle */}
          <div className="absolute bottom-2 left-2">
            <span className="text-[10px] font-semibold tabular-nums text-foreground/50 drop-shadow-sm transition-colors group-hover:text-foreground/70">
              {index + 1}
            </span>
          </div>
        </div>
      </button>
    </CarouselItem>
  );
}

// ============================================================================
// Loading
// ============================================================================

function EpisodeGalleryLoading() {
  return (
    <div className="rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 to-transparent p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-video w-[85%] flex-shrink-0 rounded-lg border border-border/60 sm:w-[70%] md:w-[55%] lg:w-[45%]"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Success
// ============================================================================

interface EpisodeGalleryContentProps {
  images: EpisodeImages;
  episodeName?: string;
}

function EpisodeGalleryContent({ images, episodeName }: EpisodeGalleryContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Only show gallery if there are more than 1 still (the header image already shows the first)
  if (images.stills.length <= 1) return null;

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  const title = episodeName ?? 'Episode';

  return (
    <div className="rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 to-transparent p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Film className="size-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Stills</h3>
        <span className="text-xs tabular-nums text-muted-foreground">{images.stills.length}</span>
      </div>

      {/* Carousel */}
      <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
        <CarouselContent className="-ml-2 py-1">
          {images.stills.map((url, index) => (
            <GalleryItem
              key={url}
              url={url}
              alt={`${title} still ${index + 1}`}
              index={index}
              onClick={() => openLightbox(index)}
            />
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
        <CarouselNext className="right-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
      </Carousel>

      <Lightbox
        images={images.stills}
        initialIndex={lightboxIndex}
        title={title}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface EpisodeGalleryProps {
  tmdbId: number;
  seasonNumber: number;
  episodeNumber: number;
  episodeName?: string;
}

function EpisodeGallery({ tmdbId, seasonNumber, episodeNumber, episodeName }: EpisodeGalleryProps) {
  const query = useQuery(tmdbTVEpisodeImagesQueryOptions(tmdbId, seasonNumber, episodeNumber));

  return (
    <Query
      result={query}
      callbacks={{
        loading: EpisodeGalleryLoading,
        error: () => null,
        success: (images) => <EpisodeGalleryContent images={images} episodeName={episodeName} />,
      }}
    />
  );
}

export type { EpisodeGalleryProps };
export { EpisodeGallery };
