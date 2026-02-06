'use client';

import { Button } from '@/components/ui/button';

import { FilterBadge } from './filter-badge';

interface ActiveFiltersProps {
  search: string;
  genres: string[];
  yearMin: number | null;
  yearMax: number | null;
  ratingMin: number | null;
  onRemoveSearch: () => void;
  onRemoveGenre: (genre: string) => void;
  onRemoveYearRange: () => void;
  onRemoveRating: () => void;
  onClearAll: () => void;
}

function ActiveFilters({
  search,
  genres,
  yearMin,
  yearMax,
  ratingMin,
  onRemoveSearch,
  onRemoveGenre,
  onRemoveYearRange,
  onRemoveRating,
  onClearAll,
}: ActiveFiltersProps) {
  const hasYearFilter = yearMin !== null || yearMax !== null;
  const hasRatingFilter = ratingMin !== null;
  const hasAnyFilter = search !== '' || genres.length > 0 || hasYearFilter || hasRatingFilter;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {search && <FilterBadge onRemove={onRemoveSearch}>Search: &ldquo;{search}&rdquo;</FilterBadge>}
      {genres.map((genre) => (
        <FilterBadge key={genre} onRemove={() => onRemoveGenre(genre)}>
          {genre}
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

export type { ActiveFiltersProps };
export { ActiveFilters };
