'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';

import { showProductionQueryOptions } from '@/options/queries/shows/detail';

import { SectionHeader } from '@/components/media/sections/section-header';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Loading
// ============================================================================

function ProductionSectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-32 rounded-lg" />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface ProductionSectionProps {
  tmdbId: number;
}

function ProductionSection({ tmdbId }: ProductionSectionProps) {
  const query = useQuery(showProductionQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: ProductionSectionLoading,
        error: () => null,
        success: (companies) => {
          if (companies.length === 0) return null;

          return (
            <section>
              <SectionHeader icon={Building2} title="Production" />
              <div className="flex flex-wrap items-center gap-3">
                {companies.map((company) => (
                  <div
                    key={company.name}
                    className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 transition-colors hover:border-border hover:bg-accent/50"
                  >
                    {company.logoUrl ? (
                      <div className="relative h-5 w-12">
                        <Image
                          src={company.logoUrl}
                          alt={company.name}
                          fill
                          className="object-contain brightness-0 invert"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <Building2 className="size-4 text-muted-foreground" />
                    )}
                    <span className="text-xs font-medium">{company.name}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        },
      }}
    />
  );
}

export type { ProductionSectionProps };
export { ProductionSection };
