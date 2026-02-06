'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueriesResults = readonly UseQueryResult<any, any>[];

/**
 * Maps a tuple of UseQueryResult types to a tuple of their data types.
 * [UseQueryResult<A>, UseQueryResult<B>] → [A, B]
 */
type ExtractAllData<T extends QueriesResults> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends UseQueryResult<infer TData, any> ? TData : never;
};

/**
 * Extracts the union of all error types from a tuple of UseQueryResult types.
 * [UseQueryResult<any, E1>, UseQueryResult<any, E2>] → E1 | E2
 */
type ExtractErrorUnion<T extends QueriesResults> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends UseQueryResult<any, infer TError> ? TError : never;
}[number];

/**
 * Render callbacks for combined query state.
 */
interface QueriesCallbacks<TQueries extends QueriesResults> {
  /** Render when any query is still loading (no cached data) */
  loading: () => ReactNode;
  /** Render when any query has errored */
  error: (error: ExtractErrorUnion<TQueries>) => ReactNode;
  /** Render when all queries have data */
  success: (data: ExtractAllData<TQueries>, meta: { isRefetching: boolean }) => ReactNode;
}

interface QueriesProps<TQueries extends QueriesResults> {
  /** Tuple of query results from useQuery */
  results: readonly [...TQueries];
  /** Render callbacks for each combined state */
  callbacks: QueriesCallbacks<TQueries>;
}

/**
 * A typesafe component that renders different UI based on the combined state
 * of two or more queries.
 *
 * Follows the same "stale-while-revalidate" pattern as Query:
 * - Shows loading when any query has no cached data yet
 * - Shows the first error encountered
 * - Shows success only when all queries have data
 * - Passes isRefetching (true if any query is background-fetching)
 *
 * @example
 * ```tsx
 * <Queries
 *   results={[movieQuery, creditsQuery] as const}
 *   callbacks={{
 *     loading: () => <Skeleton />,
 *     error: (e) => <Error message={e.message} />,
 *     success: ([movie, credits], { isRefetching }) => (
 *       <>
 *         {isRefetching && <LoadingOverlay />}
 *         <MovieDetail movie={movie} credits={credits} />
 *       </>
 *     ),
 *   }}
 * />
 * ```
 */
function Queries<TQueries extends QueriesResults>({ results, callbacks }: QueriesProps<TQueries>) {
  // Any query still in initial loading state → loading
  if (results.some((r) => r.isLoading)) {
    return callbacks.loading();
  }

  // First errored query → error
  const errored = results.find((r) => r.isError && r.error);
  if (errored) {
    return callbacks.error(errored.error);
  }

  // All queries have data → success
  const allData = results.map((r) => r.data);
  if (allData.every((d) => d !== undefined)) {
    const isRefetching = results.some((r) => r.isFetching);
    return callbacks.success(allData as ExtractAllData<TQueries>, { isRefetching });
  }

  return null;
}

export type { QueriesCallbacks, QueriesProps };
export { Queries };
