'use client';

import Link from 'next/link';

import { ArrowRight, Calendar, Film, Tv } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type MediaType = 'movie' | 'show';

interface UpcomingItem {
  id: string;
  title: string;
  subtitle: string;
  type: MediaType;
  date: string;
  dateLabel: string;
}

// Mock data - will be replaced with real API calls
const upcomingReleases: UpcomingItem[] = [
  { id: '1', title: 'Severance', subtitle: 'S02E07', type: 'show', date: '2024-02-07', dateLabel: 'Tomorrow' },
  { id: '2', title: 'The White Lotus', subtitle: 'S03E05', type: 'show', date: '2024-02-09', dateLabel: 'Sat' },
  { id: '3', title: 'Dune: Part Two', subtitle: 'Movie', type: 'movie', date: '2024-02-14', dateLabel: 'Feb 14' },
  { id: '4', title: 'Shogun', subtitle: 'S01E08', type: 'show', date: '2024-02-15', dateLabel: 'Feb 15' },
];

function UpcomingReleases() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500/10">
            <Calendar className="size-4 text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-sm">Upcoming</CardTitle>
            <p className="text-xs text-muted-foreground">Releases you&apos;re tracking</p>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 py-3">
        {upcomingReleases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <p className="text-xs text-muted-foreground">No upcoming releases</p>
          </div>
        ) : (
          <div className="space-y-1">
            {upcomingReleases.map((item) => (
              <Link
                key={item.id}
                href={`/media/${item.type === 'movie' ? 'movies' : 'shows'}/${item.id}`}
                className="group flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-secondary/50"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
                  {item.type === 'movie' ? (
                    <Film className="size-3 text-muted-foreground" />
                  ) : (
                    <Tv className="size-3 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  {item.dateLabel}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="p-0">
        <Button variant="ghost" size="sm" className="w-full rounded-none rounded-b-xl" asChild>
          <Link href="/discover/calendar">
            View calendar
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { UpcomingReleases };
