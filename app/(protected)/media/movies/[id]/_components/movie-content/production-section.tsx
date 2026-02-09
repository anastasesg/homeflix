'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Building2, DollarSign, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { movieProductionQueryOptions } from '@/options/queries/movies/detail';
import { formatCurrency } from '@/utilities';

import { SectionHeader } from '@/components/media/sections/section-header';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// ============================================================================
// Loading
// ============================================================================

function ProductionSectionLoading() {
  return (
    <section className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-5">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-3 w-12" />
            <Skeleton className="mt-1 h-6 w-24" />
          </div>
          <div>
            <Skeleton className="h-3 w-12" />
            <Skeleton className="mt-1 h-6 w-24" />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-5">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface ProductionData {
  budget?: number;
  revenue?: number;
  productionCompanies: Array<{ name: string; logoUrl?: string }>;
}

function ProductionSectionSuccess({ data }: { data: ProductionData }) {
  const hasFinancials = data.budget || data.revenue;
  const hasCompanies = data.productionCompanies && data.productionCompanies.length > 0;

  if (!hasFinancials && !hasCompanies) return null;

  return (
    <section className="grid gap-6 sm:grid-cols-2">
      {hasFinancials && (
        <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-5">
          <SectionHeader icon={DollarSign} title="Box Office" className="mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {data.budget && data.budget > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground/70">Budget</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(data.budget)}</p>
              </div>
            )}
            {data.revenue && data.revenue > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground/70">Revenue</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-400">
                  {formatCurrency(data.revenue)}
                </p>
              </div>
            )}
            {data.budget && data.revenue && data.budget > 0 && (
              <div className="col-span-2 border-t border-border/50 pt-3">
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className={cn('size-4', data.revenue > data.budget ? 'text-emerald-400' : 'text-red-400')}
                  />
                  <span className="text-sm text-muted-foreground">
                    {data.revenue > data.budget ? 'Profit' : 'Loss'}:{' '}
                    <span
                      className={cn('font-semibold', data.revenue > data.budget ? 'text-emerald-400' : 'text-red-400')}
                    >
                      {formatCurrency(Math.abs(data.revenue - data.budget))}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {hasCompanies && (
        <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-5">
          <SectionHeader icon={Building2} title="Production" className="mb-4" />
          <div className="flex flex-wrap items-center gap-4">
            {data.productionCompanies.map((company) => (
              <Tooltip key={company.name}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 transition-colors hover:border-border hover:bg-accent/50">
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
                </TooltipTrigger>
                <TooltipContent>{company.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
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
  const query = useQuery(movieProductionQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: ProductionSectionLoading,
        error: () => null,
        success: (data) => <ProductionSectionSuccess data={data} />,
      }}
    />
  );
}

export type { ProductionSectionProps };
export { ProductionSection };
