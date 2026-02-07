'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { Star, ThumbsUp } from 'lucide-react';

import { type MovieRecommendation } from '@/api/entities';
import { movieRecommendationsQueryOptions } from '@/options/queries/movies/detail';

import { Query } from '@/components/query';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

import { SectionHeader } from './section-header';

// ============================================================================
// Movie Card
// ============================================================================

interface MovieCardProps {
  movie: MovieRecommendation;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/media/movies/${movie.id}`} className="group cursor-pointer pb-0.5">
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
// Loading
// ============================================================================

function RecommendationsSectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[130px] shrink-0 sm:w-[150px]">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <div className="mt-2 space-y-1 px-0.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

function RecommendationsSectionContent({ recommendations }: { recommendations: MovieRecommendation[] }) {
  if (recommendations.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={ThumbsUp} title="Recommended" count={recommendations.length} />
      <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
        <CarouselContent className="-ml-2 py-1">
          {recommendations.map((movie) => (
            <CarouselItem key={movie.id} className="basis-[130px] pl-2 sm:basis-[150px]">
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
        <CarouselNext className="right-2 size-8 border-border bg-background/80 backdrop-blur-sm hover:bg-background" />
      </Carousel>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface RecommendationsSectionProps {
  tmdbId: number;
}

function RecommendationsSection({ tmdbId }: RecommendationsSectionProps) {
  const query = useQuery(movieRecommendationsQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: RecommendationsSectionLoading,
        error: () => null,
        success: (recommendations) => <RecommendationsSectionContent recommendations={recommendations} />,
      }}
    />
  );
}

export type { RecommendationsSectionProps };
export { RecommendationsSection };
