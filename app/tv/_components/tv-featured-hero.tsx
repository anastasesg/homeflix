'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Route } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

interface FeaturedItem {
  id: number;
  title: string;
  overview: string;
  year?: number;
  rating?: number;
  backdropUrl?: string;
  mediaType: 'movie' | 'show';
}

interface TvFeaturedHeroProps {
  items: FeaturedItem[];
}

// ============================================================
// Main
// ============================================================

function TvFeaturedHero({ items }: TvFeaturedHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isPaused = useRef(false);
  const router = useRouter();

  const active = items[activeIndex];

  // Auto-advance every 10 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      if (!isPaused.current) {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [items.length]);

  const { ref, focusKey } = useFocusable({
    focusKey: 'featured-hero',
    trackChildren: true,
    onArrowPress: (direction) => {
      if (direction === 'left') {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
        return false;
      }
      if (direction === 'right') {
        setActiveIndex((prev) => (prev + 1) % items.length);
        return false;
      }
      return true;
    },
    onFocus: () => {
      isPaused.current = true;
    },
    onBlur: () => {
      isPaused.current = false;
    },
  });

  const handleViewDetails = useCallback(() => {
    if (!active) return;
    const path = active.mediaType === 'movie' ? `/tv/movies/${active.id}` : `/tv/shows/${active.id}`;
    router.push(path as Route);
  }, [active, router]);

  const { ref: buttonRef, focused: buttonFocused } = useFocusable({
    onEnterPress: handleViewDetails,
  });

  if (!active) return null;

  return (
    <FocusContext.Provider value={focusKey}>
      <section ref={ref} className="relative aspect-video w-full overflow-hidden">
        {/* Backdrop */}
        {active.backdropUrl && (
          <Image
            src={active.backdropUrl}
            alt={active.title}
            fill
            className="object-cover transition-opacity duration-700"
            priority
            sizes="100vw"
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end gap-4 p-12 pb-16">
          <h1 className="max-w-2xl text-5xl leading-tight font-bold">{active.title}</h1>

          <div className="flex items-center gap-4 text-lg text-muted-foreground">
            {active.rating && (
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="size-5 fill-current" />
                {active.rating.toFixed(1)}
              </span>
            )}
            {active.year && <span>{active.year}</span>}
          </div>

          <p className="line-clamp-3 max-w-xl text-lg leading-relaxed text-muted-foreground">{active.overview}</p>

          <div
            ref={buttonRef}
            className={cn(
              'mt-2 w-fit rounded-lg px-8 py-3 text-xl font-semibold transition-all duration-150',
              buttonFocused
                ? 'scale-105 bg-accent text-accent-foreground ring-3 ring-accent/50'
                : 'bg-muted/30 text-foreground'
            )}
          >
            View Details
          </div>

          {/* Slide indicators */}
          {items.length > 1 && (
            <div className="mt-4 flex gap-2">
              {items.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i === activeIndex ? 'w-8 bg-accent' : 'w-4 bg-muted-foreground/30'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </FocusContext.Provider>
  );
}

export type { FeaturedItem };
export { TvFeaturedHero };
