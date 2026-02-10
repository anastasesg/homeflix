'use client';

import { useQuery } from '@tanstack/react-query';
import { Tag } from 'lucide-react';

import type { MediaKeywords } from '@/api/entities';

import { SectionHeader } from '@/components/media/sections/section-header';
import type { DataQueryOptions } from '@/components/media/sections/types';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Loading
// ============================================================================

function KeywordsSectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-20 rounded-full" />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface KeywordsSectionContentProps {
  data: MediaKeywords;
}

function KeywordsSectionContent({ data }: KeywordsSectionContentProps) {
  if (data.keywords.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={Tag} title="Keywords" count={data.keywords.length} />
      <div className="flex flex-wrap gap-1.5">
        {data.keywords.slice(0, 15).map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-border/40 bg-muted/20 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface KeywordsSectionProps {
  queryOptions: DataQueryOptions<MediaKeywords>;
}

function KeywordsSection({ queryOptions }: KeywordsSectionProps) {
  const query = useQuery(queryOptions);

  return (
    <Query
      result={query}
      callbacks={{
        loading: KeywordsSectionLoading,
        error: () => null,
        success: (data) => <KeywordsSectionContent data={data} />,
      }}
    />
  );
}

export type { KeywordsSectionProps };
export { KeywordsSection };
