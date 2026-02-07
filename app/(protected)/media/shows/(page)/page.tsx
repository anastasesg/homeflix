import { Suspense } from 'react';

import { FeaturedShow } from './_components/featured-show';
import { ShowsBrowse } from './_components/shows-browse';

// ============================================================================
// Main Component
// ============================================================================

export default function ShowsPage() {
  return (
    <Suspense>
      <FeaturedShow />
      <ShowsBrowse />
    </Suspense>
  );
}
