import type { ShowLibraryStatus } from '@/api/entities';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';

// ============================================================================
// Utilities
// ============================================================================

interface StatusConfig {
  label: string;
  className: string;
  animate?: boolean;
}

function getStatusConfig(status: ShowLibraryStatus): StatusConfig {
  switch (status) {
    case 'downloaded':
      return {
        label: 'Downloaded',
        className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      };
    case 'partial':
      return {
        label: 'Partial',
        className: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      };
    case 'downloading':
      return {
        label: 'Downloading',
        className: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
        animate: true,
      };
    case 'wanted':
      return {
        label: 'Wanted',
        className: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
      };
    case 'missing':
      return {
        label: 'Missing',
        className: 'border-red-500/30 bg-red-500/10 text-red-400',
      };
    case 'not_in_library':
      return {
        label: 'Not in Library',
        className: 'border-border bg-muted/50 text-muted-foreground',
      };
  }
}

// ============================================================================
// Main
// ============================================================================

interface StatusPillProps {
  status: ShowLibraryStatus;
}

function StatusPill({ status }: StatusPillProps) {
  const config = getStatusConfig(status);

  return <Badge className={cn(config.className, config.animate && 'animate-pulse')}>{config.label}</Badge>;
}

export type { StatusPillProps };
export { StatusPill };
