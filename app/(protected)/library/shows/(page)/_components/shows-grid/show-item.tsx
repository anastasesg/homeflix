'use client';

import { Calendar, Star, Tv2 } from 'lucide-react';

import { ShowItem as ShowItemType } from '@/api/entities';

import { MediaListItem, type StatusConfig } from '@/components/media';
import { Progress } from '@/components/ui/progress';

interface ShowItemProps {
  show: ShowItemType;
  status: StatusConfig;
}

function ShowItem({ show, status }: ShowItemProps) {
  const progressPercent = show.totalEpisodes > 0 ? Math.round((show.downloadedEpisodes / show.totalEpisodes) * 100) : 0;
  const isPartial = show.status === 'partial';

  return (
    <MediaListItem
      href={`/library/shows/${show.id}`}
      title={show.title}
      year={show.year}
      posterUrl={show.posterUrl}
      status={status}
      placeholderIcon={Tv2}
      metadataSlot={
        <>
          {show.network && <span className="shrink-0">{show.network}</span>}
          <span className="shrink-0">
            {show.seasonCount} {show.seasonCount === 1 ? 'season' : 'seasons'}
          </span>
          <span className="shrink-0">
            {show.downloadedEpisodes}/{show.totalEpisodes} episodes
          </span>
        </>
      }
      extraSlot={
        isPartial && (
          <div className="mt-2 max-w-xs">
            <Progress value={progressPercent} className="h-1" />
          </div>
        )
      }
      statsSlot={
        <>
          {show.rating && (
            <div className="hidden shrink-0 items-center gap-1 text-yellow-500 sm:flex">
              <Star className="size-4 fill-current" />
              <span className="text-sm font-medium tabular-nums">{show.rating.toFixed(1)}</span>
            </div>
          )}

          {show.nextEpisode && (
            <div className="hidden shrink-0 items-center gap-1.5 text-muted-foreground md:flex">
              <Calendar className="size-4 text-amber-500" />
              <span className="text-sm">{show.nextEpisode.airDate}</span>
            </div>
          )}
        </>
      }
    />
  );
}

export { ShowItem };
