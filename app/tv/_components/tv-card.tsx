'use client';

import Image from 'next/image';

import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Film } from 'lucide-react';

import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

interface TvMediaCardProps {
  id: number;
  title: string;
  year?: number;
  posterUrl?: string;
  mediaType: 'movie' | 'show';
  onFocus?: (layout: { x: number; node: HTMLElement }) => void;
}

// ============================================================
// Main
// ============================================================

function TvMediaCard({ id, title, year, posterUrl, mediaType, onFocus }: TvMediaCardProps) {
  const href = mediaType === 'movie' ? `/tv/movies/${id}` : `/tv/shows/${id}`;

  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      window.location.href = href;
    },
    onFocus: (layout) => onFocus?.({ x: layout.x, node: layout.node }),
  });

  return (
    <div
      ref={ref}
      onClick={() => {
        window.location.href = href;
      }}
      className={cn(
        'flex w-[200px] shrink-0 cursor-pointer flex-col gap-2 outline-none transition-all duration-150 ease-out',
        focused ? 'scale-105 opacity-100' : 'scale-100 opacity-70'
      )}
    >
      <div
        className={cn(
          'relative aspect-[2/3] overflow-hidden rounded-xl',
          focused && 'ring-3 ring-accent ring-offset-2 ring-offset-background'
        )}
      >
        {posterUrl ? (
          <Image src={posterUrl} alt={title} fill className="object-cover" sizes="200px" />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Film className="size-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className={cn('transition-opacity duration-150', focused ? 'opacity-100' : 'opacity-0')}>
        <p className="truncate text-lg font-medium">{title}</p>
        {year && <p className="text-base text-muted-foreground">{year}</p>}
      </div>
    </div>
  );
}

export type { TvMediaCardProps };
export { TvMediaCard };
