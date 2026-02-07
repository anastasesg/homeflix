'use client';

import { Suspense } from 'react';

import { useTVDiscoverFilters } from '@/hooks/filters/use-tv-discover-filters';

import { FeaturedShow } from './_components/featured-show';
import { ShowsGrid } from './_components/show-grid';
import { ShowsBrowse } from './_components/shows-browse';
import { ShowsFilter } from './_components/shows-filter';

// ============================================================================
// Sub-components
// ============================================================================

function ShowsPageContent() {
  const { hasActiveFilters, setGenres } = useTVDiscoverFilters();

  const handleApplyGenreFilter = (genreId: number) => {
    setGenres([genreId]);
  };

  return (
    <>
      {/* Hero — always mounted, animated collapse via grid-template-rows */}
      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        style={{
          gridTemplateRows: hasActiveFilters ? '0fr' : '1fr',
          opacity: hasActiveFilters ? 0 : 1,
        }}
      >
        <div className="overflow-hidden">
          <FeaturedShow />
        </div>
      </div>

      <section className="space-y-6">
        <div className="sticky top-[calc(env(safe-area-inset-top)+3.5rem)] z-30 -mx-4 bg-background px-4 py-2 md:top-[calc(env(safe-area-inset-top)+4rem)]">
          <ShowsFilter />
        </div>
        {hasActiveFilters ? <ShowsGrid /> : <ShowsBrowse onApplyGenreFilter={handleApplyGenreFilter} />}
      </section>
    </>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ShowsPage() {
  return (
    <Suspense>
      <ShowsPageContent />
    </Suspense>
  );
}
