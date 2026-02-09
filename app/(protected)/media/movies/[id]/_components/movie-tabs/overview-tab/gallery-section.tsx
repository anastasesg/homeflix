'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Film, Image as ImageIcon, Maximize2, X } from 'lucide-react';

import { type MediaImages } from '@/api/entities';
import { cn } from '@/lib/utils';
import { movieImagesQueryOptions, movieTitleQueryOptions } from '@/options/queries/movies/detail';

import { Queries } from '@/components/query';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { SectionHeader } from './section-header';

// ============================================================================
// Loading
// ============================================================================

function GallerySectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-20" />
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
    </section>
  );
}

// ============================================================================
// Gallery Tab Toggle
// ============================================================================

type GalleryTab = 'backdrops' | 'posters';

interface GalleryTabToggleProps {
  activeTab: GalleryTab;
  onTabChange: (tab: GalleryTab) => void;
  backdropCount: number;
  posterCount: number;
}

function GalleryTabToggle({ activeTab, onTabChange, backdropCount, posterCount }: GalleryTabToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5">
      <button
        onClick={() => onTabChange('backdrops')}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
          activeTab === 'backdrops'
            ? 'bg-amber-500/15 text-amber-400 shadow-sm shadow-amber-500/5'
            : 'text-muted-foreground hover:bg-white/[0.04] hover:text-white/70'
        }`}
      >
        <Film className="size-3" />
        Backdrops
        <span className="tabular-nums opacity-60">{backdropCount}</span>
      </button>
      <button
        onClick={() => onTabChange('posters')}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
          activeTab === 'posters'
            ? 'bg-amber-500/15 text-amber-400 shadow-sm shadow-amber-500/5'
            : 'text-muted-foreground hover:bg-white/[0.04] hover:text-white/70'
        }`}
      >
        <ImageIcon className="size-3" />
        Posters
        <span className="tabular-nums opacity-60">{posterCount}</span>
      </button>
    </div>
  );
}

// ============================================================================
// Lightbox
// ============================================================================

interface LightboxProps {
  images: string[];
  initialIndex: number;
  movieTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aspectRatio: 'video' | 'poster';
}

function Lightbox({ images, initialIndex, movieTitle, open, onOpenChange, aspectRatio }: LightboxProps) {
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

  const isPoster = aspectRatio === 'poster';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[90vh] max-w-[95vw] flex-col gap-0 overflow-hidden border-white/[0.08] bg-black/95 p-0 backdrop-blur-2xl sm:max-w-[95vw]"
      >
        <DialogTitle className="sr-only">
          {movieTitle} — Image {currentIndex + 1} of {images.length}
        </DialogTitle>

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
          <span className="text-xs font-medium tabular-nums text-white/50">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80"
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
              className="absolute left-2 z-10 rounded-full border border-white/[0.08] bg-black/60 p-2 text-white/50 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-black/80 hover:text-white/90"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}

          {/* Image */}
          <div
            className={`relative ${isPoster ? 'h-full w-auto' : 'h-full w-full'}`}
            style={isPoster ? { aspectRatio: '2/3' } : { aspectRatio: '16/9' }}
          >
            <Image
              key={images[currentIndex]}
              src={images[currentIndex]}
              alt={`${movieTitle} — ${currentIndex + 1}`}
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
              className="absolute right-2 z-10 rounded-full border border-white/[0.08] bg-black/60 p-2 text-white/50 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-black/80 hover:text-white/90"
            >
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>

        {/* Thumbnail filmstrip */}
        {images.length > 1 && (
          <div className="border-t border-white/[0.06] px-4 py-2.5">
            <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
              {images.map((url, index) => (
                <button
                  key={url}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 overflow-hidden rounded-md transition-all duration-200 ${
                    index === currentIndex
                      ? 'ring-2 ring-amber-500/70 ring-offset-1 ring-offset-black'
                      : 'opacity-40 ring-1 ring-white/[0.06] hover:opacity-70'
                  }`}
                >
                  <div className={isPoster ? 'h-14 w-9' : 'h-10 w-[72px]'}>
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
// Gallery Grid Item
// ============================================================================

interface GalleryItemProps {
  url: string;
  alt: string;
  index: number;
  onClick: () => void;
  variant: 'backdrop' | 'poster';
}

function GalleryItem({ url, alt, index, onClick, variant }: GalleryItemProps) {
  const isBackdrop = variant === 'backdrop';

  return (
    <CarouselItem
      className={
        isBackdrop
          ? 'basis-[85%] pl-2 sm:basis-[70%] md:basis-[55%] lg:basis-[45%]'
          : 'basis-[45%] pl-2 sm:basis-[35%] md:basis-[28%] lg:basis-[20%]'
      }
    >
      <button onClick={onClick} className="group relative block w-full pb-0.5 text-left">
        <div
          className={cn(
            'relative overflow-hidden rounded-lg border border-border/60 shadow-sm transition-all duration-300',
            'group-hover:border-border group-hover:shadow-md group-hover:shadow-black/10 dark:group-hover:shadow-black/30',
            isBackdrop ? 'aspect-video' : 'aspect-[2/3]'
          )}
        >
          <Image
            src={url}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={
              isBackdrop
                ? '(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 55vw, 45vw'
                : '(max-width: 640px) 45vw, (max-width: 768px) 35vw, (max-width: 1024px) 28vw, 20vw'
            }
          />

          {/* Ambient gradient — always slightly visible, intensifies on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Expand icon — glass pill */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full border border-white/15 bg-black/40 p-2.5 shadow-lg backdrop-blur-md">
              <Maximize2 className="size-4 text-white/90" />
            </div>
          </div>

          {/* Index — bottom-left, subtle */}
          <div className="absolute bottom-2 left-2">
            <span className="text-[10px] font-semibold tabular-nums text-white/50 drop-shadow-sm transition-colors group-hover:text-white/70">
              {index + 1}
            </span>
          </div>
        </div>
      </button>
    </CarouselItem>
  );
}

// ============================================================================
// Success
// ============================================================================

interface GallerySectionContentProps {
  images: MediaImages;
  movieTitle: string;
}

function GallerySectionContent({ images, movieTitle }: GallerySectionContentProps) {
  const hasBackdrops = images.backdrops.length > 0;
  const hasPosters = images.posters.length > 0;

  const [activeTab, setActiveTab] = useState<GalleryTab>('backdrops');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!hasBackdrops && !hasPosters) return null;

  const hasBothTypes = hasBackdrops && hasPosters;
  const currentImages = activeTab === 'backdrops' ? images.backdrops : images.posters;
  const totalCount = images.backdrops.length + images.posters.length;

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <SectionHeader icon={Film} title="Gallery" count={totalCount} className="mb-0" />
        {hasBothTypes && (
          <GalleryTabToggle
            activeTab={activeTab}
            onTabChange={setActiveTab}
            backdropCount={images.backdrops.length}
            posterCount={images.posters.length}
          />
        )}
      </div>

      <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
        <CarouselContent className="-ml-2 py-1">
          {currentImages.map((url, index) => (
            <GalleryItem
              key={url}
              url={url}
              alt={`${movieTitle} ${activeTab === 'backdrops' ? 'backdrop' : 'poster'} ${index + 1}`}
              index={index}
              onClick={() => openLightbox(index)}
              variant={activeTab === 'backdrops' ? 'backdrop' : 'poster'}
            />
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
        <CarouselNext className="right-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
      </Carousel>

      <Lightbox
        images={currentImages}
        initialIndex={lightboxIndex}
        movieTitle={movieTitle}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        aspectRatio={activeTab === 'backdrops' ? 'video' : 'poster'}
      />
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface GallerySectionProps {
  tmdbId: number;
}

function GallerySection({ tmdbId }: GallerySectionProps) {
  const imagesQuery = useQuery(movieImagesQueryOptions(tmdbId));
  const titleQuery = useQuery(movieTitleQueryOptions(tmdbId));

  return (
    <Queries
      results={[imagesQuery, titleQuery]}
      callbacks={{
        loading: GallerySectionLoading,
        error: () => null,
        success: ([images, title]) => <GallerySectionContent images={images} movieTitle={title} />,
      }}
    />
  );
}

export type { GallerySectionProps };
export { GallerySection };
