import { CastSection } from './cast-section';
import { CrewSection } from './crew-section';
import { GallerySection } from './gallery-section';
import { OverviewSection } from './overview-section';

// ============================================================================
// Main
// ============================================================================

interface OverviewTabProps {
  tmdbId: number;
  seasonNumber: number;
}

function OverviewTab({ tmdbId, seasonNumber }: OverviewTabProps) {
  return (
    <div className="flex flex-col space-y-8">
      <OverviewSection tmdbId={tmdbId} seasonNumber={seasonNumber} />
      <GallerySection tmdbId={tmdbId} seasonNumber={seasonNumber} />
      <CastSection tmdbId={tmdbId} seasonNumber={seasonNumber} />
      <CrewSection tmdbId={tmdbId} seasonNumber={seasonNumber} />
    </div>
  );
}

export type { OverviewTabProps };
export { OverviewTab };
