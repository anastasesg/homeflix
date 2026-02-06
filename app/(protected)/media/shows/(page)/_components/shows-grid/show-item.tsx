'use client';

import { Star, Tv } from 'lucide-react';

import type { DiscoverShow } from '@/api/entities';

import { MediaListItem, type StatusConfig } from '@/components/media';
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

interface DiscoverShowItemProps {
  show: DiscoverShow;
  genreMap: Map<number, string>;
}

// ============================================================================
// Main Component
// ============================================================================

function DiscoverShowItem({ show, genreMap }: DiscoverShowItemProps) {
  const genreNames = show.genreIds
    .map((id) => genreMap.get(id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <MediaListItem
      href={`/media/shows/${show.id}`}
      title={show.name}
      year={show.year > 0 ? show.year : undefined}
      posterUrl={show.posterUrl}
      status={showStatus}
      placeholderIcon={Tv}
      metadataSlot={
        genreNames.length > 0 && <span className="truncate text-muted-foreground">{genreNames.join(', ')}</span>
      }
      statsSlot={
        show.rating > 0 && (
          <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium tabular-nums">{show.rating.toFixed(1)}</span>
          </div>
        )
      }
      badgesSlot={
        show.rating >= 8 && (
          <Badge variant="secondary" className="hidden bg-amber-500/10 text-amber-400 sm:inline-flex">
            Top Rated
          </Badge>
        )
      }
    />
  );
}

export type { DiscoverShowItemProps };
export { DiscoverShowItem };
