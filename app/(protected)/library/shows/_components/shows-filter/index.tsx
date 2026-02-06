'use client';

import { ArrowDownAZ, ArrowUpAZ, Grid3X3, LayoutList, Search, SlidersHorizontal } from 'lucide-react';

import { type ShowSortFieldType, useShowFilters } from '@/hooks/filters';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import { ActiveFilters } from './active-filters';
import { FilterPopover } from './filter-popover';

const sortOptions: { value: ShowSortFieldType; label: string }[] = [
  { value: 'added', label: 'Recently Added' },
  { value: 'title', label: 'Title' },
  { value: 'year', label: 'Release Year' },
  { value: 'rating', label: 'Rating' },
  { value: 'nextAiring', label: 'Next Airing' },
];

function ShowsFilter() {
  const {
    filters: { q: search, sort, dir: sortDirection, view, genres, networks, yearMin, yearMax, ratingMin },
    activeFilterCount,
    setSearch: onSearchChange,
    setSort: onSortChange,
    toggleSortDirection: onSortDirectionToggle,
    setView: onViewChange,
    setGenres: onGenresChange,
    setNetworks: onNetworksChange,
    setYearRange: onYearRangeChange,
    setRatingMin: onRatingMinChange,
    clearFilters: onClearFilters,
  } = useShowFilters();

  const currentSort = sortOptions.find((opt) => opt.value === sort);
  const SortDirectionIcon = sortDirection === 'asc' ? ArrowUpAZ : ArrowDownAZ;

  const handleRemoveGenre = (genre: string) => {
    onGenresChange(genres.filter((g) => g !== genre));
  };

  const handleRemoveNetwork = (network: string) => {
    onNetworksChange(networks.filter((n) => n !== network));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search shows, genres..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 border-muted/50 bg-muted/30 pl-9 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-background"
          />
        </div>

        {/* Filters, Sort & View */}
        <div className="flex items-center gap-2">
          {/* Filter Popover */}
          <FilterPopover
            genres={genres}
            networks={networks}
            yearMin={yearMin}
            yearMax={yearMax}
            ratingMin={ratingMin}
            onGenresChange={onGenresChange}
            onNetworksChange={onNetworksChange}
            onYearRangeChange={onYearRangeChange}
            onRatingMinChange={onRatingMinChange}
            onClear={onClearFilters}
            activeCount={activeFilterCount}
          />

          {/* Sort Dropdown with Direction */}
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 gap-2 rounded-r-none border-r-0 border-muted/50 bg-muted/30 hover:bg-muted/50"
                >
                  <SlidersHorizontal className="size-4" />
                  <span className="hidden sm:inline">{currentSort?.label ?? 'Sort'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sort} onValueChange={(v) => onSortChange(v as ShowSortFieldType)}>
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-9 rounded-l-none border-muted/50 bg-muted/30 hover:bg-muted/50"
              onClick={onSortDirectionToggle}
              title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            >
              <SortDirectionIcon className="size-4" />
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex rounded-lg border border-muted/50 bg-muted/30 p-0.5">
            <Button
              variant="ghost"
              size="icon"
              className={cn('size-9 hover:bg-muted', view === 'grid' && 'bg-muted')}
              onClick={() => onViewChange('grid')}
            >
              <Grid3X3 className="size-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('size-9 hover:bg-muted', view === 'list' && 'bg-muted')}
              onClick={() => onViewChange('list')}
            >
              <LayoutList className="size-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        search={search}
        genres={genres}
        networks={networks}
        yearMin={yearMin}
        yearMax={yearMax}
        ratingMin={ratingMin}
        onRemoveSearch={() => onSearchChange('')}
        onRemoveGenre={handleRemoveGenre}
        onRemoveNetwork={handleRemoveNetwork}
        onRemoveYearRange={() => onYearRangeChange(null, null)}
        onRemoveRating={() => onRatingMinChange(null)}
        onClearAll={onClearFilters}
      />
    </div>
  );
}

export { ShowsFilter };
