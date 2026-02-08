'use client';

import { Film, Tv } from 'lucide-react';

import { type SearchFilterState, useSearchFilters } from '@/hooks/filters';

import { SearchGrid } from './search-grid';

// ============================================================================
// Types
// ============================================================================

type SearchResultsProps = object;

// ============================================================================
// Sub-components
// ============================================================================

function PreviewSection({
  title,
  icon: Icon,
  mediaType,
  filters,
  onViewAll,
}: {
  title: string;
  icon: React.ElementType;
  mediaType: 'movies' | 'shows';
  filters: SearchFilterState;
  onViewAll: () => void;
}) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Icon className="size-5 text-muted-foreground" />
        {title}
      </h2>
      <SearchGrid mediaType={mediaType} filters={filters} preview onViewAll={onViewAll} />
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

function SearchResults(_props: SearchResultsProps) {
  const { filters, setType } = useSearchFilters();
  if (filters.type === 'all') {
    return (
      <div className="space-y-10">
        <PreviewSection
          title="Movies"
          icon={Film}
          mediaType="movies"
          filters={filters}
          onViewAll={() => setType('movies')}
        />
        <PreviewSection
          title="Shows"
          icon={Tv}
          mediaType="shows"
          filters={filters}
          onViewAll={() => setType('shows')}
        />
      </div>
    );
  }

  return <SearchGrid mediaType={filters.type} filters={filters} />;
}

// ============================================================================
// Exports
// ============================================================================

export type { SearchResultsProps };
export { SearchResults };
