import { Suspense } from 'react';

import { FeaturedMovie } from './_components/featured-movie';
import { MoviesFilter } from './_components/movies-filter';
import { MoviesGrid } from './_components/movies-grid';

export default function MoviesPage() {
  return (
    <Suspense>
      <FeaturedMovie />
      <section>
        <MoviesFilter />
        <MoviesGrid />
      </section>
    </Suspense>
  );
}
