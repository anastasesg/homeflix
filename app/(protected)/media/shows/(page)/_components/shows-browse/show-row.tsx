'use client';

import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ChevronRight, RefreshCw } from 'lucide-react';

import type { DiscoverShow } from '@/api/entities';
import { cn } from '@/lib/utils';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { ShowCarousel } from '../show-carousel';
import { DiscoverShowCard } from '../shows-grid/show-card';

// ============================================================================
// Types
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DiscoverShowQueryOptions = UseQueryOptions<DiscoverShow[], Error, DiscoverShow[], any>;

type ShowRowSize = 'default' | 'lg';

interface ShowRowProps {
  title: string;
  queryOptions: DiscoverShowQueryOptions;
  size?: ShowRowSize;
  onSeeAll?: () => void;
}

// ============================================================================
// Sub-components
// ============================================================================

const cardWidthClass: Record<ShowRowSize, string> = {
  default: 'w-[140px] sm:w-[160px] md:w-[180px]',
  lg: 'w-[160px] sm:w-[180px] md:w-[200px]',
};

interface ShowRowLoadingProps {
  size: ShowRowSize;
}

function ShowRowLoading({ size }: ShowRowLoadingProps) {
  return (
    <div className="flex gap-3 overflow-hidden px-2 sm:gap-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('aspect-[2/3] shrink-0 rounded-xl', cardWidthClass[size])}
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
}

interface ShowRowErrorProps {
  error: Error;
  refetch: () => void;
}

function ShowRowError({ error, refetch }: ShowRowErrorProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
      <AlertCircle className="size-4 shrink-0 text-destructive" />
      <p className="flex-1 text-sm text-muted-foreground">{error.message}</p>
      <Button variant="ghost" size="sm" onClick={refetch} className="shrink-0 gap-1.5">
        <RefreshCw className="size-3" />
        Retry
      </Button>
    </div>
  );
}

interface ShowRowSuccessProps {
  shows: DiscoverShow[];
  size: ShowRowSize;
}

function ShowRowSuccess({ shows, size }: ShowRowSuccessProps) {
  if (shows.length === 0) return null;

  return (
    <ShowCarousel>
      {shows.map((show, index) => (
        <div key={show.id} className={cn('shrink-0', cardWidthClass[size])} style={{ scrollSnapAlign: 'start' }}>
          <DiscoverShowCard show={show} index={index} />
        </div>
      ))}
    </ShowCarousel>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function ShowRow({ title, queryOptions: options, size = 'default', onSeeAll }: ShowRowProps) {
  const query = useQuery(options);

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
      <Query
        result={query}
        callbacks={{
          loading: () => <ShowRowLoading size={size} />,
          error: (error) => <ShowRowError error={error} refetch={query.refetch} />,
          success: (shows) => <ShowRowSuccess shows={shows} size={size} />,
        }}
      />
    </section>
  );
}

export type { ShowRowProps };
export { ShowRow };
