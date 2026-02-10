import type { MovieLibraryStatus } from '@/api/entities';

import { Badge } from '@/components/ui/badge';

// ============================================================================
// Utilities
// ============================================================================

interface StatusConfig {
  label: string;
  className: string;
  animate?: boolean;
}

function getStatusConfig(status: MovieLibraryStatus): StatusConfig {
  switch (status) {
    case 'downloaded':
      return {
        label: 'Downloaded',
        className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
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
        className: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
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
  status: MovieLibraryStatus;
}

function StatusPill({ status }: StatusPillProps) {
  const config = getStatusConfig(status);

  return <Badge className={`${config.className} ${config.animate ? 'animate-pulse' : ''}`}>{config.label}</Badge>;
}

export type { StatusPillProps };
export { StatusPill };
