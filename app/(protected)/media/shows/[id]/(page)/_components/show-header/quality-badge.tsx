'use client';

import { useQuery } from '@tanstack/react-query';

import type { ShowLibraryInfo } from '@/api/entities';
import { showLibraryInfoQueryOptions } from '@/options/queries/shows/library';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Utilities
// ============================================================================

const QUALITY_PROFILES = new Map<number, string>([
  [1, 'Any'],
  [2, 'SD'],
  [3, 'HD-720p'],
  [4, 'HD-1080p'],
  [5, 'Ultra-HD'],
  [6, 'HD - 720p/1080p'],
]);

function getQualityProfileName(id: number): string {
  return QUALITY_PROFILES.get(id) ?? `Quality: ${id}`;
}

// ============================================================================
// Loading
// ============================================================================

function QualityBadgeLoading() {
  return <Skeleton className="h-6 w-20 rounded-md" />;
}

// ============================================================================
// Success
// ============================================================================

interface QualityBadgeSuccessProps {
  libraryInfo: ShowLibraryInfo;
}

function QualityBadgeSuccess({ libraryInfo }: QualityBadgeSuccessProps) {
  if (!libraryInfo.inLibrary || !libraryInfo.qualityProfileId) {
    return null;
  }

  return (
    <span className="rounded-md border border-border/60 bg-muted/20 px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
      {getQualityProfileName(libraryInfo.qualityProfileId)}
    </span>
  );
}

// ============================================================================
// Main
// ============================================================================

interface QualityBadgeProps {
  tmdbId: number;
}

function QualityBadge({ tmdbId }: QualityBadgeProps) {
  const query = useQuery(showLibraryInfoQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: QualityBadgeLoading,
        error: () => null,
        success: (data) => <QualityBadgeSuccess libraryInfo={data} />,
      }}
    />
  );
}

export type { QualityBadgeProps };
export { QualityBadge };
