'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ArrowDownToLine, ArrowRight, Pause, Play, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DownloadItem {
  id: string;
  title: string;
  progress: number;
  size: string;
  downloaded: string;
  speed: string;
  eta: string;
  paused: boolean;
}

// Mock data - will be replaced with real API calls
const initialDownloads: DownloadItem[] = [
  {
    id: '1',
    title: 'The Bear S03E05',
    progress: 57,
    size: '2.1 GB',
    downloaded: '1.2 GB',
    speed: '4.2 MB/s',
    eta: '3m',
    paused: false,
  },
  {
    id: '2',
    title: 'Dune: Part Two',
    progress: 23,
    size: '45.2 GB',
    downloaded: '10.4 GB',
    speed: '8.1 MB/s',
    eta: '1h 12m',
    paused: false,
  },
];

function DownloadsCard() {
  const [downloads, setDownloads] = useState(initialDownloads);

  const activeCount = downloads.filter((d) => !d.paused).length;
  const totalSpeed = downloads
    .filter((d) => !d.paused)
    .reduce((acc, d) => acc + parseFloat(d.speed), 0)
    .toFixed(1);

  const togglePause = (id: string) => {
    setDownloads((prev) => prev.map((d) => (d.id === id ? { ...d, paused: !d.paused } : d)));
  };

  const removeDownload = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between pb-3 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <ArrowDownToLine className="size-4 text-emerald-400" />
          </div>
          <div>
            <CardTitle className="text-sm">Downloads</CardTitle>
            <p className="text-xs text-muted-foreground">{totalSpeed} MB/s</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums">{activeCount}</p>
          <Badge variant="secondary" className="text-[10px]">
            +5 queued
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 space-y-3 py-4">
        {downloads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <p className="text-xs text-muted-foreground">No active downloads</p>
          </div>
        ) : (
          downloads.map((item) => (
            <div key={item.id} className="group space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-medium">{item.title}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {item.paused ? 'Paused' : item.eta}
                  </span>
                  <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-5" onClick={() => togglePause(item.id)}>
                          {item.paused ? <Play className="size-3" /> : <Pause className="size-3" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{item.paused ? 'Resume' : 'Pause'}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-5 text-destructive hover:text-destructive"
                          onClick={() => removeDownload(item.id)}
                        >
                          <X className="size-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={item.progress} className="h-1 flex-1" />
                <span className="w-8 text-right text-[10px] tabular-nums text-muted-foreground">{item.progress}%</span>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>
                  {item.downloaded} / {item.size}
                </span>
                {!item.paused && <span>{item.speed}</span>}
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Separator />

      <CardFooter className="p-1 shrink-0">
        <Button variant="ghost" size="sm" className="w-full rounded-none rounded-b-xl" asChild>
          <Link href="/activity/downloads">
            View all downloads
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { DownloadsCard };
