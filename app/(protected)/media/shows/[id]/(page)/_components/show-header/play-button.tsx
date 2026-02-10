'use client';

import { useQuery } from '@tanstack/react-query';
import { Play } from 'lucide-react';

import type { ShowLibraryInfo } from '@/api/entities';
import { showLibraryInfoQueryOptions } from '@/options/queries/shows/library';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Utilities
// ============================================================================

function getNextEpisode(libraryInfo: ShowLibraryInfo): { season: number; episode: number } | null {
  // Filter out season 0 (specials) and find the earliest incomplete season
  const regularSeasons = libraryInfo.seasons
    .filter((s) => s.seasonNumber > 0)
    .sort((a, b) => a.seasonNumber - b.seasonNumber);

  for (const season of regularSeasons) {
    if (season.episodeFileCount < season.episodeCount) {
      // Found an incomplete season - next episode is episodeFileCount + 1
      return {
        season: season.seasonNumber,
        episode: season.episodeFileCount + 1,
      };
    }
  }

  // All seasons complete - suggest rewatching from S1E1
  if (regularSeasons.length > 0) {
    return { season: 1, episode: 1 };
  }

  return null;
}

// ============================================================================
// Loading
// ============================================================================

function PlayButtonLoading() {
  return <Skeleton className="h-11 w-32 rounded-full" />;
}

// ============================================================================
// Success
// ============================================================================

interface PlayButtonSuccessProps {
  libraryInfo: ShowLibraryInfo;
}

function PlayButtonSuccess({ libraryInfo }: PlayButtonSuccessProps) {
  if (!libraryInfo.inLibrary || libraryInfo.downloadedEpisodes === 0) {
    return null;
  }

  const nextEpisode = getNextEpisode(libraryInfo);
  if (!nextEpisode) {
    return null;
  }

  return (
    <Button size="lg" className="gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90">
      <Play className="size-5 fill-current" />
      Play S{nextEpisode.season} E{nextEpisode.episode}
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
  const query = useQuery(showLibraryInfoQueryOptions(tmdbId));

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
