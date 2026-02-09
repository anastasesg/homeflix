'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Film, Globe, Shuffle, Star, ThumbsUp } from 'lucide-react';
import type { Route } from 'next';

import { type MovieRecommendation } from '@/api/entities';
import {
  movieCreditsQueryOptions,
  movieExternalLinksQueryOptions,
  movieImagesQueryOptions,
  movieOverviewQueryOptions,
  movieRecommendationsQueryOptions,
  movieTitleQueryOptions,
  similarMoviesQueryOptions,
} from '@/options/queries/movies/detail';

import {
  CastSection,
  CrewSection,
  type ExternalLink,
  ExternalLinksSection,
  GallerySection,
  MediaCarouselSection,
  OverviewSection,
} from '@/components/media/sections';

import { CollectionSection } from './collection-section';
import { DetailsSection } from './details-section';
import { DirectorFilmographySection } from './director-filmography-section';
import { ProductionSection } from './production-section';
import { ReviewsSection } from './reviews-section';

// ============================================================================
// Utilities
// ============================================================================

function buildMovieLinks(data: { imdbId?: string; tmdbId: number; homepage?: string }): ExternalLink[] {
  const links: ExternalLink[] = [];
  if (data.imdbId) {
    links.push({ id: 'imdb', url: `https://www.imdb.com/title/${data.imdbId}`, label: 'IMDb', icon: Globe });
  }
  if (data.tmdbId) {
    links.push({
      id: 'tmdb',
      url: `https://www.themoviedb.org/movie/${data.tmdbId}`,
      label: 'TMDB',
      icon: Film,
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

function MovieContent({ tmdbId }: MovieContentProps) {
  return (
    <div className="flex flex-col space-y-8">
      <OverviewSection queryOptions={movieOverviewQueryOptions(tmdbId)} />
      <GallerySection
        imagesQueryOptions={movieImagesQueryOptions(tmdbId)}
        titleQueryOptions={movieTitleQueryOptions(tmdbId)}
      />
      <CastSection queryOptions={movieCreditsQueryOptions(tmdbId)} />
      <CrewSection queryOptions={movieCreditsQueryOptions(tmdbId)} />
      <CollectionSection tmdbId={tmdbId} />
      <ReviewsSection tmdbId={tmdbId} />
      <DirectorFilmographySection tmdbId={tmdbId} />
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
      <DetailsSection tmdbId={tmdbId} />
      <ProductionSection tmdbId={tmdbId} />
      <ExternalLinksSection queryOptions={movieExternalLinksQueryOptions(tmdbId)} buildLinks={buildMovieLinks} />
    </div>
  );
}

export type { MovieContentProps };
export { MovieContent };
