'use client';

import { useRouter } from 'next/navigation';

import {
  airingTodayShowsQueryOptions,
  hiddenGemShowsQueryOptions,
  onTheAirShowsQueryOptions,
  showsByGenreQueryOptions,
  topRatedShowsQueryOptions,
  trendingShowsQueryOptions,
} from '@/options/queries/shows/discover';
import { showGenresQueryOptions } from '@/options/queries/shows/metadata';

import type { FeaturedRowConfig } from '@/components/media';
import { MediaBrowse } from '@/components/media';

// ============================================================================
// Constants
// ============================================================================

const FEATURED_ROWS: FeaturedRowConfig[] = [
  { title: 'Trending This Week', queryOptions: trendingShowsQueryOptions() },
  { title: 'Top Rated', queryOptions: topRatedShowsQueryOptions() },
  { title: 'On The Air', queryOptions: onTheAirShowsQueryOptions() },
  { title: 'Airing Today', queryOptions: airingTodayShowsQueryOptions() },
  { title: 'Hidden Gems', queryOptions: hiddenGemShowsQueryOptions() },
];

// ============================================================================
// Main Component
// ============================================================================

type ShowsBrowseProps = object;

function ShowsBrowse(_props: ShowsBrowseProps) {
  const router = useRouter();

  const handleApplyGenreFilter = (genreId: number) => {
    router.push(`/discover/search?type=shows&genres=${genreId}`);
  };

  return (
    <MediaBrowse
      type="show"
      featuredRows={FEATURED_ROWS}
      genresQueryOptions={showGenresQueryOptions()}
      byGenreQueryOptions={showsByGenreQueryOptions}
      onApplyGenreFilter={handleApplyGenreFilter}
    />
  );
}

export type { ShowsBrowseProps };
export { ShowsBrowse };
