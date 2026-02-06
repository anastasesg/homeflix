'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Languages, Radio, Sparkles, Tag } from 'lucide-react';

import { type ShowBasic, type ShowKeywords } from '@/api/entities';
import { tmdbTVKeywordsQueryOptions } from '@/options/queries/tmdb';

import { Query } from '@/components/query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { SectionHeader } from './section-header';

// ============================================================================
// Keywords Sub-section
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

interface KeywordsSectionContentProps {
  data: ShowKeywords;
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

interface KeywordsInlineProps {
  tmdbId: number;
}

function KeywordsInline({ tmdbId }: KeywordsInlineProps) {
  const query = useQuery(tmdbTVKeywordsQueryOptions(tmdbId));

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

// ============================================================================
// Network Info Sub-section
// ============================================================================

interface NetworkInfoProps {
  networks: ShowBasic['networks'];
}

function NetworkInfo({ networks }: NetworkInfoProps) {
  if (networks.length === 0) return null;

  return (
    <div className="flex-1">
      <SectionHeader icon={Radio} title="Networks" />
      <div className="flex flex-wrap items-center gap-3">
        {networks.map((network) => (
          <div
            key={network.name}
            className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 transition-colors hover:border-border hover:bg-accent/50"
          >
            {network.logoUrl ? (
              <div className="relative h-5 w-12">
                <Image
                  src={network.logoUrl}
                  alt={network.name}
                  fill
                  className="object-contain brightness-0 invert"
                  sizes="48px"
                />
              </div>
            ) : (
              <Radio className="size-4 text-muted-foreground" />
            )}
            <span className="text-xs font-medium">{network.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

interface DetailsSectionProps {
  show: ShowBasic;
  tmdbId: number;
}

function DetailsSection({ show, tmdbId }: DetailsSectionProps) {
  return (
    <section className="space-y-6">
      {/* Genres + Keywords row */}
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
        <div className="flex-1">
          <SectionHeader icon={Tag} title="Genres" />
          <div className="flex flex-wrap gap-2">
            {show.genres.map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                className="border border-border/40 bg-muted/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/40"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
        <KeywordsInline tmdbId={tmdbId} />
      </div>

      {/* Network info */}
      <NetworkInfo networks={show.networks} />

      {/* Languages */}
      {show.languages.length > 0 && (
        <div className="flex-1">
          <SectionHeader icon={Languages} title="Languages" />
          <div className="flex flex-wrap gap-1.5">
            {show.languages.map((language) => (
              <span
                key={language}
                className="rounded-full border border-border/40 bg-muted/20 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export type { DetailsSectionProps };
export { DetailsSection };
