'use client';

import { useSearchFilters } from '@/hooks/filters';

import { SearchResults } from './search-results';
import { SearchToolbar } from './search-toolbar';

// ============================================================================
// Main
// ============================================================================

function SearchPage() {
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
    <div className="space-y-6">
      <SearchToolbar
        filters={filters}
        setSearch={setSearch}
        setType={setType}
        setSort={setSort}
        toggleSortDirection={toggleSortDirection}
        setView={setView}
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
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
      />
      <SearchResults mediaType={filters.type} filters={filters} setType={setType} />
    </div>
  );
}

export { SearchPage };
