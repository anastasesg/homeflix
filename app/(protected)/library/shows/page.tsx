import { Suspense } from 'react';

import { FeaturedShow } from './_components/featured-show';
import { ShowsFilter } from './_components/shows-filter';
import { ShowsGrid } from './_components/shows-grid';

export default function ShowsPage() {
  return (
    <Suspense>
      <FeaturedShow />
      <section>
        <ShowsFilter />
        <ShowsGrid />
      </section>
    </Suspense>
  );
}
