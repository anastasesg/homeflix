'use client';

import { useCallback } from 'react';

import { ArrowDownAZ, ArrowUpAZ, Grid3X3, LayoutList, SlidersHorizontal } from 'lucide-react';

import { type TVDiscoverSortField, useTVDiscoverFilters } from '@/hooks/filters/use-tv-discover-filters';
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

import { ActiveFilters } from './active-filters';
import { FilterSheet } from './filter-sheet';
import { SmartSearch } from './smart-search';

// ============================================================================
// Constants
// ============================================================================

const sortOptions: { value: TVDiscoverSortField; label: string }[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'first_air_date', label: 'First Air Date' },
  { value: 'name', label: 'Name' },
];

// ============================================================================
// Main Component
// ============================================================================

function ShowsFilter() {
  const {
    filters,
    hasActiveFilters,
    activeFilterCount,
    setSearch: onSearchChange,
    setSort: onSortChange,
    toggleSortDirection: onSortDirectionToggle,
    setView: onViewChange,
    setGenres: onGenresChange,
    setYearRange: onYearRangeChange,
    setRatingMin: onRatingMinChange,
    setRuntimeRange: onRuntimeRangeChange,
    setLanguage: onLanguageChange,
    setVoteCountMin: onVoteCountMinChange,
    setNetworks: onNetworksChange,
    setStatus: onStatusChange,
    setProviders: onProvidersChange,
    setKeywords: onKeywordsChange,
    clearFilters: onClearFilters,
  } = useTVDiscoverFilters();

  const { q: search, sort, dir: sortDirection, view } = filters;

  const currentSort = sortOptions.find((opt) => opt.value === sort);
  const SortDirectionIcon = sortDirection === 'asc' ? ArrowUpAZ : ArrowDownAZ;

  const handleAddKeyword = useCallback(
    (id: number) => {
      if (!filters.keywords.includes(id)) onKeywordsChange([...filters.keywords, id]);
    },
    [filters.keywords, onKeywordsChange]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Smart Search */}
        <SmartSearch
          value={search}
          onSearchChange={onSearchChange}
          onAddKeyword={handleAddKeyword}
          existingKeywords={filters.keywords}
          className={cn('flex-1', hasActiveFilters && 'sm:max-w-sm')}
        />

        {/* Filters, Sort & View — only visible in filter mode */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            {/* Filter Sheet */}
            <FilterSheet
              genres={filters.genres}
              yearMin={filters.yearMin}
              yearMax={filters.yearMax}
              ratingMin={filters.ratingMin}
              runtimeMin={filters.runtimeMin}
              runtimeMax={filters.runtimeMax}
              language={filters.language}
              voteCountMin={filters.voteCountMin}
              networks={filters.networks}
              status={filters.status}
              providers={filters.providers}
              region={filters.region}
              onGenresChange={onGenresChange}
              onYearRangeChange={onYearRangeChange}
              onRatingMinChange={onRatingMinChange}
              onRuntimeRangeChange={onRuntimeRangeChange}
              onLanguageChange={onLanguageChange}
              onVoteCountMinChange={onVoteCountMinChange}
              onNetworksChange={onNetworksChange}
              onStatusChange={onStatusChange}
              onProvidersChange={onProvidersChange}
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
                  <DropdownMenuRadioGroup value={sort} onValueChange={(v) => onSortChange(v as TVDiscoverSortField)}>
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
        )}
      </div>

      {/* Active Filters */}
      <ActiveFilters />
    </div>
  );
}

export { ShowsFilter };
