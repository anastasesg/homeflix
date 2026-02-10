'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Globe, Shuffle, ThumbsUp, Tv } from 'lucide-react';
import type { Route } from 'next';

import { type ShowRecommendation } from '@/api/entities';
import {
  showCreatedByQueryOptions,
  showCreditsQueryOptions,
  showDetailNetworksQueryOptions,
  showDetailsInfoQueryOptions,
  showExternalLinksQueryOptions,
  showImagesQueryOptions,
  showKeywordsQueryOptions,
  showOverviewQueryOptions,
  showProductionQueryOptions,
  showRecommendationsQueryOptions,
  showReviewsQueryOptions,
  showSeasonsQueryOptions,
  showTitleQueryOptions,
  similarShowsQueryOptions,
} from '@/options/queries/shows/detail';

import {
  CastSection,
  CrewSection,
  type ExternalLink,
  ExternalLinksSection,
  GallerySection,
  MediaCarouselSection,
  OverviewSection,
} from '@/components/media/sections';

import { CreatedBySection } from './created-by-section';
import { DetailsSection } from './details-section';
import { KeywordsSection } from './keywords-section';
import { NetworkSection } from './network-section';
import { ProductionSection } from './production-section';
import { ReviewsSection } from './reviews-section';
import { SeasonsSection } from './seasons-section';

// ============================================================================
// Utilities
// ============================================================================

function buildShowLinks(data: { imdbId?: string; tvdbId?: number; tmdbId: number; homepage?: string }): ExternalLink[] {
  const links: ExternalLink[] = [];
  if (data.imdbId) {
    links.push({ id: 'imdb', url: `https://www.imdb.com/title/${data.imdbId}`, label: 'IMDb', icon: Globe });
  }
  if (data.tvdbId) {
    links.push({ id: 'tvdb', url: `https://thetvdb.com/?tab=series&id=${data.tvdbId}`, label: 'TVDB', icon: Tv });
  }
  if (data.tmdbId) {
    links.push({
      id: 'tmdb',
      url: `https://www.themoviedb.org/tv/${data.tmdbId}`,
      label: 'TMDB',
      icon: Globe,
    });
  }
  if (data.homepage) {
    links.push({ id: 'homepage', url: data.homepage, label: 'Official Site', icon: Globe });
  }
  return links;
}

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
      <CreatedBySection queryOptions={showCreatedByQueryOptions(tmdbId)} />
      <NetworkSection queryOptions={showDetailNetworksQueryOptions(tmdbId)} />
      <GallerySection
        imagesQueryOptions={showImagesQueryOptions(tmdbId)}
        titleQueryOptions={showTitleQueryOptions(tmdbId)}
      />
      <CastSection queryOptions={showCreditsQueryOptions(tmdbId)} />
      <CrewSection queryOptions={showCreditsQueryOptions(tmdbId)} />
      <ReviewsSection queryOptions={showReviewsQueryOptions(tmdbId)} />
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
      <KeywordsSection queryOptions={showKeywordsQueryOptions(tmdbId)} />
      <DetailsSection queryOptions={showDetailsInfoQueryOptions(tmdbId)} />
      <ProductionSection queryOptions={showProductionQueryOptions(tmdbId)} />
      <ExternalLinksSection queryOptions={showExternalLinksQueryOptions(tmdbId)} buildLinks={buildShowLinks} />
    </div>
  );
}

export type { ShowContentProps };
export { ShowContent };
