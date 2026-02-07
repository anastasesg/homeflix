'use client';

import { AlertCircle, ChevronRight, RefreshCw } from 'lucide-react';

import type { MovieItem, ShowItem } from '@/api/entities';
import { cn } from '@/lib/utils';

import { MediaCard } from '@/components/media/items';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Types
// ============================================================================

type MediaRowSize = 'default' | 'lg';

interface MediaMovieRowProps {
  type: 'movie';
  media: MovieItem[];
}

interface MediaShowRowProps {
  type: 'show';
  media: ShowItem[];
}

type MediaRowProps = {
  size: MediaRowSize;
  title: string;
  onSeeAll: (() => void) | undefined;
} & (MediaMovieRowProps | MediaShowRowProps);

interface MediaRowErrorProps {
  type: 'movie' | 'show';
  error: Error;
  refetch: () => void;
}

interface MediaRowLoadingProps {
  type: 'movie' | 'show';
}

// ============================================================================
// Utilities
// ============================================================================

const cardWidthClass: Record<MediaRowSize, string> = {
  default: 'w-[140px] sm:w-[160px] md:w-[180px]',
  lg: 'w-[160px] sm:w-[180px] md:w-[200px]',
};

// ============================================================================
// Sub-components — Loading
// ============================================================================

function MediaRowLoading(_props: MediaRowLoadingProps) {
  return (
    <section className="space-y-3">
      <Skeleton className="h-7 w-40 rounded-md" />
      <div className="flex gap-3 overflow-hidden px-2 sm:gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('aspect-[2/3] shrink-0 rounded-xl', cardWidthClass.default)}
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Sub-components — Error
// ============================================================================

function MediaRowError({ error, refetch }: MediaRowErrorProps) {
  return (
    <section className="space-y-3">
      <Skeleton className="h-7 w-40 rounded-md" />
      <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
        <AlertCircle className="size-4 shrink-0 text-destructive" />
        <p className="flex-1 text-sm text-muted-foreground">{error.message}</p>
        <Button variant="ghost" size="sm" onClick={refetch} className="shrink-0 gap-1.5">
          <RefreshCw className="size-3" />
          Retry
        </Button>
      </div>
    </section>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function MediaRow({ type, size, title, media, onSeeAll }: MediaRowProps) {
  if (media.length === 0) return null;

  return (
    <section className="space-y-3">
      {/* Row header */}
      <div className="flex items-center justify-between">
        <h2
          className={cn(
            'tracking-tight',
            size === 'lg' ? 'border-l-2 border-primary pl-3 text-xl font-bold' : 'text-lg font-semibold'
          )}
        >
          {title}
        </h2>
        {onSeeAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSeeAll}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            See All
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>

      {/* Row content */}
      <div className="relative -mx-2">
        <div
          className="flex touch-pan-x gap-3 overflow-x-auto px-2 py-2 scrollbar-none sm:gap-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {media.map((item, index) => (
            <div
              key={item.tmdbId}
              className={cn('shrink-0', cardWidthClass[size])}
              style={{ scrollSnapAlign: 'start' }}
            >
              <MediaCard type={type} data={item as MovieItem & ShowItem} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export type { MediaRowErrorProps, MediaRowLoadingProps, MediaRowProps };
export { MediaRow, MediaRowError, MediaRowLoading };
