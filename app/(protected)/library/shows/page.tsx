'use client';

import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FeaturedShow } from './_components/featured-show';
import { ShowFilters } from './_components/show-filters';
import { ShowGrid } from './_components/show-grid';
import type { EnrichedShow } from './_components/types';

// Enriched mock data with posters, ratings, and metadata
const mockShows: EnrichedShow[] = [
  {
    id: 1,
    title: 'The Bear',
    year: 2022,
    showStatus: 'continuing',
    rating: 8.6,
    runtime: 30,
    genres: ['Drama', 'Comedy'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/sHFlbKS3WLqMnp9t6ghKBkGl5n1.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/fVbTkCwQu9t8FYQpQCVJc9xPQPT.jpg',
    tagline: 'Every second counts.',
    overview:
      "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop after a tragedy.",
    network: 'FX',
    totalEpisodes: 28,
    downloadedEpisodes: 28,
    seasonCount: 3,
    quality: '1080p',
    nextEpisode: {
      seasonNumber: 4,
      episodeNumber: 1,
      title: 'TBA',
      airDate: 'Summer 2025',
    },
  },
  {
    id: 2,
    title: 'Severance',
    year: 2022,
    showStatus: 'continuing',
    rating: 8.7,
    runtime: 55,
    genres: ['Drama', 'Mystery', 'Sci-Fi'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/lFf6LLrQjYldcZItzOkGmMMigP7.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/DdW22gT7aI2uyGKjL3MU6wlkSj.jpg',
    tagline: 'Find yourself.',
    overview:
      'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.',
    network: 'Apple TV+',
    totalEpisodes: 19,
    downloadedEpisodes: 19,
    seasonCount: 2,
    quality: '4K',
  },
  {
    id: 3,
    title: 'The White Lotus',
    year: 2021,
    showStatus: 'continuing',
    rating: 8.0,
    runtime: 60,
    genres: ['Drama', 'Comedy'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/qPt3Q1aLwjk5G3qLRzLzGqGRhqD.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/rFljUaWXzWMZkWJGPNLEz4QNZSA.jpg',
    tagline: 'Escape to paradise.',
    overview: 'Follow the exploits of various guests and employees at an exclusive tropical resort.',
    network: 'HBO',
    totalEpisodes: 21,
    downloadedEpisodes: 14,
    seasonCount: 3,
    nextEpisode: {
      seasonNumber: 3,
      episodeNumber: 8,
      title: 'Finale',
      airDate: 'Mar 9',
    },
  },
  {
    id: 4,
    title: 'Shogun',
    year: 2024,
    showStatus: 'continuing',
    rating: 8.7,
    runtime: 65,
    genres: ['Drama', 'Adventure', 'War'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/b8dEcME3x0m8MPsSlLbLJzCXqpm.jpg',
    tagline: 'Two worlds collide.',
    overview:
      'When a mysterious European ship is found marooned in a fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power.',
    network: 'FX',
    totalEpisodes: 10,
    downloadedEpisodes: 10,
    seasonCount: 1,
    quality: '4K',
  },
  {
    id: 5,
    title: 'House of the Dragon',
    year: 2022,
    showStatus: 'continuing',
    rating: 8.4,
    runtime: 60,
    genres: ['Action', 'Adventure', 'Drama'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg',
    tagline: 'Fire will reign.',
    overview:
      'The story of the Targaryen civil war that took place about 200 years before events portrayed in Game of Thrones.',
    network: 'HBO',
    totalEpisodes: 18,
    downloadedEpisodes: 18,
    seasonCount: 2,
    quality: '4K',
  },
  {
    id: 6,
    title: 'Fallout',
    year: 2024,
    showStatus: 'continuing',
    rating: 8.5,
    runtime: 55,
    genres: ['Action', 'Adventure', 'Drama'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/AnsSKR9LuK0P5qEZQUxvFnpVwZv.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/7BhxQGc7WUHI3dPKLGJ0JmxhQmc.jpg',
    tagline: 'The end is just the beginning.',
    overview:
      'In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers.',
    network: 'Prime Video',
    totalEpisodes: 8,
    downloadedEpisodes: 8,
    seasonCount: 1,
    quality: '4K',
    nextEpisode: {
      seasonNumber: 2,
      episodeNumber: 1,
      title: 'TBA',
      airDate: '2026',
    },
  },
  {
    id: 7,
    title: 'The Last of Us',
    year: 2023,
    showStatus: 'continuing',
    rating: 8.8,
    runtime: 55,
    genres: ['Action', 'Adventure', 'Drama'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
    tagline: "When you're lost in the darkness, look for the light.",
    overview:
      'Joel and Ellie, a pair connected through the harshness of the world they live in, must survive a brutal journey across the U.S.',
    network: 'HBO',
    totalEpisodes: 16,
    downloadedEpisodes: 9,
    seasonCount: 2,
  },
  {
    id: 8,
    title: 'Dune: Prophecy',
    year: 2024,
    showStatus: 'continuing',
    rating: 7.2,
    runtime: 55,
    genres: ['Drama', 'Sci-Fi', 'Adventure'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/m1FMQ7HLKSqFkFiJGnZzaSKqLG0.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xJNPbQQXBxPdwVq4qjXwXy8aB9v.jpg',
    overview:
      'Set 10,000 years before the ascension of Paul Atreides, following the Harkonnen Sisters as they establish the fabled Bene Gesserit.',
    network: 'HBO',
    totalEpisodes: 6,
    downloadedEpisodes: 0,
    seasonCount: 1,
  },
  {
    id: 9,
    title: 'True Detective',
    year: 2014,
    endYear: 2024,
    showStatus: 'ended',
    rating: 8.9,
    runtime: 60,
    genres: ['Crime', 'Drama', 'Mystery'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/aowr7xpViYT4J87iAHBqPntbigs.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/wMsC56Nq9FpE1gxLtMFcN3pNuJ6.jpg',
    tagline: 'Touch darkness and darkness touches you back.',
    overview:
      'Anthology series in which police investigations unearth the personal and professional secrets of those involved.',
    network: 'HBO',
    totalEpisodes: 30,
    downloadedEpisodes: 30,
    seasonCount: 4,
    quality: '1080p',
  },
  {
    id: 10,
    title: 'Slow Horses',
    year: 2022,
    showStatus: 'continuing',
    rating: 8.1,
    runtime: 50,
    genres: ['Action', 'Drama', 'Thriller'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/9dOZJFt1NkuahsfSgLCE8xL5SQy.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/jwDpNJbEJSdqYqMlK9pH5wB9Kvq.jpg',
    overview: 'Follows a team of British intelligence agents who serve in a dump for washed-up spies.',
    network: 'Apple TV+',
    totalEpisodes: 24,
    downloadedEpisodes: 18,
    seasonCount: 4,
  },
  {
    id: 11,
    title: 'The Penguin',
    year: 2024,
    showStatus: 'ended',
    rating: 8.5,
    runtime: 55,
    genres: ['Crime', 'Drama'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/a4fDCTJn80pn0crn3dQMBL0U8g.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/bMBpqVOYRTFf9t6oTYUvDMKWA8s.jpg',
    tagline: 'Watch Oz rise.',
    overview: "Follows the Penguin's rise to power in the Gotham criminal underworld.",
    network: 'HBO',
    totalEpisodes: 8,
    downloadedEpisodes: 8,
    seasonCount: 1,
    quality: '4K',
  },
  {
    id: 12,
    title: 'Stranger Things',
    year: 2016,
    showStatus: 'continuing',
    rating: 8.7,
    runtime: 50,
    genres: ['Drama', 'Fantasy', 'Horror'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    tagline: 'Every ending has a beginning.',
    overview:
      'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and terrifying supernatural forces.',
    network: 'Netflix',
    totalEpisodes: 34,
    downloadedEpisodes: 34,
    seasonCount: 4,
    quality: '4K',
    nextEpisode: {
      seasonNumber: 5,
      episodeNumber: 1,
      title: 'The Final Chapter',
      airDate: 'TBA 2025',
    },
  },
];

type TabValue = 'all' | 'continuing' | 'complete' | 'missing';

function filterByTab(shows: EnrichedShow[], tab: TabValue): EnrichedShow[] {
  switch (tab) {
    case 'continuing':
      return shows.filter((s) => s.showStatus === 'continuing');
    case 'complete':
      return shows.filter((s) => s.downloadedEpisodes === s.totalEpisodes && s.totalEpisodes > 0);
    case 'missing':
      return shows.filter((s) => s.downloadedEpisodes < s.totalEpisodes || s.totalEpisodes === 0);
    default:
      return shows;
  }
}

function filterBySearch(shows: EnrichedShow[], search: string): EnrichedShow[] {
  if (!search.trim()) return shows;
  const query = search.toLowerCase();
  return shows.filter(
    (s) =>
      s.title.toLowerCase().includes(query) ||
      s.network?.toLowerCase().includes(query) ||
      s.genres?.some((g) => g.toLowerCase().includes(query))
  );
}

function sortShows(shows: EnrichedShow[], sort: string): EnrichedShow[] {
  const sorted = [...shows];
  switch (sort) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'year':
      return sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    case 'rating':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'nextAiring':
      return sorted.sort((a, b) => {
        // Shows with next episode come first
        if (a.nextEpisode && !b.nextEpisode) return -1;
        if (!a.nextEpisode && b.nextEpisode) return 1;
        return 0;
      });
    case 'added':
    default:
      return sorted;
  }
}

export default function ShowsPage() {
  const [tab, setTab] = useState<TabValue>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('added');

  // Get a featured show (continuing with highest rating and backdrop)
  const featuredShow = mockShows
    .filter((s) => s.showStatus === 'continuing' && s.backdropUrl)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];

  // Apply filters and sorting
  let shows = filterByTab(mockShows, tab);
  shows = filterBySearch(shows, search);
  shows = sortShows(shows, sort);

  // Count for each tab
  const counts = {
    all: mockShows.length,
    continuing: mockShows.filter((s) => s.showStatus === 'continuing').length,
    complete: mockShows.filter((s) => s.downloadedEpisodes === s.totalEpisodes && s.totalEpisodes > 0).length,
    missing: mockShows.filter((s) => s.downloadedEpisodes < s.totalEpisodes || s.totalEpisodes === 0).length,
  };

  // Calculate total episodes
  const totalEpisodes = mockShows.reduce((sum, s) => sum + s.totalEpisodes, 0);
  const downloadedEpisodes = mockShows.reduce((sum, s) => sum + s.downloadedEpisodes, 0);

  return (
    <main className="flex flex-1 flex-col gap-6">
      {/* Featured Show Hero Section */}
      {featuredShow && <FeaturedShow show={featuredShow} />}

      {/* Library Section */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Your Library</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mockShows.length} shows · {downloadedEpisodes}/{totalEpisodes} episodes
            </p>
          </div>
        </div>

        <ShowFilters search={search} onSearchChange={setSearch} sort={sort} onSortChange={setSort} />

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="mt-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="continuing">Continuing ({counts.continuing})</TabsTrigger>
            <TabsTrigger value="complete">Complete ({counts.complete})</TabsTrigger>
            <TabsTrigger value="missing">Missing ({counts.missing})</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-6">
            <ShowGrid shows={shows} />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
