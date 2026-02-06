import { cn } from '@/lib/utils';

// ============================================================
// Main Component
// ============================================================

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  count?: number;
  className?: string;
}

function SectionHeader({ icon: Icon, title, count, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-center gap-2', className)}>
      <Icon className="size-4 text-amber-500/80" />
      <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  );
}

export type { SectionHeaderProps };
export { SectionHeader };
