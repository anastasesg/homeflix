'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Tv } from 'lucide-react';

import type { ShowDetail } from '@/api/entities/shows/show-detail';

import { SectionHeader } from '@/components/media/sections/section-header';
import type { DataQueryOptions } from '@/components/media/sections/types';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Sub-Components
// ============================================================================

interface NetworkBadgeProps {
  network: { name: string; logoUrl?: string };
}

function NetworkBadge({ network }: NetworkBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/10 bg-muted/10 px-4 py-3">
      {network.logoUrl ? (
        <div className="relative h-6 w-16 shrink-0">
          <Image src={network.logoUrl} alt={network.name} fill className="object-contain" sizes="64px" />
        </div>
      ) : (
        <Tv className="size-5 text-muted-foreground/40" />
      )}
      <span className="text-sm font-medium text-foreground">{network.name}</span>
    </div>
  );
}

// ============================================================================
// Loading
// ============================================================================

function NetworkSectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-32 rounded-xl" />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface NetworkSectionContentProps {
  networks: ShowDetail['networks'];
}

function NetworkSectionContent({ networks }: NetworkSectionContentProps) {
  if (networks.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={Tv} title="Networks" count={networks.length} />
      <div className="flex flex-wrap gap-3">
        {networks.map((network) => (
          <NetworkBadge key={network.name} network={network} />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface NetworkSectionProps {
  queryOptions: DataQueryOptions<ShowDetail['networks']>;
}

function NetworkSection({ queryOptions }: NetworkSectionProps) {
  const query = useQuery(queryOptions);

  return (
    <Query
      result={query}
      callbacks={{
        loading: NetworkSectionLoading,
        error: () => null,
        success: (networks) => <NetworkSectionContent networks={networks} />,
      }}
    />
  );
}

export type { NetworkSectionProps };
export { NetworkSection };
