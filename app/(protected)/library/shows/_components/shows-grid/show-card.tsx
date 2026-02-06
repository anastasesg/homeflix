'use client';

import { Calendar, Star, Tv2 } from 'lucide-react';

import { ShowItem } from '@/api/entities';

import { MediaCard, type StatusConfig } from '@/components/media';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ShowCardProps {
  show: ShowItem;
  status: StatusConfig;
  index?: number;
}

function ShowCard({ show, status, index = 0 }: ShowCardProps) {
  const progressPercent = show.totalEpisodes > 0 ? Math.round((show.downloadedEpisodes / show.totalEpisodes) * 100) : 0;
  const isPartial = show.status === 'partial';

  return (
    <MediaCard
      href={`/media/shows/${show.tmdbId}`}
      title={show.title}
      posterUrl={show.posterUrl}
      status={status}
      statusTooltip={`${status.label} (${show.downloadedEpisodes}/${show.totalEpisodes} episodes)`}
      qualityBadge={show.quality}
      showQualityBadge={show.status === 'complete'}
      placeholderIcon={Tv2}
      animationDelay={index * 30}
      topRightSlot={
        <Badge
          variant="secondary"
          className="h-5 bg-black/70 px-1.5 text-[10px] font-semibold text-white/80 backdrop-blur-md"
        >
          {show.seasonCount} {show.seasonCount === 1 ? 'Season' : 'Seasons'}
        </Badge>
      }
      overlaySlot={
        <>
          {show.rating && (
            <div className="absolute bottom-2 right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-black/70 px-1.5 text-yellow-400 backdrop-blur-md"
              >
                <Star className="size-3 fill-current" />
                <span className="text-[10px] font-semibold tabular-nums">{show.rating.toFixed(1)}</span>
              </Badge>
            </div>
          )}

          {isPartial && (
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
              <Progress value={progressPercent} className="h-1 bg-white/20" />
              <p className="mt-1 text-center text-[9px] font-medium text-white/70">
                {show.downloadedEpisodes}/{show.totalEpisodes} episodes
              </p>
            </div>
          )}
        </>
      }
    >
      <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white">{show.title}</h3>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {show.year && (
          <span className="text-[11px] font-medium tabular-nums text-white/70">
            {show.year}
            {show.endYear && show.endYear !== show.year ? `–${show.endYear}` : ''}
          </span>
        )}

        {show.network && (
          <>
            <span className="text-white/30">·</span>
            <span className="text-[11px] text-white/70">{show.network}</span>
          </>
        )}
      </div>

      {show.nextEpisode && (
        <div className="mt-2 flex items-center gap-1.5 rounded bg-white/10 px-2 py-1">
          <Calendar className="size-3 text-amber-400" />
          <span className="text-[10px] text-white/90">
            S{show.nextEpisode.seasonNumber.toString().padStart(2, '0')}E
            {show.nextEpisode.episodeNumber.toString().padStart(2, '0')}
          </span>
          {show.nextEpisode.airDate && <span className="text-[10px] text-white/60">· {show.nextEpisode.airDate}</span>}
        </div>
      )}

      {show.genres && show.genres.length > 0 && !show.nextEpisode && (
        <div className="mt-2 flex flex-wrap gap-1">
          {show.genres.slice(0, 2).map((genre) => (
            <Badge
              key={genre}
              variant="outline"
              className="h-4 border-white/20 bg-white/5 px-1.5 text-[9px] text-white/80"
            >
              {genre}
            </Badge>
          ))}
        </div>
      )}
    </MediaCard>
  );
}

export { ShowCard };
