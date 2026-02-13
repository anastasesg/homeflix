'use client';

import { useMemo } from 'react';

import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ContextRule } from '@/lib/contextual';
import { getActiveRules } from '@/lib/contextual';
import { contextualMoviesQueryOptions } from '@/options/queries/movies/contextual';
import { contextualShowsQueryOptions } from '@/options/queries/shows/contextual';

import type { MediaRowProps } from '@/components/media';
import { MediaRow, MediaRowError, MediaRowLoading } from '@/components/media';
import { Query } from '@/components/query';

// ============================================================================
// Types
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BrowseQueryOptions = UseQueryOptions<any[], Error, any[], any>;

interface ContextualRowProps {
  type: 'movie' | 'show';
  title: string;
  queryOptions: BrowseQueryOptions;
}

type HomeContextualProps = object;

// ============================================================================
// Sub-components
// ============================================================================

function ContextualRow({ type, title, queryOptions: options }: ContextualRowProps) {
  const query = useQuery(options);

  return (
    <Query
      result={query}
      callbacks={{
        error: (error) => <MediaRowError type={type} error={error} refetch={query.refetch} />,
        loading: () => <MediaRowLoading type={type} />,
        success: (data) => <MediaRow {...({ type, size: 'lg', title, media: data } as MediaRowProps)} />,
      }}
    />
  );
}

function ContextualRuleRows({ rule }: { rule: ContextRule }) {
  return (
    <>
      <ContextualRow
        type="movie"
        title={rule.title.movies}
        queryOptions={contextualMoviesQueryOptions(rule.id, rule.filters.movies) as BrowseQueryOptions}
      />
      <ContextualRow
        type="show"
        title={rule.title.shows}
        queryOptions={contextualShowsQueryOptions(rule.id, rule.filters.shows) as BrowseQueryOptions}
      />
    </>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function HomeContextual(_props: HomeContextualProps) {
  const activeRules = useMemo(() => getActiveRules(), []);

  if (activeRules.length === 0) return null;

  return (
    <>
      {activeRules.map((rule) => (
        <ContextualRuleRows key={rule.id} rule={rule} />
      ))}
    </>
  );
}

export type { HomeContextualProps };
export { HomeContextual };
