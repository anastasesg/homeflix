import { CastSection } from './cast-section';
import { CrewSection } from './crew-section';
import { DetailsSection } from './details-section';
import { ExternalLinksSection } from './external-links-section';
import { GallerySection } from './gallery-section';
import { OverviewSection } from './overview-section';
import { ProductionSection } from './production-section';

// ============================================================================
// Main
// ============================================================================

interface OverviewTabProps {
  tmdbId: number;
}

function OverviewTab({ tmdbId }: OverviewTabProps) {
  return (
    <div className="flex flex-col space-y-8">
      <OverviewSection tmdbId={tmdbId} />
      <GallerySection tmdbId={tmdbId} />
      <CastSection tmdbId={tmdbId} />
      <CrewSection tmdbId={tmdbId} />
      <DetailsSection tmdbId={tmdbId} />
      <ProductionSection tmdbId={tmdbId} />
      <ExternalLinksSection tmdbId={tmdbId} />
    </div>
  );
}

export type { OverviewTabProps };
export { OverviewTab };
