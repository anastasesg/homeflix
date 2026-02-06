'use client';

import Image from 'next/image';

import { Building2, DollarSign, TrendingUp } from 'lucide-react';

import { type MovieBasic } from '@/api/entities';

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utilities';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { SectionHeader } from './section-header';

// ================================================================
// Main Component
// ================================================================

interface ProductionSectionProps {
  movie: MovieBasic;
}

function ProductionSection({ movie }: ProductionSectionProps) {
  const hasFinancials = movie.budget || movie.revenue;
  const hasCompanies = movie.productionCompanies && movie.productionCompanies.length > 0;

  if (!hasFinancials && !hasCompanies) return null;

  return (
    <section className="grid gap-6 sm:grid-cols-2">
      {hasFinancials && (
        <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-transparent p-5">
          <SectionHeader icon={DollarSign} title="Box Office" className="mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {movie.budget && movie.budget > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground/70">Budget</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(movie.budget)}</p>
              </div>
            )}
            {movie.revenue && movie.revenue > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground/70">Revenue</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-400">
                  {formatCurrency(movie.revenue)}
                </p>
              </div>
            )}
            {movie.budget && movie.revenue && movie.budget > 0 && (
              <div className="col-span-2 border-t border-border/50 pt-3">
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className={cn('size-4', movie.revenue > movie.budget ? 'text-emerald-400' : 'text-red-400')}
                  />
                  <span className="text-sm text-muted-foreground">
                    {movie.revenue > movie.budget ? 'Profit' : 'Loss'}:{' '}
                    <span
                      className={cn(
                        'font-semibold',
                        movie.revenue > movie.budget ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {formatCurrency(Math.abs(movie.revenue - movie.budget))}
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
            {movie.productionCompanies.map((company) => (
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

export type { ProductionSectionProps };
export { ProductionSection };
