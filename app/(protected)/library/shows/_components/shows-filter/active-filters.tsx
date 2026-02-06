'use client';

import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ActiveFiltersProps {
  search: string;
  genres: string[];
  networks: string[];
  yearMin: number | null;
  yearMax: number | null;
  ratingMin: number | null;
  onRemoveSearch: () => void;
  onRemoveGenre: (genre: string) => void;
  onRemoveNetwork: (network: string) => void;
  onRemoveYearRange: () => void;
  onRemoveRating: () => void;
  onClearAll: () => void;
}

function FilterBadge({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 bg-muted/50 pl-2.5 pr-1 text-xs font-normal hover:bg-muted">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"
      >
        <X className="size-3" />
        <span className="sr-only">Remove filter</span>
      </button>
    </Badge>
  );
}

function ActiveFilters({
  search,
  genres,
  networks,
  yearMin,
  yearMax,
  ratingMin,
  onRemoveSearch,
  onRemoveGenre,
  onRemoveNetwork,
  onRemoveYearRange,
  onRemoveRating,
  onClearAll,
}: ActiveFiltersProps) {
  const hasYearFilter = yearMin !== null || yearMax !== null;
  const hasRatingFilter = ratingMin !== null;
  const hasAnyFilter = search !== '' || genres.length > 0 || networks.length > 0 || hasYearFilter || hasRatingFilter;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {search && <FilterBadge onRemove={onRemoveSearch}>Search: &ldquo;{search}&rdquo;</FilterBadge>}

      {genres.map((genre) => (
        <FilterBadge key={genre} onRemove={() => onRemoveGenre(genre)}>
          {genre}
        </FilterBadge>
      ))}

      {networks.map((network) => (
        <FilterBadge key={network} onRemove={() => onRemoveNetwork(network)}>
          {network}
        </FilterBadge>
      ))}

      {hasYearFilter && (
        <FilterBadge onRemove={onRemoveYearRange}>
          {yearMin && yearMax ? `${yearMin}–${yearMax}` : yearMin ? `≥${yearMin}` : `≤${yearMax}`}
        </FilterBadge>
      )}

      {hasRatingFilter && <FilterBadge onRemove={onRemoveRating}>≥{ratingMin}★</FilterBadge>}

      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
        onClick={onClearAll}
      >
        Clear all
      </Button>
    </div>
  );
}

export { ActiveFilters };
