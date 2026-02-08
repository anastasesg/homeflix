'use client';

import { ArrowDownNarrowWide, ArrowUpNarrowWide, LayoutGrid, List } from 'lucide-react';

import type { SearchMediaType, SearchViewMode } from '@/hooks/filters';
import { searchMovieSortFields, searchShowSortFields, useSearchFilters } from '@/hooks/filters';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { ActiveFilters } from './active-filters';
import { FilterSheet } from './filter-sheet';
import { SmartSearch } from './smart-search';

// ============================================================================
// Types
// ============================================================================

type SearchToolbarProps = object;

// ============================================================================
// Constants
// ============================================================================

const SORT_LABEL_MAP: Record<string, string> = {
  popularity: 'Popularity',
  rating: 'Rating',
  release_date: 'Release Date',
  title: 'Title',
  revenue: 'Revenue',
  first_air_date: 'First Air Date',
  name: 'Name',
};

// ============================================================================
// Sub-components
// ============================================================================

interface TypeToggleProps {
  type: SearchMediaType;
  setType: (type: SearchMediaType) => void;
}

function TypeToggle({ type, setType }: TypeToggleProps) {
  return (
    <div className="flex items-center rounded-lg border border-muted/50 bg-muted/30 p-0.5">
      {(['all', 'movies', 'shows'] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setType(t)}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-medium transition-colors sm:px-3 sm:py-1.5 sm:text-sm',
            type === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {t === 'all' ? 'All' : t === 'movies' ? 'Movies' : 'Shows'}
        </button>
      ))}
    </div>
  );
}

interface SortDropdownProps {
  sort: string;
  mediaType: SearchMediaType;
  setSort: (sort: string) => void;
  triggerClassName?: string;
}

function SortDropdown({ sort, mediaType, setSort, triggerClassName }: SortDropdownProps) {
  const sortFields = mediaType === 'shows' ? searchShowSortFields : searchMovieSortFields;

  return (
    <Select value={sort} onValueChange={setSort}>
      <SelectTrigger className={cn('h-9 border-muted/50 bg-muted/30 sm:h-10', triggerClassName)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sortFields.map((field) => (
          <SelectItem key={field} value={field}>
            {SORT_LABEL_MAP[field] ?? field}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface ViewToggleProps {
  view: SearchViewMode;
  setView: (view: SearchViewMode) => void;
}

function ViewToggle({ view, setView }: ViewToggleProps) {
  return (
    <div className="flex items-center rounded-lg border border-muted/50 bg-muted/30 p-0.5">
      <button
        type="button"
        onClick={() => setView('grid')}
        className={cn(
          'rounded-md p-2 transition-colors',
          view === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <LayoutGrid className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setView('list')}
        className={cn(
          'rounded-md p-2 transition-colors',
          view === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <List className="size-4" />
      </button>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function SearchToolbar({}: SearchToolbarProps) {
  const {
    filters,
    setSearch,
    setType,
    setSort,
    toggleSortDirection,
    setView,
    setGenres,
    setYearRange,
    setRatingMin,
    setRuntimeRange,
    setLanguage,
    setVoteCountMin,
    setProviders,
    setKeywords,
    setCertifications,
    setCast,
    setCrew,
    setNetworks,
    setStatus,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useSearchFilters();

  return (
    <div className="sticky top-14 z-20 -mx-4 space-y-3 bg-background px-4 pb-4 sm:space-y-4 md:top-16">
      {/* Row 1: Search + Filter */}
      <div className="flex items-center gap-2 sm:gap-3">
        <SmartSearch
          value={filters.q}
          onSearchChange={setSearch}
          onAddCast={(id) => setCast([...filters.cast, id])}
          onAddCrew={(id) => setCrew([...filters.crew, id])}
          onAddKeyword={(id) => setKeywords([...filters.keywords, id])}
          existingCast={filters.cast}
          existingCrew={filters.crew}
          existingKeywords={filters.keywords}
          mediaType={filters.type}
          className="min-w-0 flex-1"
        />

        <FilterSheet
          mediaType={filters.type}
          genres={filters.genres}
          yearMin={filters.yearMin}
          yearMax={filters.yearMax}
          ratingMin={filters.ratingMin}
          runtimeMin={filters.runtimeMin}
          runtimeMax={filters.runtimeMax}
          language={filters.language}
          voteCountMin={filters.voteCountMin}
          providers={filters.providers}
          keywords={filters.keywords}
          region={filters.region}
          certifications={filters.certifications}
          cast={filters.cast}
          crew={filters.crew}
          networks={filters.networks}
          status={filters.status}
          onGenresChange={setGenres}
          onYearRangeChange={setYearRange}
          onRatingMinChange={setRatingMin}
          onRuntimeRangeChange={setRuntimeRange}
          onLanguageChange={setLanguage}
          onVoteCountMinChange={setVoteCountMin}
          onProvidersChange={setProviders}
          onKeywordsChange={setKeywords}
          onCertificationsChange={setCertifications}
          onCastChange={setCast}
          onCrewChange={setCrew}
          onNetworksChange={setNetworks}
          onStatusChange={setStatus}
          onClear={clearFilters}
          activeCount={activeFilterCount}
        />
      </div>

      {/* Row 2: Type toggle + Sort controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <TypeToggle type={filters.type} setType={setType} />

        {/* Sort: joined dropdown + direction button */}
        <div className="ml-auto flex items-center">
          <SortDropdown
            sort={filters.sort}
            mediaType={filters.type}
            setSort={setSort}
            triggerClassName="rounded-r-none border-r-0"
          />
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-l-none border-muted/50 bg-muted/30 hover:bg-muted/50 sm:size-10"
            onClick={toggleSortDirection}
          >
            {filters.dir === 'asc' ? (
              <ArrowUpNarrowWide className="size-4" />
            ) : (
              <ArrowDownNarrowWide className="size-4" />
            )}
          </Button>

          <div className="ml-3 hidden sm:flex">
            <ViewToggle view={filters.view} setView={setView} />
          </div>
        </div>
      </div>

      {/* Row 3: Active Filters */}
      <ActiveFilters
        filters={filters}
        mediaType={filters.type}
        hasActiveFilters={hasActiveFilters}
        setSearch={setSearch}
        setGenres={setGenres}
        setYearRange={setYearRange}
        setRatingMin={setRatingMin}
        setRuntimeRange={setRuntimeRange}
        setLanguage={setLanguage}
        setVoteCountMin={setVoteCountMin}
        setProviders={setProviders}
        setKeywords={setKeywords}
        setCertifications={setCertifications}
        setCast={setCast}
        setCrew={setCrew}
        setNetworks={setNetworks}
        setStatus={setStatus}
        clearFilters={clearFilters}
      />
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export type { SearchToolbarProps };
export { SearchToolbar };
