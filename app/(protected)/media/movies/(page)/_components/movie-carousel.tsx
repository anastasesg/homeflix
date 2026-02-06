'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface MovieCarouselProps {
  children: ReactNode;
  className?: string;
}

// ============================================================================
// Main Component
// ============================================================================

function MovieCarousel({ children, className }: MovieCarouselProps) {
  return (
    <div className={cn('relative -mx-2', className)}>
      <div
        className="flex touch-pan-x gap-3 overflow-x-auto px-2 py-2 scrollbar-none sm:gap-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>
    </div>
  );
}

export type { MovieCarouselProps };
export { MovieCarousel };
