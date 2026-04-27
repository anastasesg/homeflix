'use client';

import { use } from 'react';

import Image from 'next/image';

import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';

import type { MovieRecommendation } from '@/api/entities';
import { movieDetailQueryOptions, similarMoviesQueryOptions } from '@/options/queries/movies';
import { formatRuntime } from '@/utilities/format-duration';

import { Query } from '@/components/query';

import type { TvMediaItem } from '../../_components/tv-media-row';
import { TvMediaRow } from '../../_components/tv-media-row';

// ============================================================
// Utilities
// ============================================================

function recommendationToMediaItem(rec: MovieRecommendation): TvMediaItem {
  return {
    id: rec.id,
    title: rec.title,
    year: rec.year,
    posterUrl: rec.posterUrl,
    mediaType: 'movie',
  };
}

// ============================================================
// Sub-components
// ============================================================

function SimilarMovies({ tmdbId }: { tmdbId: number }) {
  const query = useQuery(similarMoviesQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => null,
        error: () => null,
        success: (movies) => (
          <TvMediaRow title="Similar Movies" items={movies.map(recommendationToMediaItem)} focusKey="similar-movies" />
        ),
      }}
    />
  );
}

// ============================================================
// Main
// ============================================================

interface TvMovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TvMovieDetailPage({ params }: TvMovieDetailPageProps) {
  const { id } = use(params);
  const tmdbId = Number(id);
  const query = useQuery(movieDetailQueryOptions(tmdbId));

  const { ref, focusKey } = useFocusable({
    focusKey: 'movie-detail',
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-col">
        <Query
          result={query}
          callbacks={{
            loading: () => (
              <div className="flex aspect-video w-full items-center justify-center bg-muted/10">
                <p className="text-2xl text-muted-foreground">Loading...</p>
              </div>
            ),
            error: (error) => (
              <div className="flex h-96 items-center justify-center">
                <p className="text-xl text-muted-foreground">{error.message}</p>
              </div>
            ),
            success: (movie) => (
              <>
                {/* Backdrop */}
                <section className="relative aspect-video w-full overflow-hidden">
                  {movie.backdropUrl && (
                    <Image
                      src={movie.backdropUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="100vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
                </section>

                {/* Info */}
                <div className="-mt-32 relative z-10 flex flex-col gap-4 px-12">
                  <h1 className="max-w-3xl text-5xl leading-tight font-bold">{movie.title}</h1>

                  {movie.tagline && <p className="text-xl text-muted-foreground italic">{movie.tagline}</p>}

                  <div className="flex items-center gap-4 text-lg text-muted-foreground">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="size-5 fill-current" />
                      {movie.rating.toFixed(1)}
                    </span>
                    <span>{movie.year}</span>
                    {movie.runtime > 0 && <span>{formatRuntime(movie.runtime)}</span>}
                    {movie.genres.length > 0 && <span>{movie.genres.join(', ')}</span>}
                  </div>

                  <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{movie.overview}</p>
                </div>
              </>
            ),
          }}
        />

        <div className="mt-8">
          <SimilarMovies tmdbId={tmdbId} />
        </div>
      </div>
    </FocusContext.Provider>
  );
}
