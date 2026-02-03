'use client';

import Link from 'next/link';

import { ArrowRight, Film } from 'lucide-react';

import { MediaCard, type MediaItem } from '@/components/media';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

// Mock data - will be replaced with real API calls
const recentlyAdded: MediaItem[] = [
  { id: '1', title: 'Dune: Part Two', year: 2024, type: 'movie', status: 'downloaded' },
  { id: '2', title: 'The Bear', year: 2024, type: 'show', status: 'downloading' },
  { id: '3', title: 'Oppenheimer', year: 2023, type: 'movie', status: 'downloaded' },
  { id: '4', title: 'Severance', year: 2024, type: 'show', status: 'downloaded' },
  { id: '5', title: 'Poor Things', year: 2024, type: 'movie', status: 'downloaded' },
  { id: '6', title: 'Shogun', year: 2024, type: 'show', status: 'downloaded' },
  { id: '7', title: 'Civil War', year: 2024, type: 'movie', status: 'wanted' },
  { id: '8', title: 'Fallout', year: 2024, type: 'show', status: 'downloaded' },
];

function RecentlyAdded() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recently Added</h2>
        <Button variant="ghost" size="xs" asChild>
          <Link href="/library/movies">
            View all
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>

      {recentlyAdded.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Film className="mb-2 size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No media added yet</p>
          <p className="text-xs text-muted-foreground/70">Add movies or shows to see them here</p>
        </div>
      ) : (
        <Carousel opts={{ align: 'start', loop: false }} className="w-full">
          <CarouselContent className="-ml-1">
            {recentlyAdded.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-[40%] pl-1 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <div className="p-1">
                  <MediaCard item={item} showType />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2 size-7 sm:-left-3" />
          <CarouselNext className="-right-2 size-7 sm:-right-3" />
        </Carousel>
      )}
    </div>
  );
}

export { RecentlyAdded };
