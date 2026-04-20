'use client';

import { useQuery } from '@tanstack/react-query';
import { DollarSign, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { movieBoxOfficeQueryOptions } from '@/options/queries/movies/detail';
import { formatCurrency } from '@/utilities';

import { SectionHeader } from '@/components/media/sections/section-header';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Loading
// ============================================================================

function BoxOfficeSectionLoading() {
  return (
    <section className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-5">
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
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface BoxOfficeData {
  budget?: number;
  revenue?: number;
}

function BoxOfficeSectionSuccess({ data }: { data: BoxOfficeData }) {
  const hasBudget = data.budget !== undefined && data.budget > 0;
  const hasRevenue = data.revenue !== undefined && data.revenue > 0;

  if (!hasBudget && !hasRevenue) return null;

  const profit = hasBudget && hasRevenue ? data.revenue! - data.budget! : null;
  const profitable = profit !== null && profit > 0;

  return (
    <section className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-5">
      <SectionHeader icon={DollarSign} title="Box Office" className="mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {hasBudget && (
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/70">Budget</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(data.budget!)}</p>
          </div>
        )}
        {hasRevenue && (
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/70">Revenue</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-500 dark:text-emerald-400">
              {formatCurrency(data.revenue!)}
            </p>
          </div>
        )}
        {profit !== null && (
          <div className="col-span-2 border-t border-border/50 pt-3">
            <div className="flex items-center gap-2">
              <TrendingUp
                className={cn('size-4', profitable ? 'text-emerald-500 dark:text-emerald-400' : 'text-destructive')}
              />
              <span className="text-sm text-muted-foreground">
                {profitable ? 'Profit' : 'Loss'}:{' '}
                <span
                  className={cn(
                    'font-semibold',
                    profitable ? 'text-emerald-500 dark:text-emerald-400' : 'text-destructive'
                  )}
                >
                  {formatCurrency(Math.abs(profit))}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface BoxOfficeSectionProps {
  tmdbId: number;
}

function BoxOfficeSection({ tmdbId }: BoxOfficeSectionProps) {
  const query = useQuery(movieBoxOfficeQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: BoxOfficeSectionLoading,
        error: () => null,
        success: (data) => <BoxOfficeSectionSuccess data={data} />,
      }}
    />
  );
}

export type { BoxOfficeSectionProps };
export { BoxOfficeSection };
