'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Shuffle, Star, ThumbsUp } from 'lucide-react';
import type { Route } from 'next';

import { type MovieRecommendation } from '@/api/entities';
import {
  movieCreditsQueryOptions,
  movieImagesQueryOptions,
  movieKeywordsQueryOptions,
  movieOverviewQueryOptions,
  movieProductionClusterQueryOptions,
  movieRecommendationsQueryOptions,
  movieTitleQueryOptions,
  similarMoviesQueryOptions,
} from '@/options/queries/movies/detail';

import {
  CastSection,
  CrewSection,
  GallerySection,
  KeywordsSection,
  MediaCarouselSection,
  OverviewSection,
  ProductionSection,
} from '@/components/media/sections';

import { BoxOfficeSection } from './box-office-section';
import { CollectionSection } from './collection-section';
import { DirectorFilmographySection } from './director-filmography-section';
import { ReviewsSection } from './reviews-section';

// ============================================================================
// Sub-Components
// ============================================================================

interface MovieCardProps {
  movie: MovieRecommendation;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/media/movies/${movie.id}` as Route} className="group cursor-pointer pb-0.5">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border/60 shadow-sm transition-all duration-300 group-hover:border-border group-hover:shadow-md group-hover:shadow-black/10 dark:group-hover:shadow-black/30">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="150px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted p-2 text-center text-xs text-muted-foreground">
            {movie.title}
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="truncate text-[13px] font-semibold leading-tight text-foreground/90 transition-colors group-hover:text-foreground">
          {movie.title}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          {movie.year > 0 && <span>{movie.year}</span>}
          {movie.rating > 0 && (
            <span className="flex items-center gap-0.5">
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              {movie.rating.toFixed(1)}
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

interface MovieContentProps {
  tmdbId: number;
}

const MOVIE_FEATURED_JOBS = [
  'Director',
  'Writer',
  'Screenplay',
  'Story',
  'Producer',
  'Original Music Composer',
  'Director of Photography',
];

const MOVIE_DEPARTMENT_PRIORITY = ['Directing', 'Writing', 'Production', 'Camera', 'Editing', 'Sound', 'Art'];

function MovieContent({ tmdbId }: MovieContentProps) {
  return (
    <div className="flex flex-col space-y-8">
      {/* 1. Overview */}
      <OverviewSection queryOptions={movieOverviewQueryOptions(tmdbId)} />

      {/* Franchise context — movie's closest analogue to the show's Seasons band. */}
      <CollectionSection tmdbId={tmdbId} />

      {/* 2. Cast */}
      <CastSection queryOptions={movieCreditsQueryOptions(tmdbId)} />

      {/* 3. Trivia (keywords stand-in until a dedicated trivia source is wired). */}
      <KeywordsSection queryOptions={movieKeywordsQueryOptions(tmdbId)} />

      {/* 4. Gallery */}
      <GallerySection
        imagesQueryOptions={movieImagesQueryOptions(tmdbId)}
        titleQueryOptions={movieTitleQueryOptions(tmdbId)}
      />

      {/* 5. Related / similar */}
      <MediaCarouselSection
        queryOptions={movieRecommendationsQueryOptions(tmdbId)}
        icon={ThumbsUp}
        title="Recommended"
        renderCard={(movie: MovieRecommendation) => <MovieCard movie={movie} />}
      />
      <MediaCarouselSection
        queryOptions={similarMoviesQueryOptions(tmdbId)}
        icon={Shuffle}
        title="Similar Movies"
        renderCard={(movie: MovieRecommendation) => <MovieCard movie={movie} />}
      />

      {/* 6. Crew (+ director filmography as crew-adjacent trivia) */}
      <CrewSection
        queryOptions={movieCreditsQueryOptions(tmdbId)}
        featuredJobs={MOVIE_FEATURED_JOBS}
        departmentPriority={MOVIE_DEPARTMENT_PRIORITY}
      />
      <DirectorFilmographySection tmdbId={tmdbId} />

      {/* 7. External ratings (reviews; external links moved into header pills). */}
      <ReviewsSection tmdbId={tmdbId} />

      {/* 8. Production details */}
      <BoxOfficeSection tmdbId={tmdbId} />
      <ProductionSection queryOptions={movieProductionClusterQueryOptions(tmdbId)} />
    </div>
  );
}

export type { MovieContentProps };
export { MovieContent };
