'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractError<TQuery extends UseQueryResult<any, any>> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TQuery extends UseQueryResult<any, infer TError> ? TError : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractData<TQuery extends UseQueryResult<any, any>> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TQuery extends UseQueryResult<infer TData, any> ? TData : never;

/**
 * Render callbacks for each query state.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface QueryCallbacks<TQuery extends UseQueryResult<any, any>> {
  /** Render when query is loading (no cached data) */
  loading: () => ReactNode;
  /** Render when query has errored */
  error: (error: ExtractError<TQuery>) => ReactNode;
  /** Render when query has data (includes stale data during refetch) */
  success: (data: ExtractData<TQuery>, meta: { isRefetching: boolean }) => ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface QueryProps<TQuery extends UseQueryResult<any, any>> {
  /** The query result from useQuery */
  result: TQuery;
  /** Render callbacks for each state */
  callbacks: QueryCallbacks<TQuery>;
}

/**
 * A typesafe component that renders different UI based on query state.
 *
 * Follows the "stale-while-revalidate" pattern:
 * - Shows loading only when there's no cached data
 * - Shows cached data during background refetches
 * - Passes isRefetching flag so you can show a loading indicator overlay
 *
 * @example
 * ```tsx
 * <Query
 *   result={query}
 *   callbacks={{
 *     loading: () => <Skeleton />,
 *     error: (e) => <Error message={e.message} />,
 *     success: (data, { isRefetching }) => (
 *       <>
 *         {isRefetching && <LoadingOverlay />}
 *         <DataGrid data={data} />
 *       </>
 *     ),
 *   }}
 * />
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Query<TQuery extends UseQueryResult<any, any>>({ result, callbacks }: QueryProps<TQuery>) {
  const { data, isLoading, isError, error, isFetching } = result;

  // Initial loading state (no data yet)
  if (isLoading) {
    return callbacks.loading();
  }

  // Error state - show error UI
  if (isError && error) {
    return callbacks.error(error);
  }

  // Success state - includes stale data during refetch
  if (data !== undefined) {
    return callbacks.success(data, { isRefetching: isFetching });
  }

  // Edge case: no data, not loading, not error (shouldn't happen normally)
  return null;
}

export type { QueryCallbacks, QueryProps };
export { Query };
