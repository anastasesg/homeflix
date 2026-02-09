'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';

import { movieCollectionQueryOptions } from '@/options/queries/movies/detail';

import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Loading
// ============================================================================

function CollectionSectionLoading() {
  return (
    <section className="overflow-hidden rounded-xl">
      <Skeleton className="h-[120px] w-full" />
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface CollectionSectionContentProps {
  collection: {
    id: number;
    name: string;
    posterUrl?: string;
    backdropUrl?: string;
  };
}

function CollectionSectionContent({ collection }: CollectionSectionContentProps) {
  return (
    <section className="relative min-h-[120px] overflow-hidden rounded-xl">
      {/* Backdrop image (if available) */}
      {collection.backdropUrl ? (
        <div className="absolute inset-0">
          <Image
            src={collection.backdropUrl}
            alt={collection.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            priority={false}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-muted/20" />
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

      {/* Content */}
      <div className="relative flex items-center gap-4 p-6">
        {/* Collection poster thumbnail */}
        {collection.posterUrl ? (
          <div className="relative aspect-[2/3] w-[60px] shrink-0 overflow-hidden rounded-lg ring-1 ring-border/20">
            <Image src={collection.posterUrl} alt={collection.name} fill className="object-cover" sizes="60px" />
          </div>
        ) : (
          <div className="flex aspect-[2/3] w-[60px] shrink-0 items-center justify-center rounded-lg bg-muted/50 ring-1 ring-border/20">
            <Package className="size-6 text-muted-foreground/40" />
          </div>
        )}

        {/* Text content */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Part of</p>
          <h3 className="text-lg font-semibold leading-tight">{collection.name}</h3>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface CollectionSectionProps {
  tmdbId: number;
}

function CollectionSection({ tmdbId }: CollectionSectionProps) {
  const query = useQuery(movieCollectionQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: CollectionSectionLoading,
        error: () => null,
        success: (collection) => {
          // Return null silently when collection is undefined (movie not in a collection)
          if (!collection) return null;
          return <CollectionSectionContent collection={collection} />;
        },
      }}
    />
  );
}

export type { CollectionSectionProps };
export { CollectionSection };
