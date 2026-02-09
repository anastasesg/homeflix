'use client';

import { useQuery } from '@tanstack/react-query';
import { Play } from 'lucide-react';

import type { MovieLibraryInfo } from '@/api/entities';
import { movieLibraryInfoQueryOptions } from '@/options/queries/movies/library';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Loading
// ============================================================================

function PlayButtonLoading() {
  return <Skeleton className="h-11 w-24 rounded-full" />;
}

// ============================================================================
// Success
// ============================================================================

interface PlayButtonSuccessProps {
  libraryInfo: MovieLibraryInfo;
}

function PlayButtonSuccess({ libraryInfo }: PlayButtonSuccessProps) {
  if (libraryInfo.status !== 'downloaded') {
    return null;
  }

  return (
    <Button size="lg" className="gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90">
      <Play className="size-5 fill-current" />
      Play
    </Button>
  );
}

// ============================================================================
// Main
// ============================================================================

interface PlayButtonProps {
  tmdbId: number;
}

function PlayButton({ tmdbId }: PlayButtonProps) {
  const query = useQuery(movieLibraryInfoQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: PlayButtonLoading,
        error: () => null,
        success: (data) => <PlayButtonSuccess libraryInfo={data} />,
      }}
    />
  );
}

export type { PlayButtonProps };
export { PlayButton };
