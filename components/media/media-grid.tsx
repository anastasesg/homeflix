'use client';

import { useEffect, useRef, useState } from 'react';

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { GridEmpty } from './grid-empty';
import { GridSkeleton } from './grid-skeleton';
import type { BaseMediaItem, ViewMode } from './types';

function getColumnsForWidth(width: number): number {
  if (width >= 1280) return 6;
  if (width >= 1024) return 5;
  if (width >= 768) return 4;
  if (width >= 640) return 3;
  return 2;
}

const GAP = 16;

interface MediaGridProps<T extends BaseMediaItem> {
  /** Array of media items to display */
  items: T[];
  /** Current view mode */
  viewMode?: ViewMode;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Icon for empty state */
  emptyIcon: LucideIcon;
  /** Title for empty state */
  emptyTitle?: string;
  /** Description for empty state */
  emptyDescription?: string;
  /** Render function for grid card view */
  renderCard: (item: T, index: number) => ReactNode;
  /** Render function for list item view */
  renderListItem: (item: T, index: number) => ReactNode;
  /** Number of skeleton items to show while loading */
  skeletonCount?: number;
  /** Disable virtualization for small lists (default: 50) */
  virtualizeThreshold?: number;
}

function MediaGrid<T extends BaseMediaItem>({
  items,
  viewMode = 'grid',
  isLoading,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  renderCard,
  renderListItem,
  skeletonCount,
  virtualizeThreshold = 50,
}: MediaGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(6);
  const [scrollMargin, setScrollMargin] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateLayout = () => {
      const width = container.offsetWidth;
      // Skip update if width is 0 (element not yet laid out)
      if (width > 0) {
        setColumns(getColumnsForWidth(width));
        setScrollMargin(container.offsetTop);
      }
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [viewMode]);

  if (isLoading) {
    return <GridSkeleton viewMode={viewMode} count={skeletonCount} />;
  }

  if (items.length === 0) {
    return <GridEmpty icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  // List view - no virtualization needed for vertical lists
  if (viewMode === 'list') {
    return <div className="divide-y divide-muted/30">{items.map((item, index) => renderListItem(item, index))}</div>;
  }

  // Grid view - small collections don't need virtualization
  if (items.length <= virtualizeThreshold) {
    return (
      <div
        ref={containerRef}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {items.map((item, index) => renderCard(item, index))}
      </div>
    );
  }

  // Grid view with virtualization for large collections
  return (
    <VirtualizedGrid
      items={items}
      columns={columns}
      scrollMargin={scrollMargin}
      containerRef={containerRef}
      renderCard={renderCard}
    />
  );
}

// Separate component for virtualized grid to use hooks properly
function VirtualizedGrid<T extends BaseMediaItem>({
  items,
  columns,
  scrollMargin,
  containerRef,
  renderCard,
}: {
  items: T[];
  columns: number;
  scrollMargin: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  renderCard: (item: T, index: number) => ReactNode;
}) {
  const rowCount = Math.ceil(items.length / columns);

  const getRowHeight = () => {
    if (!containerRef.current) return 300;
    const containerWidth = containerRef.current.offsetWidth;
    const itemWidth = (containerWidth - GAP * (columns - 1)) / columns;
    return itemWidth * 1.5 + GAP;
  };

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: getRowHeight,
    overscan: 5,
    scrollMargin,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowItems = items.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="pb-4"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                }}
              >
                {rowItems.map((item, idx) => renderCard(item, startIndex + idx))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { MediaGrid };
export type { MediaGridProps };
