import type { UseQueryOptions } from '@tanstack/react-query';

/**
 * A permissive query options type that only constrains the output data shape.
 * Accepts both direct and select-based query options from any factory function
 * without requiring type casts at the call site.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataQueryOptions<TData> = UseQueryOptions<any, Error, TData, any>;

export type { DataQueryOptions };
