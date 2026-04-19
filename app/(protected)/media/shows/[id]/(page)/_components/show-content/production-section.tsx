'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Building2, Tv } from 'lucide-react';

import type { ShowDetail } from '@/api/entities';

import { SectionHeader } from '@/components/media/sections/section-header';
import type { DataQueryOptions } from '@/components/media/sections/types';
import { Query } from '@/components/query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// ============================================================================
// Types
// ============================================================================

interface ProductionData {
  createdBy: ShowDetail['createdBy'];
  networks: ShowDetail['networks'];
  productionCompanies: ShowDetail['productionCompanies'];
  genres: string[];
  languages: string[];
}

// ============================================================================
// Utilities
// ============================================================================

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ============================================================================
// Sub-components
// ============================================================================

interface RowProps {
  label: string;
  children: React.ReactNode;
}

function Row({ label, children }: RowProps) {
  return (
    <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[140px_1fr] md:items-start md:gap-8">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground md:pt-1.5">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

interface CreatorCardProps {
  name: string;
  profileUrl?: string;
}

function CreatorCard({ name, profileUrl }: CreatorCardProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group flex items-center gap-3 rounded-lg border border-border/60 p-2.5 transition-all duration-200 hover:border-border hover:bg-accent/50 hover:shadow-sm hover:shadow-black/5 dark:hover:shadow-black/20">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border/60">
            {profileUrl ? (
              <Image src={profileUrl} alt={name} fill className="object-cover" sizes="40px" />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-xs font-medium text-muted-foreground/60">{getInitials(name)}</span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
              {name}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span className="font-medium">{name}</span>
      </TooltipContent>
    </Tooltip>
  );
}

interface NetworkBadgeProps {
  network: ShowDetail['networks'][number];
}

function NetworkBadge({ network }: NetworkBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/10 bg-muted/10 px-4 py-2.5">
      {network.logoUrl ? (
        <div className="relative h-5 w-14 shrink-0">
          <Image src={network.logoUrl} alt={network.name} fill className="object-contain" sizes="56px" />
        </div>
      ) : (
        <Tv className="size-4 text-muted-foreground/40" />
      )}
      <span className="text-sm font-medium text-foreground">{network.name}</span>
    </div>
  );
}

interface CompanyBadgeProps {
  company: ShowDetail['productionCompanies'][number];
}

function CompanyBadge({ company }: CompanyBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 transition-colors hover:border-border hover:bg-accent/50">
      {company.logoUrl ? (
        <div className="relative h-4 w-10">
          <Image src={company.logoUrl} alt={company.name} fill className="object-contain" sizes="40px" />
        </div>
      ) : (
        <Building2 className="size-3.5 text-muted-foreground" />
      )}
      <span className="text-xs font-medium">{company.name}</span>
    </div>
  );
}

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
      <div className="divide-y divide-border/30 border-y border-border/30">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[140px_1fr] md:gap-8">
            <Skeleton className="h-3 w-20" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-40 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface ProductionSectionSuccessProps {
  data: ProductionData;
}

function ProductionSectionSuccess({ data }: ProductionSectionSuccessProps) {
  const { createdBy, networks, productionCompanies, genres, languages } = data;

  const hasAnything =
    createdBy.length > 0 ||
    networks.length > 0 ||
    productionCompanies.length > 0 ||
    genres.length > 0 ||
    languages.length > 0;

  if (!hasAnything) return null;

  return (
    <section>
      <SectionHeader icon={Building2} title="Production" />

      <dl className="divide-y divide-border/30 border-y border-border/30">
        {createdBy.length > 0 && (
          <Row label="Created By">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {createdBy.map((creator) => (
                <CreatorCard key={creator.name} name={creator.name} profileUrl={creator.profileUrl} />
              ))}
            </div>
          </Row>
        )}

        {networks.length > 0 && (
          <Row label="Networks">
            <div className="flex flex-wrap gap-2.5">
              {networks.map((network) => (
                <NetworkBadge key={network.name} network={network} />
              ))}
            </div>
          </Row>
        )}

        {productionCompanies.length > 0 && (
          <Row label="Companies">
            <div className="flex flex-wrap items-center gap-2">
              {productionCompanies.map((company) => (
                <CompanyBadge key={company.name} company={company} />
              ))}
            </div>
          </Row>
        )}

        {genres.length > 0 && (
          <Row label="Genres">
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
          </Row>
        )}

        {languages.length > 0 && (
          <Row label="Languages">
            <div className="flex flex-wrap gap-1.5">
              {languages.map((language) => (
                <span
                  key={language}
                  className="rounded-full border border-border/40 bg-muted/20 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                >
                  {language}
                </span>
              ))}
            </div>
          </Row>
        )}
      </dl>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface ProductionSectionProps {
  queryOptions: DataQueryOptions<ProductionData>;
}

function ProductionSection({ queryOptions }: ProductionSectionProps) {
  const query = useQuery(queryOptions);

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
