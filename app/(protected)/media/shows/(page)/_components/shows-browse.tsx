'use client';

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

interface ShowsBrowseProps {
  onApplyGenreFilter?: (genreId: number) => void;
}

function ShowsBrowse({ onApplyGenreFilter }: ShowsBrowseProps) {
  return (
    <MediaBrowse
      type="show"
      featuredRows={FEATURED_ROWS}
      genresQueryOptions={showGenresQueryOptions()}
      byGenreQueryOptions={showsByGenreQueryOptions}
      onApplyGenreFilter={onApplyGenreFilter}
    />
  );
}

export type { ShowsBrowseProps };
export { ShowsBrowse };
