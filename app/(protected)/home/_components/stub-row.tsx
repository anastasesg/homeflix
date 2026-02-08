import { cn } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Types
// ============================================================================

interface StubRowProps {
  title: string;
}

// ============================================================================
// Constants
// ============================================================================

const SKELETON_COUNT = 8;
const CARD_WIDTH = 'w-[140px] sm:w-[160px] md:w-[180px]';

// ============================================================================
// Main Component
// ============================================================================

function StubRow({ title }: StubRowProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="flex gap-3 overflow-hidden px-2 sm:gap-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('aspect-[2/3] shrink-0 rounded-xl', CARD_WIDTH)}
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    </section>
  );
}

export type { StubRowProps };
export { StubRow };
