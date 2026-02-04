'use client';

import type { LucideIcon } from 'lucide-react';

interface GridEmptyProps {
  /** Icon to display in the empty state */
  icon: LucideIcon;
  /** Title text. Defaults to "No items found" */
  title?: string;
  /** Description text. Defaults to "Try adjusting your search or filters" */
  description?: string;
}

function GridEmpty({
  icon: Icon,
  title = 'No items found',
  description = 'Try adjusting your search or filters',
}: GridEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/20 py-20">
      <div className="rounded-full bg-muted/50 p-4">
        <Icon className="size-10 text-muted-foreground/50" />
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export { GridEmpty };
export type { GridEmptyProps };
