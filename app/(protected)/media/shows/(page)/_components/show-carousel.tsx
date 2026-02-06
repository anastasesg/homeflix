'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface ShowCarouselProps {
  children: ReactNode;
  className?: string;
}

// ============================================================================
// Main Component
// ============================================================================

function ShowCarousel({ children, className }: ShowCarouselProps) {
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

export type { ShowCarouselProps };
export { ShowCarousel };
