import Image from 'next/image';
import Link from 'next/link';

import { Film, Globe, Shuffle, Star, ThumbsUp, Tv } from 'lucide-react';
import type { Route } from 'next';

import { type ShowRecommendation } from '@/api/entities';
import {
  showCreditsQueryOptions,
  showExternalLinksQueryOptions,
  showImagesQueryOptions,
  showOverviewQueryOptions,
  showRecommendationsQueryOptions,
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
import { ProductionSection } from './production-section';
import { SeasonsSection } from './seasons-section';

// ============================================================================
// Constants
// ============================================================================

const SHOW_DEPARTMENT_PRIORITY = ['Creator', 'Writing', 'Production', 'Directing'];

// ============================================================================
// Utilities
// ============================================================================

function buildShowLinks(data: { tmdbId: number; imdbId?: string; tvdbId?: number; homepage?: string }): ExternalLink[] {
  const links: ExternalLink[] = [];
  if (data.tmdbId) {
    links.push({ id: 'tmdb', url: `https://www.themoviedb.org/tv/${data.tmdbId}`, label: 'TMDB', icon: Film });
  }
  if (data.imdbId) {
    links.push({ id: 'imdb', url: `https://www.imdb.com/title/${data.imdbId}`, label: 'IMDb', icon: Globe });
  }
  if (data.tvdbId) {
    links.push({
      id: 'tvdb',
      url: `https://www.thetvdb.com/?id=${data.tvdbId}&tab=series`,
      label: 'TVDB',
      icon: Tv,
    });
  }
  if (data.homepage) {
    links.push({ id: 'homepage', url: data.homepage, label: 'Official Site', icon: Globe });
  }
  return links;
}

// ============================================================================
// Show Card
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
          {show.rating > 0 && (
            <span className="flex items-center gap-0.5">
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              {show.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ============================================================================
// Main
// ============================================================================

interface OverviewTabProps {
  tmdbId: number;
}

function OverviewTab({ tmdbId }: OverviewTabProps) {
  return (
    <div className="flex flex-col space-y-8">
      <OverviewSection queryOptions={showOverviewQueryOptions(tmdbId)} />
      <CreatedBySection tmdbId={tmdbId} />
      <SeasonsSection tmdbId={tmdbId} />
      <GallerySection
        imagesQueryOptions={showImagesQueryOptions(tmdbId)}
        titleQueryOptions={showTitleQueryOptions(tmdbId)}
      />
      <CastSection queryOptions={showCreditsQueryOptions(tmdbId)} />
      <CrewSection queryOptions={showCreditsQueryOptions(tmdbId)} departmentPriority={SHOW_DEPARTMENT_PRIORITY} />
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
      <DetailsSection tmdbId={tmdbId} />
      <ProductionSection tmdbId={tmdbId} />
      <ExternalLinksSection queryOptions={showExternalLinksQueryOptions(tmdbId)} buildLinks={buildShowLinks} />
    </div>
  );
}

export type { OverviewTabProps };
export { OverviewTab };
