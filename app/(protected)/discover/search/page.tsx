import { Suspense } from 'react';

import { SearchResults } from './_components/search-results';
import { SearchToolbar } from './_components/search-toolbar';

export default function Page() {
  return (
    <Suspense>
      <div className="space-y-6">
        <SearchToolbar />
        <SearchResults />
      </div>
    </Suspense>
  );
}
