'use client';

import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FeaturedMovie } from './_components/featured-movie';
import { MovieFilters } from './_components/movie-filters';
import { MovieGrid } from './_components/movie-grid';
import type { EnrichedMovie } from './_components/types';

// Enriched mock data with posters, ratings, and metadata
const mockMovies: EnrichedMovie[] = [
  {
    id: 1,
    title: 'Dune: Part Two',
    year: 2024,
    type: 'movie',
    status: 'downloaded',
    quality: '4K',
    rating: 8.5,
    runtime: 166,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    tagline: 'Long live the fighters.',
    overview:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
  },
  {
    id: 2,
    title: 'Oppenheimer',
    year: 2023,
    type: 'movie',
    status: 'downloaded',
    quality: '1080p',
    rating: 8.4,
    runtime: 180,
    genres: ['Biography', 'Drama', 'History'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg',
    tagline: 'The world forever changes.',
    overview:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
  },
  {
    id: 3,
    title: 'Barbie',
    year: 2023,
    type: 'movie',
    status: 'downloaded',
    quality: '1080p',
    rating: 7.0,
    runtime: 114,
    genres: ['Comedy', 'Adventure', 'Fantasy'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/nHf61UzkfFno5X1ofIhugCPus2R.jpg',
    tagline: "She's everything. He's just Ken.",
    overview:
      'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.',
  },
  {
    id: 4,
    title: 'Top Gun: Maverick',
    year: 2022,
    type: 'movie',
    status: 'downloaded',
    quality: '4K',
    rating: 8.2,
    runtime: 130,
    genres: ['Action', 'Drama'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/AaV1YIdWKnjAIAOe8UUKBFm327v.jpg',
    tagline: 'Feel the need... the need for speed.',
    overview:
      'After more than thirty years of service, Maverick is where he belongs, pushing the envelope as a top naval aviator.',
  },
  {
    id: 5,
    title: 'Poor Things',
    year: 2024,
    type: 'movie',
    status: 'downloaded',
    quality: '1080p',
    rating: 8.0,
    runtime: 141,
    genres: ['Comedy', 'Drama', 'Romance'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/bQS43HSLZzMjZkcHJz4fGc7fNdz.jpg',
    tagline: "She's like nothing you've ever seen.",
    overview:
      'Brought back to life by an unorthodox scientist, a young woman runs off with a lawyer on a whirlwind adventure.',
  },
  {
    id: 6,
    title: 'Civil War',
    year: 2024,
    type: 'movie',
    status: 'wanted',
    rating: 7.1,
    runtime: 109,
    genres: ['Action', 'Drama', 'Thriller'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/z121dSTR7PY9KxKuvwiIFSYW8cf.jpg',
    tagline: 'Every war is hell.',
    overview: 'In the near future, a group of war journalists attempt to survive while reporting on a civil war.',
  },
  {
    id: 7,
    title: 'Challengers',
    year: 2024,
    type: 'movie',
    status: 'missing',
    rating: 7.8,
    runtime: 131,
    genres: ['Drama', 'Romance', 'Sport'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/H6vke7zGiuLsz4v4RPhaRdl4Zeq.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/lrZqhyq6EZ9e8DXDCP1Cm2vCKKP.jpg',
    tagline: 'Love is a contact sport.',
    overview:
      'Tashi, a tennis player turned coach, has taken her husband from a mediocre player to a world-famous grand slam champion.',
  },
  {
    id: 8,
    title: 'The Fall Guy',
    year: 2024,
    type: 'movie',
    status: 'downloading',
    rating: 7.2,
    runtime: 126,
    genres: ['Action', 'Comedy', 'Romance'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/tSz1qsmSJon0rqjHBxXZmrotuse.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/H5HjE7Xb9N09rbWn1zBfxgI8uz.jpg',
    tagline: 'Fall hard.',
    overview: 'A stuntman, fresh off an accident that almost ended his career, must track down a missing star.',
  },
  {
    id: 9,
    title: 'Furiosa: A Mad Max Saga',
    year: 2024,
    type: 'movie',
    status: 'wanted',
    rating: 7.6,
    runtime: 148,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/wNAhuOZ3Zf84jCIlrcI6JhgmY5q.jpg',
    tagline: 'Fury is born.',
    overview: 'The origin story of renegade warrior Furiosa before she teamed up with Mad Max.',
  },
  {
    id: 10,
    title: 'Kingdom of the Planet of the Apes',
    year: 2024,
    type: 'movie',
    status: 'downloaded',
    quality: '4K',
    rating: 7.1,
    runtime: 145,
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/fqv8v6AycXKsivp1T5yKtLbGXce.jpg',
    tagline: 'No one can stop the reign.',
    overview:
      'Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything.',
  },
  {
    id: 11,
    title: 'Inside Out 2',
    year: 2024,
    type: 'movie',
    status: 'wanted',
    rating: 7.7,
    runtime: 96,
    genres: ['Animation', 'Comedy', 'Family'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg',
    tagline: 'Make room for new emotions.',
    overview: 'Riley enters puberty and a new set of emotions start appearing in Headquarters.',
  },
  {
    id: 12,
    title: 'Deadpool & Wolverine',
    year: 2024,
    type: 'movie',
    status: 'wanted',
    rating: 7.8,
    runtime: 128,
    genres: ['Action', 'Comedy', 'Superhero'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/dvBCdCohwWbsP5qAaglOXagDMtk.jpg',
    tagline: 'Come together.',
    overview: 'Deadpool is offered a place in the Marvel Cinematic Universe by the Time Variance Authority.',
  },
];

type TabValue = 'all' | 'monitored' | 'wanted' | 'missing';

function filterByTab(movies: EnrichedMovie[], tab: TabValue): EnrichedMovie[] {
  switch (tab) {
    case 'monitored':
      return movies.filter((m) => m.status === 'downloaded' || m.status === 'downloading');
    case 'wanted':
      return movies.filter((m) => m.status === 'wanted');
    case 'missing':
      return movies.filter((m) => m.status === 'missing');
    default:
      return movies;
  }
}

function filterBySearch(movies: EnrichedMovie[], search: string): EnrichedMovie[] {
  if (!search.trim()) return movies;
  const query = search.toLowerCase();
  return movies.filter(
    (m) => m.title.toLowerCase().includes(query) || m.genres?.some((g) => g.toLowerCase().includes(query))
  );
}

function sortMovies(movies: EnrichedMovie[], sort: string): EnrichedMovie[] {
  const sorted = [...movies];
  switch (sort) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'year':
      return sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    case 'rating':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'added':
    default:
      return sorted;
  }
}

export default function MoviesPage() {
  const [tab, setTab] = useState<TabValue>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('added');

  // Get a featured movie (highest rated downloaded movie)
  const featuredMovie = mockMovies
    .filter((m) => m.status === 'downloaded' && m.backdropUrl)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];

  // Apply filters and sorting
  let movies = filterByTab(mockMovies, tab);
  movies = filterBySearch(movies, search);
  movies = sortMovies(movies, sort);

  // Count for each tab
  const counts = {
    all: mockMovies.length,
    monitored: mockMovies.filter((m) => m.status === 'downloaded' || m.status === 'downloading').length,
    wanted: mockMovies.filter((m) => m.status === 'wanted').length,
    missing: mockMovies.filter((m) => m.status === 'missing').length,
  };

  return (
    <main className="flex flex-1 flex-col gap-6">
      {/* Featured Movie Hero Section */}
      {featuredMovie && <FeaturedMovie movie={featuredMovie} />}

      {/* Library Section */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Your Library</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mockMovies.length} movies · {counts.monitored} downloaded
            </p>
          </div>
        </div>

        <MovieFilters search={search} onSearchChange={setSearch} sort={sort} onSortChange={setSort} />

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="mt-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="monitored">Downloaded ({counts.monitored})</TabsTrigger>
            <TabsTrigger value="wanted">Wanted ({counts.wanted})</TabsTrigger>
            <TabsTrigger value="missing">Missing ({counts.missing})</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-6">
            <MovieGrid movies={movies} />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
