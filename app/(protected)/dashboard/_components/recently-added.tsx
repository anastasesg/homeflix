'use client';

import Link from 'next/link';

import { ArrowRight, CheckCircle2, Clock, Download, Film } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type MediaStatus = 'downloaded' | 'downloading' | 'missing' | 'wanted';

interface MediaItem {
  id: string;
  title: string;
  year: number;
  type: 'movie' | 'show';
  status: MediaStatus;
  posterUrl: string;
  addedAt: string;
}

// Mock data - will be replaced with real API calls
const recentlyAdded: MediaItem[] = [
  { id: '1', title: 'Dune: Part Two', year: 2024, type: 'movie', status: 'downloaded', posterUrl: '', addedAt: '2d' },
  { id: '2', title: 'The Bear', year: 2024, type: 'show', status: 'downloading', posterUrl: '', addedAt: '3d' },
  { id: '3', title: 'Oppenheimer', year: 2023, type: 'movie', status: 'downloaded', posterUrl: '', addedAt: '1w' },
  { id: '4', title: 'Severance', year: 2024, type: 'show', status: 'downloaded', posterUrl: '', addedAt: '1w' },
  { id: '5', title: 'Poor Things', year: 2024, type: 'movie', status: 'downloaded', posterUrl: '', addedAt: '2w' },
  { id: '6', title: 'Shogun', year: 2024, type: 'show', status: 'downloaded', posterUrl: '', addedAt: '2w' },
  { id: '7', title: 'Civil War', year: 2024, type: 'movie', status: 'wanted', posterUrl: '', addedAt: '3w' },
  { id: '8', title: 'Fallout', year: 2024, type: 'show', status: 'downloaded', posterUrl: '', addedAt: '3w' },
];

const statusConfig: Record<MediaStatus, { icon: typeof CheckCircle2; label: string; color: string; bg: string }> = {
  downloaded: { icon: CheckCircle2, label: 'Downloaded', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  downloading: { icon: Download, label: 'Downloading', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  missing: { icon: Clock, label: 'Missing', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  wanted: { icon: Clock, label: 'Wanted', color: 'text-muted-foreground', bg: 'bg-muted' },
};

function PosterCard({ item }: { item: MediaItem }) {
  const status = statusConfig[item.status];
  const StatusIcon = status.icon;

  return (
    <Link
      href={`/library/${item.type === 'movie' ? 'movies' : 'shows'}/${item.id}`}
      className="group relative block overflow-hidden rounded-lg ring-1 ring-white/10 transition-all duration-200 hover:ring-2 hover:ring-primary/50"
    >
      <AspectRatio ratio={2 / 3}>
        {/* Poster placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900">
          <div className="flex h-full items-center justify-center p-2 text-center text-[10px] text-muted-foreground">
            {item.title}
          </div>
        </div>

        {/* Status Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute left-1.5 top-1.5">
              <Badge variant="secondary" className={cn('size-5 p-0', status.bg)}>
                <StatusIcon className={cn('size-3', status.color)} />
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">{status.label}</TooltipContent>
        </Tooltip>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="p-2">
            <h3 className="line-clamp-2 text-xs font-semibold leading-tight">{item.title}</h3>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] tabular-nums text-muted-foreground">{item.year}</span>
              <Badge variant="outline" className="h-3.5 border-white/20 px-1 text-[8px]">
                {item.type === 'movie' ? 'Movie' : 'Show'}
              </Badge>
            </div>
          </div>
        </div>
      </AspectRatio>
    </Link>
  );
}

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
                  <PosterCard item={item} />
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
