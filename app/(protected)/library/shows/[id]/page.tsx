import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  HardDrive,
  MoreHorizontal,
  Play,
  RefreshCw,
  Search,
  Star,
  Trash2,
  Tv2,
} from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { FilesTab, HistoryTab, ManageTab, OverviewTab, type Show } from './_components';

// Mock show database - will be replaced with Sonarr API calls
const mockShows: Record<string, Show> = {
  '1': {
    id: 1,
    title: 'The Bear',
    year: 2022,
    runtime: 30,
    rating: 8.6,
    genres: ['Drama', 'Comedy'],
    overview:
      "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop after a tragedy. As he navigates the chaotic environment of the small kitchen, he must manage the distinct personalities of the staff while transforming the establishment.",
    tagline: 'Every second counts.',
    showStatus: 'continuing',
    quality: '1080p',
    totalSize: '42.3 GB',
    addedAt: 'Jun 23, 2022',
    requestedBy: 'Alex',
    monitored: true,
    posterUrl: 'https://image.tmdb.org/t/p/w500/sHFlbKS3WLqMnp9t6ghKBkGl5n1.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/fVbTkCwQu9t8FYQpQCVJc9xPQPT.jpg',
    qualityProfileId: 4,
    certification: 'TV-MA',
    originalLanguage: 'English',
    imdbId: 'tt14452776',
    tvdbId: 396254,
    keywords: ['restaurant', 'chicago', 'family business', 'chef', 'kitchen', 'stress', 'redemption'],
    network: {
      name: 'FX',
      logoUrl: 'https://image.tmdb.org/t/p/w200/aexGjtcs42DgRtZh7zOLc8vMwZQ.png',
    },
    media: {
      backdrops: [
        'https://image.tmdb.org/t/p/original/fVbTkCwQu9t8FYQpQCVJc9xPQPT.jpg',
        'https://image.tmdb.org/t/p/original/vHRf5MZLpYtKxmBOHI0E7vD6GKh.jpg',
      ],
      posters: ['https://image.tmdb.org/t/p/w500/sHFlbKS3WLqMnp9t6ghKBkGl5n1.jpg'],
      trailerUrl: 'https://www.youtube.com/watch?v=y-cqqAJIXhs',
    },
    seasons: [
      {
        id: 1,
        seasonNumber: 1,
        episodeCount: 8,
        downloadedCount: 8,
        airDate: 'Jun 23, 2022',
        overview:
          'Carmen "Carmy" Berzatto, a young chef from the fine dining world, returns home to Chicago to run his family\'s sandwich shop.',
        episodes: [
          {
            id: 1,
            episodeNumber: 1,
            title: 'System',
            airDate: 'Jun 23, 2022',
            runtime: 30,
            status: 'downloaded',
            quality: '1080p',
            size: '1.2 GB',
          },
          {
            id: 2,
            episodeNumber: 2,
            title: 'Hands',
            airDate: 'Jun 23, 2022',
            runtime: 28,
            status: 'downloaded',
            quality: '1080p',
            size: '1.1 GB',
          },
          {
            id: 3,
            episodeNumber: 3,
            title: 'Brigade',
            airDate: 'Jun 23, 2022',
            runtime: 31,
            status: 'downloaded',
            quality: '1080p',
            size: '1.2 GB',
          },
          {
            id: 4,
            episodeNumber: 4,
            title: 'Dogs',
            airDate: 'Jun 23, 2022',
            runtime: 27,
            status: 'downloaded',
            quality: '1080p',
            size: '1.0 GB',
          },
          {
            id: 5,
            episodeNumber: 5,
            title: 'Sheridan',
            airDate: 'Jun 23, 2022',
            runtime: 30,
            status: 'downloaded',
            quality: '1080p',
            size: '1.2 GB',
          },
          {
            id: 6,
            episodeNumber: 6,
            title: 'Ceres',
            airDate: 'Jun 23, 2022',
            runtime: 29,
            status: 'downloaded',
            quality: '1080p',
            size: '1.1 GB',
          },
          {
            id: 7,
            episodeNumber: 7,
            title: 'Review',
            airDate: 'Jun 23, 2022',
            runtime: 21,
            status: 'downloaded',
            quality: '1080p',
            size: '0.9 GB',
          },
          {
            id: 8,
            episodeNumber: 8,
            title: 'Braciole',
            airDate: 'Jun 23, 2022',
            runtime: 33,
            status: 'downloaded',
            quality: '1080p',
            size: '1.3 GB',
          },
        ],
      },
      {
        id: 2,
        seasonNumber: 2,
        episodeCount: 10,
        downloadedCount: 10,
        airDate: 'Jun 22, 2023',
        overview: 'Carmy pushes himself harder than ever to transform The Beef while his team develops their skills.',
        episodes: [
          {
            id: 9,
            episodeNumber: 1,
            title: 'Beef',
            airDate: 'Jun 22, 2023',
            runtime: 31,
            status: 'downloaded',
            quality: '1080p',
            size: '1.2 GB',
          },
          {
            id: 10,
            episodeNumber: 2,
            title: 'Pasta',
            airDate: 'Jun 22, 2023',
            runtime: 28,
            status: 'downloaded',
            quality: '1080p',
            size: '1.1 GB',
          },
          {
            id: 11,
            episodeNumber: 3,
            title: 'Sundae',
            airDate: 'Jun 22, 2023',
            runtime: 30,
            status: 'downloaded',
            quality: '1080p',
            size: '1.2 GB',
          },
          {
            id: 12,
            episodeNumber: 4,
            title: 'Honeydew',
            airDate: 'Jun 22, 2023',
            runtime: 29,
            status: 'downloaded',
            quality: '1080p',
            size: '1.1 GB',
          },
          {
            id: 13,
            episodeNumber: 5,
            title: 'Pop',
            airDate: 'Jun 22, 2023',
            runtime: 32,
            status: 'downloaded',
            quality: '1080p',
            size: '1.3 GB',
          },
          {
            id: 14,
            episodeNumber: 6,
            title: 'Fishes',
            airDate: 'Jun 22, 2023',
            runtime: 65,
            status: 'downloaded',
            quality: '1080p',
            size: '2.4 GB',
          },
          {
            id: 15,
            episodeNumber: 7,
            title: 'Forks',
            airDate: 'Jun 22, 2023',
            runtime: 37,
            status: 'downloaded',
            quality: '1080p',
            size: '1.4 GB',
          },
          {
            id: 16,
            episodeNumber: 8,
            title: 'Bolognese',
            airDate: 'Jun 22, 2023',
            runtime: 42,
            status: 'downloaded',
            quality: '1080p',
            size: '1.6 GB',
          },
          {
            id: 17,
            episodeNumber: 9,
            title: 'Omelette',
            airDate: 'Jun 22, 2023',
            runtime: 35,
            status: 'downloaded',
            quality: '1080p',
            size: '1.3 GB',
          },
          {
            id: 18,
            episodeNumber: 10,
            title: 'The Bear',
            airDate: 'Jun 22, 2023',
            runtime: 40,
            status: 'downloaded',
            quality: '1080p',
            size: '1.5 GB',
          },
        ],
      },
      {
        id: 3,
        seasonNumber: 3,
        episodeCount: 10,
        downloadedCount: 10,
        airDate: 'Jun 27, 2024',
        overview:
          'The Bear is now a fine dining restaurant, but the pressure intensifies as Carmy strives for culinary excellence.',
        episodes: [
          {
            id: 19,
            episodeNumber: 1,
            title: 'Tomorrow',
            airDate: 'Jun 27, 2024',
            runtime: 28,
            status: 'downloaded',
            quality: '1080p',
            size: '1.1 GB',
          },
          {
            id: 20,
            episodeNumber: 2,
            title: 'Next',
            airDate: 'Jun 27, 2024',
            runtime: 31,
            status: 'downloaded',
            quality: '1080p',
            size: '1.2 GB',
          },
          {
            id: 21,
            episodeNumber: 3,
            title: 'Doors',
            airDate: 'Jun 27, 2024',
            runtime: 29,
            status: 'downloaded',
            quality: '1080p',
            size: '1.1 GB',
          },
          {
            id: 22,
            episodeNumber: 4,
            title: 'Violet',
            airDate: 'Jun 27, 2024',
            runtime: 30,
            status: 'downloaded',
            quality: '1080p',
            size: '1.2 GB',
          },
          {
            id: 23,
            episodeNumber: 5,
            title: 'Children',
            airDate: 'Jun 27, 2024',
            runtime: 27,
            status: 'downloaded',
            quality: '1080p',
            size: '1.0 GB',
          },
          {
            id: 24,
            episodeNumber: 6,
            title: 'Napkins',
            airDate: 'Jun 27, 2024',
            runtime: 32,
            status: 'downloaded',
            quality: '1080p',
            size: '1.2 GB',
          },
          {
            id: 25,
            episodeNumber: 7,
            title: 'Legacy',
            airDate: 'Jun 27, 2024',
            runtime: 34,
            status: 'downloaded',
            quality: '1080p',
            size: '1.3 GB',
          },
          {
            id: 26,
            episodeNumber: 8,
            title: 'Ice Chips',
            airDate: 'Jun 27, 2024',
            runtime: 25,
            status: 'downloaded',
            quality: '1080p',
            size: '1.0 GB',
          },
          {
            id: 27,
            episodeNumber: 9,
            title: 'Apologies',
            airDate: 'Jun 27, 2024',
            runtime: 28,
            status: 'downloaded',
            quality: '1080p',
            size: '1.1 GB',
          },
          {
            id: 28,
            episodeNumber: 10,
            title: 'Forever',
            airDate: 'Jun 27, 2024',
            runtime: 35,
            status: 'downloaded',
            quality: '1080p',
            size: '1.4 GB',
          },
        ],
      },
    ],
    files: [
      {
        id: 1,
        path: '/media/tv/The Bear/Season 01/The.Bear.S01E01.1080p.WEB.mkv',
        size: '1.2 GB',
        quality: 'WEBDL-1080p',
        videoCodec: 'x264',
        audioCodec: 'AAC',
        resolution: '1920x1080',
        seasonNumber: 1,
        episodeNumber: 1,
        episodeTitle: 'System',
      },
      {
        id: 2,
        path: '/media/tv/The Bear/Season 01/The.Bear.S01E02.1080p.WEB.mkv',
        size: '1.1 GB',
        quality: 'WEBDL-1080p',
        videoCodec: 'x264',
        audioCodec: 'AAC',
        resolution: '1920x1080',
        seasonNumber: 1,
        episodeNumber: 2,
        episodeTitle: 'Hands',
      },
      {
        id: 3,
        path: '/media/tv/The Bear/Season 02/The.Bear.S02E06.1080p.WEB.mkv',
        size: '2.4 GB',
        quality: 'WEBDL-1080p',
        videoCodec: 'x264',
        audioCodec: 'AAC',
        resolution: '1920x1080',
        seasonNumber: 2,
        episodeNumber: 6,
        episodeTitle: 'Fishes',
      },
    ],
    history: [
      {
        id: 1,
        type: 'downloaded',
        date: 'Jun 27, 2024',
        quality: 'WEBDL-1080p',
        downloadClient: 'qBittorrent',
        seasonNumber: 3,
        episodeNumber: 10,
        episodeTitle: 'Forever',
      },
      {
        id: 2,
        type: 'grabbed',
        date: 'Jun 27, 2024',
        quality: 'WEBDL-1080p',
        indexer: 'NZBgeek',
        seasonNumber: 3,
        episodeNumber: 10,
        episodeTitle: 'Forever',
      },
      {
        id: 3,
        type: 'downloaded',
        date: 'Jun 22, 2023',
        quality: 'WEBDL-1080p',
        downloadClient: 'qBittorrent',
        seasonNumber: 2,
        episodeNumber: 6,
        episodeTitle: 'Fishes',
      },
    ],
    cast: [
      {
        name: 'Jeremy Allen White',
        character: 'Carmen "Carmy" Berzatto',
        profileUrl: 'https://image.tmdb.org/t/p/w185/6PVLC0RoTb1V99fNZQvO99fG3qL.jpg',
        order: 0,
      },
      {
        name: 'Ebon Moss-Bachrach',
        character: 'Richard "Richie" Jerimovich',
        profileUrl: 'https://image.tmdb.org/t/p/w185/3VTwNfMiNB8aVZ3RFvQPeHB5EfP.jpg',
        order: 1,
      },
      {
        name: 'Ayo Edebiri',
        character: 'Sydney Adamu',
        profileUrl: 'https://image.tmdb.org/t/p/w185/u9V1eeH4V7C7HKlDk0cJT8JO6NI.jpg',
        order: 2,
      },
      {
        name: 'Lionel Boyce',
        character: 'Marcus',
        profileUrl: 'https://image.tmdb.org/t/p/w185/88IjfhSXhYKQxu0B4f6rVJvRjKz.jpg',
        order: 3,
      },
      {
        name: 'Liza Colón-Zayas',
        character: 'Tina',
        profileUrl: 'https://image.tmdb.org/t/p/w185/4FqvkJONqT5LCNT6cWqdnNOPk16.jpg',
        order: 4,
      },
      {
        name: 'Abby Elliott',
        character: 'Natalie "Sugar" Berzatto',
        profileUrl: 'https://image.tmdb.org/t/p/w185/weCKMvfpfJt9BCLfnYVk7P6aKN.jpg',
        order: 5,
      },
    ],
    crew: [
      {
        name: 'Christopher Storer',
        job: 'Creator',
        department: 'Writing',
        profileUrl: 'https://image.tmdb.org/t/p/w185/u99LV3KQSE1h1zGHPEqPWMfKT6n.jpg',
      },
      { name: 'Joanna Calo', job: 'Executive Producer', department: 'Production' },
    ],
    nextAiring: {
      seasonNumber: 4,
      episodeNumber: 1,
      title: 'TBA',
      airDate: 'Summer 2025',
    },
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ShowDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Look up show by ID
  const show = mockShows[id];

  if (!show) {
    notFound();
  }

  // Calculate totals
  const totalEpisodes = show.seasons.reduce((sum, s) => sum + s.episodeCount, 0);
  const downloadedEpisodes = show.seasons.reduce((sum, s) => sum + s.downloadedCount, 0);
  const progressPercent = totalEpisodes > 0 ? Math.round((downloadedEpisodes / totalEpisodes) * 100) : 0;

  const statusColor = {
    continuing: 'bg-blue-500/20 text-blue-400',
    ended: 'bg-muted text-muted-foreground',
    upcoming: 'bg-amber-500/20 text-amber-400',
  }[show.showStatus];

  const statusLabel = {
    continuing: 'Continuing',
    ended: 'Ended',
    upcoming: 'Upcoming',
  }[show.showStatus];

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Backdrop Section */}
      <section className="relative mb-6 overflow-hidden rounded-xl">
        {/* Backdrop Image */}
        {show.backdropUrl && (
          <img src={show.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Noise texture overlay for cinematic feel */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content overlay */}
        <div className="relative p-4 sm:p-6 lg:p-8">
          {/* Back navigation */}
          <Button variant="ghost" size="sm" className="mb-4 bg-black/20 backdrop-blur-sm hover:bg-black/30" asChild>
            <Link href="/library/shows">
              <ArrowLeft className="size-4" />
              Back to Shows
            </Link>
          </Button>

          {/* Main content row */}
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Poster */}
            <div className="w-full shrink-0 sm:w-44 md:w-52">
              <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
                {show.posterUrl ? (
                  <img src={show.posterUrl} alt={show.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 text-center text-sm text-muted-foreground">
                    {show.title}
                  </div>
                )}
              </AspectRatio>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-end">
              {/* Network badge */}
              {show.network && (
                <div className="mb-2 flex items-center gap-2">
                  {show.network.logoUrl && (
                    <img src={show.network.logoUrl} alt={show.network.name} className="h-5 brightness-0 invert" />
                  )}
                  {!show.network.logoUrl && (
                    <Badge variant="outline" className="border-white/20 text-xs">
                      {show.network.name}
                    </Badge>
                  )}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{show.title}</h1>

              {/* Year range */}
              <p className="mt-1 text-lg text-muted-foreground">
                {show.year}
                {show.endYear && show.endYear !== show.year
                  ? `–${show.endYear}`
                  : show.showStatus === 'continuing'
                    ? '–'
                    : ''}
              </p>

              {/* Tagline */}
              {show.tagline && (
                <p className="mt-2 text-sm italic text-muted-foreground/80">&ldquo;{show.tagline}&rdquo;</p>
              )}

              {/* Metadata row */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                {/* Rating */}
                <div className="flex items-center gap-1.5 rounded-lg bg-black/30 px-2.5 py-1.5 backdrop-blur-sm">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold tabular-nums">{show.rating}</span>
                </div>

                {/* Status */}
                <Badge className={cn('shadow-lg', statusColor)}>{statusLabel}</Badge>

                {/* Certification */}
                {show.certification && (
                  <Badge variant="outline" className="border-white/30 font-mono text-xs">
                    {show.certification}
                  </Badge>
                )}

                <Separator orientation="vertical" className="h-4 bg-white/20" />

                {/* Runtime */}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-4" />
                  {show.runtime}m/ep
                </span>

                {/* Seasons */}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Tv2 className="size-4" />
                  {show.seasons.length} Seasons
                </span>

                {/* Genres */}
                <span className="text-muted-foreground">{show.genres.join(' / ')}</span>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {show.media?.trailerUrl && (
                  <Button className="gap-2 bg-white text-black hover:bg-white/90" asChild>
                    <a href={show.media.trailerUrl} target="_blank" rel="noopener noreferrer">
                      <Play className="size-4 fill-current" />
                      Watch Trailer
                    </a>
                  </Button>
                )}

                <Button variant="outline" className="gap-2 border-white/20 hover:bg-white/10">
                  <Search className="size-4" />
                  Search Missing
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <RefreshCw className="size-4" />
                      Refresh metadata
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {show.monitored ? (
                        <>
                          <EyeOff className="size-4" />
                          Unmonitor
                        </>
                      ) : (
                        <>
                          <Eye className="size-4" />
                          Monitor
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="size-4" />
                      Remove from library
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Monitoring indicator */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'flex size-9 items-center justify-center rounded-full',
                        show.monitored ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-muted-foreground'
                      )}
                    >
                      {show.monitored ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{show.monitored ? 'Monitored' : 'Not Monitored'}</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Progress */}
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Progress</p>
              <p className="text-2xl font-bold tabular-nums">{progressPercent}%</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="size-5 text-emerald-400" />
            </div>
          </div>
          <Progress value={progressPercent} className="mt-3 h-1.5" />
          <p className="mt-2 text-xs text-muted-foreground">
            {downloadedEpisodes}/{totalEpisodes} episodes
          </p>
        </div>

        {/* Storage */}
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Storage</p>
              <p className="text-2xl font-bold tabular-nums">{show.totalSize || '—'}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10">
              <HardDrive className="size-5 text-amber-400" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Quality: {show.quality || 'Mixed'}</p>
        </div>

        {/* Seasons */}
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Seasons</p>
              <p className="text-2xl font-bold tabular-nums">{show.seasons.length}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
              <Tv2 className="size-5 text-blue-400" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{totalEpisodes} total episodes</p>
        </div>

        {/* Added */}
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Added</p>
              <p className="text-lg font-bold">{show.addedAt}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10">
              <Calendar className="size-5 text-purple-400" />
            </div>
          </div>
          {show.requestedBy && <p className="mt-3 text-xs text-muted-foreground">by {show.requestedBy}</p>}
        </div>
      </div>

      {/* Next Episode Alert */}
      {show.nextAiring && (
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent p-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/20">
            <Calendar className="size-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-amber-400/80">Next Episode</p>
            <p className="font-semibold">
              Season {show.nextAiring.seasonNumber} Episode {show.nextAiring.episodeNumber}
              {show.nextAiring.title && show.nextAiring.title !== 'TBA' && ` — ${show.nextAiring.title}`}
            </p>
          </div>
          {show.nextAiring.airDate && (
            <Badge className="bg-amber-500/20 text-amber-400">{show.nextAiring.airDate}</Badge>
          )}
        </div>
      )}

      {/* Overview text */}
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{show.overview}</p>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab show={show} />
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <FilesTab show={show} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <HistoryTab show={show} />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <ManageTab show={show} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
