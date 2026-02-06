'use client';

import Link from 'next/link';

import { ArrowRight, Check } from 'lucide-react';

import { MediaCard } from '@/components/media';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

// Mock data - will be replaced with real API calls
const recentlyAdded = [
  { id: '1', title: 'Dune: Part Two', year: 2024, type: 'movie', status: 'downloaded' } as const,
  { id: '2', title: 'The Bear', year: 2024, type: 'show', status: 'downloading' } as const,
  { id: '3', title: 'Oppenheimer', year: 2023, type: 'movie', status: 'downloaded' } as const,
  { id: '4', title: 'Severance', year: 2024, type: 'show', status: 'downloaded' } as const,
  { id: '5', title: 'Poor Things', year: 2024, type: 'movie', status: 'downloaded' } as const,
  { id: '6', title: 'Shogun', year: 2024, type: 'show', status: 'downloaded' } as const,
  { id: '7', title: 'Civil War', year: 2024, type: 'movie', status: 'wanted' } as const,
  { id: '8', title: 'Fallout', year: 2024, type: 'show', status: 'downloaded' } as const,
] as const;

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

      <Carousel opts={{ align: 'start', loop: false }} className="w-full">
        <CarouselContent className="-ml-1">
          {recentlyAdded.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-[40%] pl-1 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <div className="p-1">
                <MediaCard
                  href={`/media/movies/${item.id}`}
                  status={{
                    color: item.status === 'downloaded' ? 'success' : 'warning',
                    glow: 'red-400',
                    icon: Check,
                    label: 'down',
                    bg: 'red-400',
                  }}
                  title={item.title}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-2 size-7 sm:-left-3" />
        <CarouselNext className="-right-2 size-7 sm:-right-3" />
      </Carousel>
    </div>
  );
}

export { RecentlyAdded };
