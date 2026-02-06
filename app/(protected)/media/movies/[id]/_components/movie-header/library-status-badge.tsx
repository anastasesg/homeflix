'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, Film, HardDrive, Plus } from 'lucide-react';

import { type LibraryInfo } from '@/api/entities';
import { cn } from '@/lib/utils';
import { movieLibraryInfoQueryOptions } from '@/options/queries/movies/library';

import { Query } from '@/components/query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Loading
// ============================================================================

function LibraryStatusBadgeLoading() {
  return <Skeleton className="h-8 w-24" />;
}

// ============================================================================
// Success
// ============================================================================

interface LibraryStatusBadgeSuccessProps {
  libraryInfo: LibraryInfo;
}

function LibraryStatusBadgeSuccess({ libraryInfo }: LibraryStatusBadgeSuccessProps) {
  if (!libraryInfo.inLibrary) {
    return (
      <Button variant="outline" size="sm" className="gap-2 border-border hover:bg-muted">
        <Plus className="size-4" />
        Add to Library
      </Button>
    );
  }

  const { status, quality } = libraryInfo;

  const statusConfig = {
    downloaded: { label: 'Downloaded', className: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
    downloading: { label: 'Downloading', className: 'bg-blue-500/20 text-blue-400', icon: HardDrive },
    wanted: { label: 'Wanted', className: 'bg-amber-500/20 text-amber-400', icon: Clock },
    missing: { label: 'Missing', className: 'bg-red-500/20 text-red-400', icon: Film },
    not_in_library: { label: 'Not in Library', className: 'bg-muted text-muted-foreground', icon: Plus },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex items-center gap-2">
      <Badge className={cn('gap-1.5 shadow-lg', statusConfig.className)}>
        <StatusIcon className="size-3" />
        {statusConfig.label}
      </Badge>
      {quality && status === 'downloaded' && (
        <Badge variant="outline" className="border-border text-xs">
          {quality}
        </Badge>
      )}
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface LibraryStatusBadgeProps {
  tmdbId: number;
}

function LibraryStatusBadge({ tmdbId }: LibraryStatusBadgeProps) {
  const query = useQuery(movieLibraryInfoQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: LibraryStatusBadgeLoading,
        error: () => null,
        success: (data) => <LibraryStatusBadgeSuccess libraryInfo={data} />,
      }}
    />
  );
}

export type { LibraryStatusBadgeProps };
export { LibraryStatusBadge };
