'use client';

import { useQuery } from '@tanstack/react-query';

import type { MovieLibraryInfo } from '@/api/entities';
import { movieLibraryInfoQueryOptions } from '@/options/queries/movies/library';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Utilities
// ============================================================================

function parseQualityLabel(quality: string): string {
  const qualityLower = quality.toLowerCase();

  // Check for resolution
  let label = '';
  if (qualityLower.includes('2160')) {
    label = '4K';
  } else if (qualityLower.includes('1080')) {
    label = '1080p';
  } else if (qualityLower.includes('720')) {
    label = '720p';
  } else {
    label = quality;
  }

  // Check for HDR
  if (qualityLower.includes('hdr')) {
    label += ' HDR';
  }

  return label;
}

// ============================================================================
// Loading
// ============================================================================

function QualityBadgeLoading() {
  return <Skeleton className="h-6 w-14 rounded-md" />;
}

// ============================================================================
// Success
// ============================================================================

interface QualityBadgeSuccessProps {
  libraryInfo: MovieLibraryInfo;
}

function QualityBadgeSuccess({ libraryInfo }: QualityBadgeSuccessProps) {
  if (!libraryInfo.hasFile || !libraryInfo.quality) {
    return null;
  }

  const qualityLabel = parseQualityLabel(libraryInfo.quality);

  return (
    <span className="rounded-md border border-border/60 bg-muted/20 px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
      {qualityLabel}
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
  const query = useQuery(movieLibraryInfoQueryOptions(tmdbId));

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
