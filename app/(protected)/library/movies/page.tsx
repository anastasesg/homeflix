import { Suspense } from 'react';

import { FeaturedMovie } from './_components/featured-movie';
import { MoviesGrid } from './_components/movies-grid';

export default function MoviesPage() {
  return (
    <Suspense>
      <FeaturedMovie />
      <MoviesGrid />
    </Suspense>
  );
}
