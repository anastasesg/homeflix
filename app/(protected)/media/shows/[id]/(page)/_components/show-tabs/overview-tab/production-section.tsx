import Image from 'next/image';

import { Building2 } from 'lucide-react';

import { type ShowBasic } from '@/api/entities';

import { SectionHeader } from './section-header';

// ============================================================================
// Main
// ============================================================================

interface ProductionSectionProps {
  companies: ShowBasic['productionCompanies'];
}

function ProductionSection({ companies }: ProductionSectionProps) {
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
}

export type { ProductionSectionProps };
export { ProductionSection };
