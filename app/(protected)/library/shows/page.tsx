import { Suspense } from 'react';

import { FeaturedShow } from './_components/featured-show';
import { ShowsGrid } from './_components/shows-grid';

export default function ShowsPage() {
  return (
    <Suspense>
      <FeaturedShow />
      <ShowsGrid />
    </Suspense>
  );
}
