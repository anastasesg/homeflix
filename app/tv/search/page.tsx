'use client';

import { useCallback, useState } from 'react';

import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';

import type { MovieItem, ShowItem } from '@/api/entities';
import { searchMoviesQueryOptions } from '@/options/queries/movies';
import { searchShowsQueryOptions } from '@/options/queries/shows';

import { TvMediaCard } from '../_components/tv-card';

// ============================================================
// Sub-components
// ============================================================

function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { ref, focused } = useFocusable({
    focusKey: 'search-input',
    onEnterPress: () => {
      // Focus the native input for keyboard entry
      const input = ref.current?.querySelector('input');
      input?.focus();
    },
  });

  return (
    <div
      ref={ref}
      className={`mx-12 mt-8 flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all duration-150 ${
        focused ? 'border-accent bg-accent/10' : 'border-border/40 bg-muted/10'
      }`}
    >
      <Search className="size-6 shrink-0 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search movies and shows..."
        className="w-full bg-transparent text-xl outline-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

function MovieResults({ movies }: { movies: MovieItem[] }) {
  const { ref, focusKey } = useFocusable({
    focusKey: 'search-movies',
    trackChildren: true,
  });

  if (movies.length === 0) return null;

  return (
    <FocusContext.Provider value={focusKey}>
      <section className="flex flex-col gap-4 py-4">
        <h2 className="px-12 text-2xl font-semibold">Movies</h2>
        <div ref={ref} className="flex flex-wrap gap-6 px-12">
          {movies.map((movie) => (
            <TvMediaCard
              key={movie.tmdbId}
              id={movie.tmdbId}
              title={movie.title}
              year={movie.year}
              posterUrl={movie.posterUrl}
              mediaType="movie"
            />
          ))}
        </div>
      </section>
    </FocusContext.Provider>
  );
}

function ShowResults({ shows }: { shows: ShowItem[] }) {
  const { ref, focusKey } = useFocusable({
    focusKey: 'search-shows',
    trackChildren: true,
  });

  if (shows.length === 0) return null;

  return (
    <FocusContext.Provider value={focusKey}>
      <section className="flex flex-col gap-4 py-4">
        <h2 className="px-12 text-2xl font-semibold">Shows</h2>
        <div ref={ref} className="flex flex-wrap gap-6 px-12">
          {shows.map((show) => (
            <TvMediaCard
              key={show.tmdbId}
              id={show.tmdbId}
              title={show.title}
              year={show.year}
              posterUrl={show.posterUrl}
              mediaType="show"
            />
          ))}
        </div>
      </section>
    </FocusContext.Provider>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32">
      <Search className="size-16 text-muted-foreground/30" />
      <p className="text-xl text-muted-foreground">Search for movies and shows</p>
    </div>
  );
}

function NoResults() {
  return (
    <div className="flex items-center justify-center py-20">
      <p className="text-xl text-muted-foreground">No results found</p>
    </div>
  );
}

// ============================================================
// Main
// ============================================================

export default function TvSearchPage() {
  const [query, setQuery] = useState('');

  const movieQuery = useQuery(searchMoviesQueryOptions(query));
  const showQuery = useQuery(searchShowsQueryOptions(query));

  const { ref, focusKey } = useFocusable({
    focusKey: 'tv-search',
    trackChildren: true,
  });

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const hasQuery = query.length >= 2;
  const movies = movieQuery.data?.movies ?? [];
  const shows = showQuery.data?.shows ?? [];
  const isLoading = hasQuery && (movieQuery.isLoading || showQuery.isLoading);
  const hasResults = movies.length > 0 || shows.length > 0;

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-col">
        <h1 className="px-12 pt-8 text-4xl font-bold">Search</h1>
        <SearchInput value={query} onChange={handleQueryChange} />

        {!hasQuery && <EmptyState />}

        {isLoading && (
          <div className="flex flex-wrap gap-6 px-12 py-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-[300px] w-[200px] animate-pulse rounded-xl bg-muted/20" />
            ))}
          </div>
        )}

        {hasQuery && !isLoading && !hasResults && <NoResults />}

        {hasQuery && !isLoading && hasResults && (
          <>
            <MovieResults movies={movies} />
            <ShowResults shows={shows} />
          </>
        )}
      </div>
    </FocusContext.Provider>
  );
}
