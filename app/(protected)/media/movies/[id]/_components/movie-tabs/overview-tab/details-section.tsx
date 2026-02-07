'use client';

import { useQuery } from '@tanstack/react-query';
import { Tag } from 'lucide-react';

import { movieDetailGenresQueryOptions } from '@/options/queries/movies/detail';

import { Query } from '@/components/query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { KeywordsSection } from './keywords-section';
import { SectionHeader } from './section-header';

// ============================================================================
// Loading
// ============================================================================

function DetailsSectionLoading() {
  return (
    <section className="flex flex-col gap-6 sm:flex-row sm:gap-12">
      <div className="flex-1">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

function DetailsSectionSuccess({ genres }: { genres: string[] }) {
  return (
    <div className="flex-1">
      <SectionHeader icon={Tag} title="Genres" />
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
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
  );
}

// ============================================================================
// Main
// ============================================================================

interface DetailsSectionProps {
  tmdbId: number;
}

function DetailsSection({ tmdbId }: DetailsSectionProps) {
  const query = useQuery(movieDetailGenresQueryOptions(tmdbId));

  return (
    <section className="flex flex-col gap-6 sm:flex-row sm:gap-12">
      <Query
        result={query}
        callbacks={{
          loading: DetailsSectionLoading,
          error: () => null,
          success: (genres) => <DetailsSectionSuccess genres={genres} />,
        }}
      />
      <KeywordsSection tmdbId={tmdbId} />
    </section>
  );
}

export type { DetailsSectionProps };
export { DetailsSection };
