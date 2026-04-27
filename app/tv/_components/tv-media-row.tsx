'use client';

import { useCallback, useRef } from 'react';

import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';

import { TvMediaCard } from './tv-card';

// ============================================================
// Types
// ============================================================

interface TvMediaItem {
  id: number;
  title: string;
  year?: number;
  posterUrl?: string;
  mediaType: 'movie' | 'show';
}

interface TvMediaRowProps {
  title: string;
  items: TvMediaItem[];
  focusKey?: string;
}

// ============================================================
// Main
// ============================================================

function TvMediaRow({ title, items, focusKey: focusKeyParam }: TvMediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { ref, focusKey } = useFocusable({
    focusKey: focusKeyParam,
    trackChildren: true,
    saveLastFocusedChild: true,
  });

  const handleCardFocus = useCallback((layout: { x: number; node: HTMLElement }) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: layout.x - 80,
      behavior: 'smooth',
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <FocusContext.Provider value={focusKey}>
      <section ref={ref} className="flex flex-col gap-4 py-4">
        <h2 className="px-12 text-2xl font-semibold">{title}</h2>
        <div ref={scrollRef} className="scrollbar-none flex gap-4 overflow-x-auto px-12">
          {items.map((item) => (
            <TvMediaCard
              key={item.id}
              id={item.id}
              title={item.title}
              year={item.year}
              posterUrl={item.posterUrl}
              mediaType={item.mediaType}
              onFocus={handleCardFocus}
            />
          ))}
        </div>
      </section>
    </FocusContext.Provider>
  );
}

export type { TvMediaItem };
export { TvMediaRow };
