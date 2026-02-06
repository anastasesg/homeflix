'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Play, RefreshCw, Star, Tv } from 'lucide-react';

import type { DiscoverShow } from '@/api/entities';
import { cn } from '@/lib/utils';
import { tmdbTVTrendingQueryOptions } from '@/options/queries/tmdb/tmdb-tv-discover';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';

// ============================================================================
// Constants
// ============================================================================

const HERO_COUNT = 5;
const ROTATE_INTERVAL_MS = 8000;
const TRANSITION_DURATION_MS = 500;

// ============================================================================
// Sub-components — Loading
// ============================================================================

function FeaturedShowLoading() {
  return (
    <section className="relative overflow-hidden rounded-xl">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[2/1] xl:aspect-[2.4/1]">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted/80 to-muted" />

        <div
          className="absolute inset-0 animate-[shimmer_2s_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <div className="absolute inset-0 flex items-end p-4 sm:p-6 lg:p-8">
          <div className="flex max-w-2xl flex-col gap-3">
            <div className="h-8 w-72 animate-pulse rounded bg-muted/40 sm:h-10 sm:w-96" />
            <div className="flex items-center gap-3">
              <div className="h-4 w-12 animate-pulse rounded bg-muted/30" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted/30" />
            </div>
            <div className="hidden space-y-2 sm:block">
              <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted/30" />
              <div className="h-4 w-4/5 max-w-xl animate-pulse rounded bg-muted/30" />
            </div>
            <div className="pt-2">
              <div className="h-10 w-32 animate-pulse rounded-md bg-muted/40 sm:w-40" />
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-6 hidden animate-pulse text-muted-foreground/10 md:block lg:right-12 lg:top-12">
          <Tv className="size-24 lg:size-32" strokeWidth={1} />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Sub-components — Error
// ============================================================================

interface FeaturedShowErrorProps {
  error: Error;
  refetch: () => void;
}

function FeaturedShowError({ error, refetch }: FeaturedShowErrorProps) {
  return (
    <section className="relative overflow-hidden rounded-xl">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[2/1] xl:aspect-[2.4/1]">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-background to-background" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Unable to load featured show
            </h2>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
          <Button variant="outline" onClick={refetch} className="mt-2 gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Sub-components — Slide
// ============================================================================

interface FeaturedShowSlideProps {
  show: DiscoverShow;
  isActive: boolean;
}

function FeaturedShowSlide({ show, isActive }: FeaturedShowSlideProps) {
  return (
    <div
      className={cn('absolute inset-0 transition-opacity', isActive ? 'opacity-100' : 'pointer-events-none opacity-0')}
      style={{ transitionDuration: `${TRANSITION_DURATION_MS}ms` }}
    >
      {show.backdropUrl && (
        <Image
          src={show.backdropUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fill
          priority={isActive}
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-end p-4 sm:p-6 lg:p-8">
        <div className="flex max-w-2xl flex-col gap-2 sm:gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
            {show.name}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:text-sm">
            {show.rating > 0 && (
              <span className="flex items-center gap-1.5 text-yellow-400">
                <Star className="size-4 fill-current" />
                <span className="font-medium tabular-nums">{show.rating.toFixed(1)}</span>
              </span>
            )}

            {show.year > 0 && (
              <>
                <span className="text-muted-foreground/30">&middot;</span>
                <span className="tabular-nums">{show.year}</span>
              </>
            )}
          </div>

          {/* Overview */}
          {show.overview && (
            <p className="hidden max-w-xl text-sm leading-relaxed text-muted-foreground sm:line-clamp-2 md:line-clamp-3 md:text-base">
              {show.overview}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1 sm:pt-2">
            <Button asChild size="default" className="gap-2 shadow-lg shadow-primary/20">
              <Link href={`/media/shows/${show.id}`}>
                <Play className="size-4 fill-current" />
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">Details</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components — Dots
// ============================================================================

interface CarouselDotsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

function CarouselDots({ count, activeIndex, onSelect }: CarouselDotsProps) {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={cn(
            'size-2 rounded-full transition-all duration-300',
            i === activeIndex ? 'scale-125 bg-primary' : 'bg-foreground/20 hover:bg-foreground/40'
          )}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Sub-components — Success
// ============================================================================

interface FeaturedShowCarouselProps {
  shows: DiscoverShow[];
}

function FeaturedShowCarousel({ shows }: FeaturedShowCarouselProps) {
  const slides = shows.slice(0, HERO_COUNT);
  const [activeIndex, setActiveIndex] = useState(0);
  const isPaused = useRef(false);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(index % slides.length);
    },
    [slides.length]
  );

  // Auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused.current) {
        setActiveIndex((prev) => (prev + 1) % slides.length);
      }
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Touch/swipe support
  const touchStart = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart.current === null) return;
      const diff = touchStart.current - (e.changedTouches[0]?.clientX ?? 0);
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          setActiveIndex((prev) => (prev + 1) % slides.length);
        } else {
          setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
        }
      }

      touchStart.current = null;
    },
    [slides.length]
  );

  if (slides.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden rounded-xl"
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[2/1] xl:aspect-[2.4/1]">
        {slides.map((show, i) => (
          <FeaturedShowSlide key={show.id} show={show} isActive={i === activeIndex} />
        ))}

        <CarouselDots count={slides.length} activeIndex={activeIndex} onSelect={goToSlide} />
      </div>
    </section>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function FeaturedShow() {
  const trendingQuery = useQuery(tmdbTVTrendingQueryOptions());

  return (
    <Query
      result={trendingQuery}
      callbacks={{
        loading: () => <FeaturedShowLoading />,
        error: (error) => <FeaturedShowError error={error} refetch={trendingQuery.refetch} />,
        success: (shows) => <FeaturedShowCarousel shows={shows} />,
      }}
    />
  );
}

export { FeaturedShow };
