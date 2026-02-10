'use client';

import { useQuery } from '@tanstack/react-query';
import { Languages, Tag } from 'lucide-react';

import { SectionHeader } from '@/components/media/sections/section-header';
import type { DataQueryOptions } from '@/components/media/sections/types';
import { Query } from '@/components/query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Loading
// ============================================================================

function DetailsSectionLoading() {
  return (
    <section className="space-y-6">
      <div className="flex-1">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-md" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface DetailsSectionProps {
  queryOptions: DataQueryOptions<{
    genres: string[];
    languages: string[];
  }>;
}

function DetailsSection({ queryOptions }: DetailsSectionProps) {
  const query = useQuery(queryOptions);

  return (
    <Query
      result={query}
      callbacks={{
        loading: DetailsSectionLoading,
        error: () => null,
        success: (details) => (
          <section className="space-y-6">
            {/* Genres */}
            <div className="flex-1">
              <SectionHeader icon={Tag} title="Genres" />
              <div className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
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

            {/* Languages */}
            {details.languages.length > 0 && (
              <div className="flex-1">
                <SectionHeader icon={Languages} title="Languages" />
                <div className="flex flex-wrap gap-1.5">
                  {details.languages.map((language) => (
                    <span
                      key={language}
                      className="rounded-full border border-border/40 bg-muted/20 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        ),
      }}
    />
  );
}

export type { DetailsSectionProps };
export { DetailsSection };
