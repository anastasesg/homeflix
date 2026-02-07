'use client';

import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { TMDBGenreItem } from '@/api/entities';
import { useInView } from '@/hooks/use-in-view';

import { Query } from '@/components/query';

import type { MediaRowProps } from './media-row';
import { MediaRow, MediaRowError, MediaRowLoading } from './media-row';

// ============================================================================
// Types
// ============================================================================

type MediaType = 'movie' | 'show';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BrowseQueryOptions = UseQueryOptions<any[], Error, any[], any>;

interface FeaturedRowConfig {
  title: string;
  queryOptions: BrowseQueryOptions;
}

interface MediaBrowseProps {
  type: MediaType;
  featuredRows: FeaturedRowConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  genresQueryOptions: UseQueryOptions<TMDBGenreItem[], Error, TMDBGenreItem[], any>;
  byGenreQueryOptions: (genreId: number) => BrowseQueryOptions;
  onApplyGenreFilter?: (genreId: number) => void;
}

// ============================================================================
// Sub-components
// ============================================================================

interface BrowseRowProps {
  type: MediaType;
  title: string;
  queryOptions: BrowseQueryOptions;
  size?: 'default' | 'lg';
  onSeeAll?: () => void;
}

function BrowseRow({ type, title, queryOptions: options, size = 'default', onSeeAll }: BrowseRowProps) {
  const query = useQuery(options);

  return (
    <Query
      result={query}
      callbacks={{
        error: (error) => <MediaRowError type={type} error={error} refetch={query.refetch} />,
        loading: () => <MediaRowLoading type={type} />,
        success: (data) => <MediaRow {...({ type, size, title, media: data, onSeeAll } as MediaRowProps)} />,
      }}
    />
  );
}

interface LazyBrowseRowProps {
  type: MediaType;
  title: string;
  queryOptions: BrowseQueryOptions;
  onSeeAll?: () => void;
}

function LazyBrowseRow({ type, title, queryOptions, onSeeAll }: LazyBrowseRowProps) {
  const { ref, isVisible } = useInView();

  return (
    <div ref={ref}>
      {isVisible ? (
        <BrowseRow type={type} title={title} queryOptions={queryOptions} onSeeAll={onSeeAll} />
      ) : (
        <MediaRowLoading type={type} />
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function MediaBrowse({
  type,
  featuredRows,
  genresQueryOptions: genresOptions,
  byGenreQueryOptions,
  onApplyGenreFilter,
}: MediaBrowseProps) {
  const genresQuery = useQuery(genresOptions);

  return (
    <div className="space-y-8">
      {featuredRows.map((row) => (
        <BrowseRow key={row.title} type={type} title={row.title} queryOptions={row.queryOptions} size="lg" />
      ))}

      <div className="border-t border-border/40" />

      <Query
        result={genresQuery}
        callbacks={{
          loading: () => (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <MediaRowLoading key={i} type={type} />
              ))}
            </div>
          ),
          error: () => null,
          success: (genres) => (
            <div className="space-y-8">
              {genres.map((genre) => (
                <LazyBrowseRow
                  key={genre.id}
                  type={type}
                  title={genre.name}
                  queryOptions={byGenreQueryOptions(genre.id)}
                  onSeeAll={onApplyGenreFilter ? () => onApplyGenreFilter(genre.id) : undefined}
                />
              ))}
            </div>
          ),
        }}
      />
    </div>
  );
}

export type { BrowseQueryOptions, FeaturedRowConfig, MediaBrowseProps };
export { MediaBrowse };
