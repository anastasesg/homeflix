'use client';

import Link from 'next/link';

import { BookOpen, Film, HardDrive, Music, Tv } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

// Mock data - will be replaced with real API calls
const libraryStats = {
  movies: 847,
  shows: 124,
  music: 2341,
  books: 89,
  episodes: 4231,
  storage: { used: '12.4 TB', total: '20 TB', percent: 62 },
};

function LibraryCard() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-1 flex-row items-center justify-between pb-3 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10">
            <HardDrive className="size-4 text-violet-400" />
          </div>
          <div>
            <CardTitle className="text-sm">Library</CardTitle>
            <p className="text-xs text-muted-foreground">{libraryStats.episodes.toLocaleString()} episodes</p>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="py-4 flex-1">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" className="h-auto flex-col items-start gap-0 p-3" asChild>
            <Link href="/library/movies">
              <div className="flex w-full items-center gap-2">
                <Film className="size-4 text-muted-foreground" />
                <span className="text-lg font-semibold tabular-nums">{libraryStats.movies.toLocaleString()}</span>
              </div>
              <span className="w-full text-left text-xs text-muted-foreground">Movies</span>
            </Link>
          </Button>
          <Button variant="ghost" className="h-auto flex-col items-start gap-0 p-3" asChild>
            <Link href="/library/shows">
              <div className="flex w-full items-center gap-2">
                <Tv className="size-4 text-muted-foreground" />
                <span className="text-lg font-semibold tabular-nums">{libraryStats.shows}</span>
              </div>
              <span className="w-full text-left text-xs text-muted-foreground">Shows</span>
            </Link>
          </Button>
          <Button variant="ghost" className="h-auto flex-col items-start gap-0 p-3" asChild>
            <Link href="/library/music">
              <div className="flex w-full items-center gap-2">
                <Music className="size-4 text-muted-foreground" />
                <span className="text-lg font-semibold tabular-nums">{libraryStats.music.toLocaleString()}</span>
              </div>
              <span className="w-full text-left text-xs text-muted-foreground">Albums</span>
            </Link>
          </Button>
          <Button variant="ghost" className="h-auto flex-col items-start gap-0 p-3" asChild>
            <Link href="/library/books">
              <div className="flex w-full items-center gap-2">
                <BookOpen className="size-4 text-muted-foreground" />
                <span className="text-lg font-semibold tabular-nums">{libraryStats.books}</span>
              </div>
              <span className="w-full text-left text-xs text-muted-foreground">Books</span>
            </Link>
          </Button>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex-1 flex-col items-stretch gap-2 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Storage</span>
          <span className="tabular-nums">
            {libraryStats.storage.used} / {libraryStats.storage.total}
          </span>
        </div>
        <Progress value={libraryStats.storage.percent} className="h-1.5" />
      </CardFooter>
    </Card>
  );
}

export { LibraryCard };
