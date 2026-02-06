import { Tag } from 'lucide-react';

import { type MovieBasic } from '@/api/entities';

import { Badge } from '@/components/ui/badge';

import { KeywordsSection } from './keywords-section';
import { SectionHeader } from './section-header';

// ============================================================================
// Main
// ============================================================================

interface DetailsSectionProps {
  movie: MovieBasic;
  tmdbId: number;
}

function DetailsSection({ movie, tmdbId }: DetailsSectionProps) {
  return (
    <section className="flex flex-col gap-6 sm:flex-row sm:gap-12">
      <div className="flex-1">
        <SectionHeader icon={Tag} title="Genres" />
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="border border-border/40 bg-muted/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/40"
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>
      <KeywordsSection tmdbId={tmdbId} />
    </section>
  );
}

export type { DetailsSectionProps };
export { DetailsSection };
