'use client';

import { use } from 'react';

import Image from 'next/image';

import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';

import type { ShowRecommendation } from '@/api/entities';
import { showDetailQueryOptions, similarShowsQueryOptions } from '@/options/queries/shows';

import { Query } from '@/components/query';

import type { TvMediaItem } from '../../_components/tv-media-row';
import { TvMediaRow } from '../../_components/tv-media-row';

// ============================================================
// Utilities
// ============================================================

function recommendationToMediaItem(rec: ShowRecommendation): TvMediaItem {
  return {
    id: rec.id,
    title: rec.title,
    year: rec.year,
    posterUrl: rec.posterUrl,
    mediaType: 'show',
  };
}

// ============================================================
// Sub-components
// ============================================================

function SimilarShows({ tmdbId }: { tmdbId: number }) {
  const query = useQuery(similarShowsQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => null,
        error: () => null,
        success: (shows) => (
          <TvMediaRow title="Similar Shows" items={shows.map(recommendationToMediaItem)} focusKey="similar-shows" />
        ),
      }}
    />
  );
}

function SeasonList({ seasons }: { seasons: Array<{ name: string; episodeCount: number; seasonNumber: number }> }) {
  const { ref, focusKey } = useFocusable({
    focusKey: 'season-list',
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <section ref={ref} className="flex flex-col gap-4 px-12 py-4">
        <h2 className="text-2xl font-semibold">Seasons</h2>
        <div className="flex gap-4">
          {seasons
            .filter((s) => s.seasonNumber > 0)
            .map((season) => (
              <SeasonCard key={season.seasonNumber} season={season} />
            ))}
        </div>
      </section>
    </FocusContext.Provider>
  );
}

function SeasonCard({ season }: { season: { name: string; episodeCount: number; seasonNumber: number } }) {
  const { ref, focused } = useFocusable();

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-2 rounded-xl px-6 py-4 transition-all duration-150 ${
        focused ? 'scale-105 bg-accent/20 ring-3 ring-accent' : 'bg-muted/10 opacity-70'
      }`}
    >
      <span className="text-lg font-semibold">{season.name}</span>
      <span className="text-sm text-muted-foreground">{season.episodeCount} episodes</span>
    </div>
  );
}

// ============================================================
// Main
// ============================================================

interface TvShowDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TvShowDetailPage({ params }: TvShowDetailPageProps) {
  const { id } = use(params);
  const tmdbId = Number(id);
  const query = useQuery(showDetailQueryOptions(tmdbId));

  const { ref, focusKey } = useFocusable({
    focusKey: 'show-detail',
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
            success: (show) => (
              <>
                {/* Backdrop */}
                <section className="relative aspect-video w-full overflow-hidden">
                  {show.backdropUrl && (
                    <Image
                      src={show.backdropUrl}
                      alt={show.name}
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
                  <h1 className="max-w-3xl text-5xl leading-tight font-bold">{show.name}</h1>

                  {show.tagline && <p className="text-xl text-muted-foreground italic">{show.tagline}</p>}

                  <div className="flex items-center gap-4 text-lg text-muted-foreground">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="size-5 fill-current" />
                      {show.rating.toFixed(1)}
                    </span>
                    <span>
                      {show.year}
                      {show.endYear ? `–${show.endYear}` : ''}
                    </span>
                    <span>
                      {show.numberOfSeasons} season{show.numberOfSeasons !== 1 ? 's' : ''}
                    </span>
                    {show.genres.length > 0 && <span>{show.genres.join(', ')}</span>}
                  </div>

                  <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{show.overview}</p>
                </div>

                {/* Seasons */}
                {show.seasons.length > 0 && (
                  <div className="mt-8">
                    <SeasonList seasons={show.seasons} />
                  </div>
                )}
              </>
            ),
          }}
        />

        <div className="mt-8">
          <SimilarShows tmdbId={tmdbId} />
        </div>
      </div>
    </FocusContext.Provider>
  );
}
