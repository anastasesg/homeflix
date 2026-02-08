import { Suspense } from 'react';

import { FeaturedHome } from './_components/featured-home';
import { HomeBrowse } from './_components/home-browse';

// ============================================================================
// Main Component
// ============================================================================

export default function HomePage() {
  return (
    <Suspense>
      <FeaturedHome />
      <HomeBrowse />
    </Suspense>
  );
}
