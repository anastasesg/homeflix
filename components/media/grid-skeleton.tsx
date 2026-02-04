'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';

import type { ViewMode } from './types';

interface GridSkeletonProps {
  viewMode?: ViewMode;
  /** Number of skeleton items to render. Defaults to 12 for grid, 8 for list. */
  count?: number;
}

function GridSkeleton({ viewMode = 'grid', count }: GridSkeletonProps) {
  if (viewMode === 'list') {
    const listCount = count ?? 8;
    return (
      <div className="space-y-2">
        {Array.from({ length: listCount }).map((_, i) => (
          <div
            key={i}
            className="flex h-20 animate-pulse gap-4 rounded-lg bg-muted/50 p-2"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="h-full w-12 rounded bg-muted" />
            <div className="flex flex-1 flex-col justify-center gap-2">
              <div className="h-4 w-48 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const gridCount = count ?? 12;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: gridCount }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl bg-muted/50"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <AspectRatio ratio={2 / 3}>
            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50" />
          </AspectRatio>
        </div>
      ))}
    </div>
  );
}

export { GridSkeleton };
export type { GridSkeletonProps };
