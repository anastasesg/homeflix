'use client';

import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';

import { type MediaKeywords } from '@/api/entities';
import { movieKeywordsQueryOptions } from '@/options/queries/movies/detail';

import { SectionHeader } from '@/components/media/sections/section-header';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Loading
// ============================================================================

function KeywordsSectionLoading() {
  return (
    <div className="flex-1">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-16 rounded-full" style={{ animationDelay: `${i * 50}ms` }} />
        ))}
      </div>
    </div>
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
    <div className="flex-1">
      <SectionHeader icon={Sparkles} title="Keywords" />
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
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface KeywordsSectionProps {
  tmdbId: number;
}

function KeywordsSection({ tmdbId }: KeywordsSectionProps) {
  const query = useQuery(movieKeywordsQueryOptions(tmdbId));

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
