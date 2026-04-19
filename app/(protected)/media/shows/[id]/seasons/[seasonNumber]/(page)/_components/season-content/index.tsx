'use client';

import { showProductionClusterQueryOptions, showSeasonCreditsQueryOptions } from '@/options/queries/shows/detail';

import { CastSection, ProductionSection } from '@/components/media/sections';

import { CreditsByEpisodeSection } from './credits-by-episode-section';
import { CrewSection } from './crew-section';
import { EpisodesSection } from './episodes-section';
import { GallerySection } from './gallery-section';
import { OverviewSection } from './overview-section';

// ============================================================================
// Main
// ============================================================================

interface SeasonContentProps {
  tmdbId: number;
  seasonNumber: number;
}

function SeasonContent({ tmdbId, seasonNumber }: SeasonContentProps) {
  return (
    <div className="flex flex-col space-y-8">
      <OverviewSection tmdbId={tmdbId} seasonNumber={seasonNumber} />
      <EpisodesSection tmdbId={tmdbId} seasonNumber={seasonNumber} />
      <GallerySection tmdbId={tmdbId} seasonNumber={seasonNumber} />
      <CastSection queryOptions={showSeasonCreditsQueryOptions(tmdbId, seasonNumber)} />
      <CrewSection tmdbId={tmdbId} seasonNumber={seasonNumber} />
      <CreditsByEpisodeSection tmdbId={tmdbId} seasonNumber={seasonNumber} />
      <ProductionSection queryOptions={showProductionClusterQueryOptions(tmdbId)} />
    </div>
  );
}

export type { SeasonContentProps };
export { SeasonContent };
