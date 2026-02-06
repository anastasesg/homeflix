'use client';

import { Suspense } from 'react';

import { useDiscoverFilters } from '@/hooks/filters';

import { FeaturedMovie } from './_components/featured-movie';
import { MoviesBrowse } from './_components/movies-browse';
import { MoviesFilter } from './_components/movies-filter';
import { MoviesGrid } from './_components/movies-grid';

// ============================================================================
// Sub-components
// ============================================================================

function MoviesPageContent() {
  const { hasActiveFilters, setGenres } = useDiscoverFilters();

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
          <FeaturedMovie />
        </div>
      </div>

      <section className="space-y-6">
        <div className="sticky top-[calc(env(safe-area-inset-top)+3.5rem)] z-30 -mx-4 bg-background px-4 py-2 md:top-[calc(env(safe-area-inset-top)+4rem)]">
          <MoviesFilter />
        </div>
        {hasActiveFilters ? <MoviesGrid /> : <MoviesBrowse onApplyGenreFilter={handleApplyGenreFilter} />}
      </section>
    </>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function MoviesPage() {
  return (
    <Suspense>
      <MoviesPageContent />
    </Suspense>
  );
}
