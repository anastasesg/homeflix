'use client';

import { Star, Tv } from 'lucide-react';

import type { DiscoverShow } from '@/api/entities';

import { MediaCard, type StatusConfig } from '@/components/media';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// Utilities
// ============================================================================

const showStatus: StatusConfig = {
  icon: Tv,
  label: 'TV Show',
  color: 'text-muted-foreground',
  bg: 'bg-muted',
};

// ============================================================================
// Types
// ============================================================================

interface DiscoverShowCardProps {
  show: DiscoverShow;
  index?: number;
}

// ============================================================================
// Main Component
// ============================================================================

function DiscoverShowCard({ show, index = 0 }: DiscoverShowCardProps) {
  return (
    <MediaCard
      href={`/media/shows/${show.id}`}
      title={show.name}
      posterUrl={show.posterUrl}
      status={showStatus}
      placeholderIcon={Tv}
      animationDelay={index * 30}
      overlaySlot={
        show.rating > 0 && (
          <div className="absolute bottom-2 right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-black/70 px-1.5 text-yellow-400 backdrop-blur-md"
            >
              <Star className="size-3 fill-current" />
              <span className="text-[10px] font-semibold tabular-nums">{show.rating.toFixed(1)}</span>
            </Badge>
          </div>
        )
      }
    >
      <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white">{show.name}</h3>

      {show.year > 0 && (
        <div className="mt-1.5">
          <span className="text-[11px] font-medium tabular-nums text-white/70">{show.year}</span>
        </div>
      )}
    </MediaCard>
  );
}

export type { DiscoverShowCardProps };
export { DiscoverShowCard };
