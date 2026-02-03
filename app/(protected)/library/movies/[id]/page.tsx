import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Film,
  HardDrive,
  MoreHorizontal,
  Play,
  RefreshCw,
  Search,
  Star,
  Trash2,
  TrendingUp,
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { FilesTab, HistoryTab, ManageTab, type Movie, OverviewTab } from './_components';

// Mock movie database - will be replaced with Radarr API calls
const mockMovies: Record<string, Movie> = {
  '1': {
    id: 1,
    title: 'Dune: Part Two',
    year: 2024,
    runtime: 166,
    rating: 8.5,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    overview:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
    tagline: 'Long live the fighters.',
    status: 'downloaded',
    quality: '4K',
    size: '45.2 GB',
    addedAt: 'Jan 15, 2024',
    requestedBy: 'Alex',
    monitored: true,
    posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    qualityProfileId: 5,
    certification: 'PG-13',
    budget: 190000000,
    revenue: 711844358,
    originalLanguage: 'English',
    imdbId: 'tt15239678',
    tmdbId: 693134,
    keywords: ['desert', 'based on novel', 'prophet', 'revenge', 'epic', 'chosen one', 'sequel'],
    productionCompanies: [
      { name: 'Legendary Pictures', logoUrl: 'https://image.tmdb.org/t/p/w200/8M99Dkt23MjQMTTWukq4m5XsEuo.png' },
      { name: 'Warner Bros. Pictures', logoUrl: 'https://image.tmdb.org/t/p/w200/ky0xOc5OrhzkZ1N6KyUxacfQsCk.png' },
    ],
    media: {
      backdrops: [
        'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        'https://image.tmdb.org/t/p/original/lzWHmYdfeFiMIY4JaMmtR7GEli3.jpg',
        'https://image.tmdb.org/t/p/original/cjeDbVfBp6Qvb3C74Dfy7BKDTQN.jpg',
        'https://image.tmdb.org/t/p/original/gorGtaFxIRtUgPInPNKdgtDq8Zr.jpg',
      ],
      posters: ['https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'],
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    },
    files: [
      {
        id: 1,
        path: '/media/movies/Dune Part Two (2024)/Dune.Part.Two.2024.2160p.UHD.BluRay.x265-GROUP.mkv',
        size: '45.2 GB',
        quality: 'Bluray-2160p',
        videoCodec: 'x265',
        audioCodec: 'TrueHD Atmos',
        resolution: '3840x2160',
      },
    ],
    history: [
      { id: 1, type: 'downloaded', date: 'Jan 15, 2024', quality: 'Bluray-2160p', downloadClient: 'qBittorrent' },
      { id: 2, type: 'grabbed', date: 'Jan 15, 2024', quality: 'Bluray-2160p', indexer: 'NZBgeek' },
    ],
    cast: [
      {
        name: 'Timothée Chalamet',
        character: 'Paul Atreides',
        profileUrl: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg',
        order: 0,
      },
      {
        name: 'Zendaya',
        character: 'Chani',
        profileUrl: 'https://image.tmdb.org/t/p/w185/6TE2AlOUqcrs7CyJiWYgodmee1r.jpg',
        order: 1,
      },
      {
        name: 'Rebecca Ferguson',
        character: 'Lady Jessica',
        profileUrl: 'https://image.tmdb.org/t/p/w185/lJloTOheuQSirSLXNA3JHsrMNfH.jpg',
        order: 2,
      },
      {
        name: 'Josh Brolin',
        character: 'Gurney Halleck',
        profileUrl: 'https://image.tmdb.org/t/p/w185/sX2aOnTez6VDKpZPGMhaJ85QWvW.jpg',
        order: 3,
      },
      {
        name: 'Austin Butler',
        character: 'Feyd-Rautha Harkonnen',
        profileUrl: 'https://image.tmdb.org/t/p/w185/jSWdBvuYGnHDwNoqMD18YVSCXET.jpg',
        order: 4,
      },
      {
        name: 'Florence Pugh',
        character: 'Princess Irulan',
        profileUrl: 'https://image.tmdb.org/t/p/w185/6mKy8cQVvZm9C4XRgxLWJdQzJDd.jpg',
        order: 5,
      },
      {
        name: 'Dave Bautista',
        character: 'Glossu Rabban',
        profileUrl: 'https://image.tmdb.org/t/p/w185/qLOxvnNPzhuQjMqMQC0QgvXFT9.jpg',
        order: 6,
      },
      {
        name: 'Christopher Walken',
        character: 'Emperor Shaddam IV',
        profileUrl: 'https://image.tmdb.org/t/p/w185/vPMlmC8v0kLBHEGmYBqN3rOx55f.jpg',
        order: 7,
      },
      {
        name: 'Léa Seydoux',
        character: 'Lady Margot',
        profileUrl: 'https://image.tmdb.org/t/p/w185/nFoxHs9fGnuyQXkB0rwxpXNgFxX.jpg',
        order: 8,
      },
      {
        name: 'Stellan Skarsgård',
        character: 'Baron Vladimir Harkonnen',
        profileUrl: 'https://image.tmdb.org/t/p/w185/x78TS8e3hJnFyfljhR5a2HAJfge.jpg',
        order: 9,
      },
      {
        name: 'Charlotte Rampling',
        character: 'Reverend Mother Mohiam',
        profileUrl: 'https://image.tmdb.org/t/p/w185/z73PyeMnVNpzOqKa1neIEJiuBYj.jpg',
        order: 10,
      },
      {
        name: 'Javier Bardem',
        character: 'Stilgar',
        profileUrl: 'https://image.tmdb.org/t/p/w185/IShnFg6ijTMxZkGRV8l0eBDdVH.jpg',
        order: 11,
      },
    ],
    crew: [
      {
        name: 'Denis Villeneuve',
        job: 'Director',
        department: 'Directing',
        profileUrl: 'https://image.tmdb.org/t/p/w185/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg',
      },
      {
        name: 'Hans Zimmer',
        job: 'Original Music Composer',
        department: 'Sound',
        profileUrl: 'https://image.tmdb.org/t/p/w185/tpQnDeHY15szIXvpnhlprufz4d.jpg',
      },
      {
        name: 'Greig Fraser',
        job: 'Director of Photography',
        department: 'Camera',
        profileUrl: 'https://image.tmdb.org/t/p/w185/7aMIkJBqNjBzC2OVVlgLxfNVz5x.jpg',
      },
      {
        name: 'Frank Herbert',
        job: 'Novel',
        department: 'Writing',
        profileUrl: 'https://image.tmdb.org/t/p/w185/mFhOqhUU1lnE4mv0AMXTL0wK6Ni.jpg',
      },
    ],
  },
  '2': {
    id: 2,
    title: 'Oppenheimer',
    year: 2023,
    runtime: 180,
    rating: 8.4,
    genres: ['Biography', 'Drama', 'History'],
    overview:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    status: 'downloaded',
    quality: '1080p',
    size: '18.7 GB',
    addedAt: 'Dec 10, 2023',
    monitored: true,
    posterUrl: '',
    qualityProfileId: 4,
    files: [
      {
        id: 1,
        path: '/media/movies/Oppenheimer (2023)/Oppenheimer.2023.1080p.BluRay.x264-GROUP.mkv',
        size: '18.7 GB',
        quality: 'Bluray-1080p',
        videoCodec: 'x264',
        audioCodec: 'DTS-HD MA',
        resolution: '1920x1080',
      },
    ],
    history: [
      { id: 1, type: 'downloaded', date: 'Dec 10, 2023', quality: 'Bluray-1080p', downloadClient: 'qBittorrent' },
    ],
    cast: [
      { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer' },
      { name: 'Emily Blunt', character: 'Kitty Oppenheimer' },
      { name: 'Matt Damon', character: 'Leslie Groves' },
      { name: 'Robert Downey Jr.', character: 'Lewis Strauss' },
    ],
  },
  '7': {
    id: 7,
    title: 'Challengers',
    year: 2024,
    runtime: 131,
    rating: 7.8,
    genres: ['Drama', 'Romance', 'Sport'],
    overview:
      'Tashi, a tennis player turned coach, has taken her husband from a mediocre player to a world-famous grand slam champion.',
    status: 'missing',
    addedAt: 'Feb 1, 2024',
    monitored: true,
    posterUrl: '',
    qualityProfileId: 4,
    files: [],
    history: [
      { id: 1, type: 'failed', date: 'Feb 2, 2024', quality: 'WEBDL-1080p', reason: 'No matching files found' },
    ],
    cast: [
      { name: 'Zendaya', character: 'Tashi Duncan' },
      { name: "Josh O'Connor", character: 'Patrick Zweig' },
      { name: 'Mike Faist', character: 'Art Donaldson' },
    ],
  },
};

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  }
  return `$${amount.toLocaleString()}`;
}

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Look up movie by ID
  const movie = mockMovies[id];

  if (!movie) {
    notFound();
  }

  const statusColor = {
    downloaded: 'bg-emerald-500/20 text-emerald-400',
    downloading: 'bg-blue-500/20 text-blue-400',
    missing: 'bg-amber-500/20 text-amber-400',
    wanted: 'bg-muted text-muted-foreground',
  }[movie.status];

  const statusLabel = {
    downloaded: 'Downloaded',
    downloading: 'Downloading',
    missing: 'Missing',
    wanted: 'Wanted',
  }[movie.status];

  const hasFile = movie.files.length > 0;
  const profit = movie.revenue && movie.budget ? movie.revenue - movie.budget : null;

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Backdrop Section */}
      <section className="relative mb-6 overflow-hidden rounded-xl">
        {/* Backdrop Image */}
        {movie.backdropUrl && (
          <img src={movie.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
            <Link href="/library/movies">
              <ArrowLeft className="size-4" />
              Back to Movies
            </Link>
          </Button>

          {/* Main content row */}
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Poster */}
            <div className="w-full shrink-0 sm:w-44 md:w-52">
              <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 text-center text-sm text-muted-foreground">
                    {movie.title}
                  </div>
                )}
              </AspectRatio>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-end">
              {/* Production company */}
              {movie.productionCompanies && movie.productionCompanies.length > 0 && (
                <div className="mb-2 flex items-center gap-3">
                  {movie.productionCompanies
                    .slice(0, 2)
                    .map((company) =>
                      company.logoUrl ? (
                        <img
                          key={company.name}
                          src={company.logoUrl}
                          alt={company.name}
                          className="h-4 brightness-0 invert"
                        />
                      ) : null
                    )}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{movie.title}</h1>

              {/* Year */}
              <p className="mt-1 text-lg text-muted-foreground">{movie.year}</p>

              {/* Tagline */}
              {movie.tagline && (
                <p className="mt-2 text-sm italic text-muted-foreground/80">&ldquo;{movie.tagline}&rdquo;</p>
              )}

              {/* Metadata row */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                {/* Rating */}
                {movie.rating && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-black/30 px-2.5 py-1.5 backdrop-blur-sm">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold tabular-nums">{movie.rating}</span>
                  </div>
                )}

                {/* Status */}
                <Badge className={cn('shadow-lg', statusColor)}>{statusLabel}</Badge>

                {/* Certification */}
                {movie.certification && (
                  <Badge variant="outline" className="border-white/30 font-mono text-xs">
                    {movie.certification}
                  </Badge>
                )}

                <Separator orientation="vertical" className="h-4 bg-white/20" />

                {/* Runtime */}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-4" />
                  {formatRuntime(movie.runtime)}
                </span>

                {/* Genres */}
                <span className="text-muted-foreground">{movie.genres.join(' / ')}</span>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {movie.media?.trailerUrl && (
                  <Button className="gap-2 bg-white text-black hover:bg-white/90" asChild>
                    <a href={movie.media.trailerUrl} target="_blank" rel="noopener noreferrer">
                      <Play className="size-4 fill-current" />
                      Watch Trailer
                    </a>
                  </Button>
                )}

                <Button variant="outline" className="gap-2 border-white/20 hover:bg-white/10">
                  <Search className="size-4" />
                  {hasFile ? 'Search Upgrade' : 'Search Now'}
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
                      {movie.monitored ? (
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
                        movie.monitored ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-muted-foreground'
                      )}
                    >
                      {movie.monitored ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{movie.monitored ? 'Monitored' : 'Not Monitored'}</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Status */}
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Status</p>
              <p className="text-xl font-bold">{statusLabel}</p>
            </div>
            <div
              className={cn(
                'flex size-10 items-center justify-center rounded-full',
                movie.status === 'downloaded'
                  ? 'bg-emerald-500/10'
                  : movie.status === 'missing'
                    ? 'bg-amber-500/10'
                    : 'bg-blue-500/10'
              )}
            >
              {movie.status === 'downloaded' ? (
                <CheckCircle2 className="size-5 text-emerald-400" />
              ) : (
                <Film className="size-5 text-amber-400" />
              )}
            </div>
          </div>
          {movie.quality && <p className="mt-3 text-xs text-muted-foreground">Quality: {movie.quality}</p>}
        </div>

        {/* Storage */}
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Storage</p>
              <p className="text-2xl font-bold tabular-nums">{movie.size || '—'}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10">
              <HardDrive className="size-5 text-amber-400" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{movie.files.length} file(s)</p>
        </div>

        {/* Box Office / Budget */}
        {movie.revenue ? (
          <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Box Office</p>
                <p className="text-2xl font-bold tabular-nums">{formatCurrency(movie.revenue)}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                <TrendingUp className="size-5 text-emerald-400" />
              </div>
            </div>
            {profit !== null && (
              <p className={cn('mt-3 text-xs', profit > 0 ? 'text-emerald-400' : 'text-red-400')}>
                {profit > 0 ? '+' : ''}
                {formatCurrency(profit)} profit
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Runtime</p>
                <p className="text-2xl font-bold tabular-nums">{formatRuntime(movie.runtime)}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
                <Clock className="size-5 text-blue-400" />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{movie.runtime} minutes</p>
          </div>
        )}

        {/* Added */}
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Added</p>
              <p className="text-lg font-bold">{movie.addedAt}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10">
              <Calendar className="size-5 text-purple-400" />
            </div>
          </div>
          {movie.requestedBy && <p className="mt-3 text-xs text-muted-foreground">by {movie.requestedBy}</p>}
        </div>
      </div>

      {/* Overview text */}
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{movie.overview}</p>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger
            value="manage"
            className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-amber-500 data-[state=active]:bg-transparent"
          >
            Manage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab movie={movie} />
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <FilesTab movie={movie} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <HistoryTab movie={movie} />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <ManageTab movie={movie} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
