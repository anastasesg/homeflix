'use client';

import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { Query } from '@/components/query';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

import { SectionHeader } from './section-header';
import type { DataQueryOptions } from './types';

// ============================================================================
// Loading
// ============================================================================

function MediaCarouselSectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[130px] shrink-0 sm:w-[150px]">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <div className="mt-2 space-y-1 px-0.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface MediaCarouselSectionContentProps<T> {
  items: T[];
  icon: React.ElementType;
  title: string;
  renderCard: (item: T, index: number) => ReactNode;
}

function MediaCarouselSectionContent<T>({ items, icon, title, renderCard }: MediaCarouselSectionContentProps<T>) {
  if (items.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={icon} title={title} count={items.length} />
      <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
        <CarouselContent className="-ml-2 py-1">
          {items.map((item, index) => (
            <CarouselItem key={index} className="basis-[130px] pl-2 sm:basis-[150px]">
              {renderCard(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
        <CarouselNext className="right-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
      </Carousel>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface MediaCarouselSectionProps<T> {
  queryOptions: DataQueryOptions<T[]>;
  icon: React.ElementType;
  title: string;
  renderCard: (item: T, index: number) => ReactNode;
}

function MediaCarouselSection<T>({ queryOptions, icon, title, renderCard }: MediaCarouselSectionProps<T>) {
  const query = useQuery(queryOptions);

  return (
    <Query
      result={query}
      callbacks={{
        loading: MediaCarouselSectionLoading,
        error: () => null,
        success: (items) => (
          <MediaCarouselSectionContent items={items} icon={icon} title={title} renderCard={renderCard} />
        ),
      }}
    />
  );
}

export type { MediaCarouselSectionProps };
export { MediaCarouselSection };
