'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Shuffle, ThumbsUp } from 'lucide-react';
import type { Route } from 'next';

import { type ShowRecommendation } from '@/api/entities';
import {
  showCreditsQueryOptions,
  showImagesQueryOptions,
  showKeywordsQueryOptions,
  showOverviewQueryOptions,
  showProductionClusterQueryOptions,
  showRecommendationsQueryOptions,
  showReviewsQueryOptions,
  showSeasonsQueryOptions,
  showTitleQueryOptions,
  similarShowsQueryOptions,
} from '@/options/queries/shows/detail';

import {
  CastSection,
  CrewSection,
  GallerySection,
  MediaCarouselSection,
  OverviewSection,
} from '@/components/media/sections';

import { KeywordsSection } from './keywords-section';
import { ProductionSection } from './production-section';
import { ReviewsSection } from './reviews-section';
import { SeasonsSection } from './seasons-section';

// ============================================================================
// Sub-Components
// ============================================================================

interface ShowCardProps {
  show: ShowRecommendation;
}

function ShowCard({ show }: ShowCardProps) {
  return (
    <Link href={`/media/shows/${show.id}` as Route} className="group cursor-pointer pb-0.5">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border/60 shadow-sm transition-all duration-300 group-hover:border-border group-hover:shadow-md group-hover:shadow-black/10 dark:group-hover:shadow-black/30">
        {show.posterUrl ? (
          <Image
            src={show.posterUrl}
            alt={show.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="150px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted p-2 text-center text-xs text-muted-foreground">
            {show.title}
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="truncate text-[13px] font-semibold leading-tight text-foreground/90 transition-colors group-hover:text-foreground">
          {show.title}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          {show.year > 0 && <span>{show.year}</span>}
        </div>
      </div>
    </Link>
  );
}

// ============================================================================
// Main
// ============================================================================

interface ShowContentProps {
  tmdbId: number;
}

function ShowContent({ tmdbId }: ShowContentProps) {
  return (
    <div className="flex flex-col space-y-8">
      <OverviewSection queryOptions={showOverviewQueryOptions(tmdbId)} />
      <SeasonsSection tmdbId={tmdbId} queryOptions={showSeasonsQueryOptions(tmdbId)} />

      <GallerySection
        imagesQueryOptions={showImagesQueryOptions(tmdbId)}
        titleQueryOptions={showTitleQueryOptions(tmdbId)}
      />

      <CastSection queryOptions={showCreditsQueryOptions(tmdbId)} />
      <CrewSection
        queryOptions={showCreditsQueryOptions(tmdbId)}
        featuredJobs={['Creator', 'Executive Producer', 'Director', 'Writer', 'Original Music Composer']}
      />

      {/* Trivia stand-in until a dedicated trivia source is wired. */}
      <KeywordsSection queryOptions={showKeywordsQueryOptions(tmdbId)} />

      <MediaCarouselSection
        queryOptions={showRecommendationsQueryOptions(tmdbId)}
        icon={ThumbsUp}
        title="Recommended"
        renderCard={(show: ShowRecommendation) => <ShowCard show={show} />}
      />
      <MediaCarouselSection
        queryOptions={similarShowsQueryOptions(tmdbId)}
        icon={Shuffle}
        title="Similar Shows"
        renderCard={(show: ShowRecommendation) => <ShowCard show={show} />}
      />

      <ProductionSection queryOptions={showProductionClusterQueryOptions(tmdbId)} />
      <ReviewsSection queryOptions={showReviewsQueryOptions(tmdbId)} />
    </div>
  );
}

export type { ShowContentProps };
export { ShowContent };
