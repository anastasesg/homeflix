import { Suspense } from 'react';

import { FeaturedMovie } from './_components/featured-movie';
import { MoviesBrowse } from './_components/movies-browse';

// ============================================================================
// Main Component
// ============================================================================

export default function MoviesPage() {
  return (
    <Suspense>
      <FeaturedMovie />
      <MoviesBrowse />
    </Suspense>
  );
}
