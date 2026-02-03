'use client';

import Link from 'next/link';

import { AlertCircle, CheckCircle2, Clock, Download, type LucideIcon } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type MediaStatus = 'downloaded' | 'downloading' | 'missing' | 'wanted';
export type MediaType = 'movie' | 'show' | 'music' | 'book';

export interface MediaItem {
  id: string | number;
  title: string;
  year?: number;
  type: MediaType;
  status: MediaStatus;
  posterUrl?: string;
  quality?: string;
}

const statusConfig: Record<MediaStatus, { icon: LucideIcon; label: string; color: string; bg: string }> = {
  downloaded: { icon: CheckCircle2, label: 'Downloaded', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  downloading: { icon: Download, label: 'Downloading', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  missing: { icon: AlertCircle, label: 'Missing', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  wanted: { icon: Clock, label: 'Wanted', color: 'text-muted-foreground', bg: 'bg-muted' },
};

const typeToRoute: Record<MediaType, string> = {
  movie: 'movies',
  show: 'shows',
  music: 'music',
  book: 'books',
};

interface MediaCardProps {
  item: MediaItem;
  showType?: boolean;
}

function MediaCard({ item, showType = false }: MediaCardProps) {
  const status = statusConfig[item.status];
  const StatusIcon = status.icon;
  const route = typeToRoute[item.type];

  return (
    <Link
      href={`/library/${route}/${item.id}`}
      className="group relative block overflow-hidden rounded-lg ring-1 ring-white/10 transition-all duration-200 hover:ring-2 hover:ring-primary/50"
    >
      <AspectRatio ratio={2 / 3}>
        {/* Poster image or placeholder */}
        {item.posterUrl ? (
          <img src={item.posterUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900">
            <div className="flex h-full items-center justify-center p-2 text-center text-[10px] text-muted-foreground">
              {item.title}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute left-1.5 top-1.5">
              <Badge variant="secondary" className={cn('size-5 p-0', status.bg)}>
                <StatusIcon className={cn('size-3', status.color)} />
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">{status.label}</TooltipContent>
        </Tooltip>

        {/* Quality badge (if downloaded) */}
        {item.quality && item.status === 'downloaded' && (
          <div className="absolute right-1.5 top-1.5">
            <Badge variant="secondary" className="h-4 bg-black/60 px-1 text-[9px] font-medium backdrop-blur-sm">
              {item.quality}
            </Badge>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="p-2">
            <h3 className="line-clamp-2 text-xs font-semibold leading-tight">{item.title}</h3>
            <div className="mt-1 flex items-center gap-1.5">
              {item.year && <span className="text-[10px] tabular-nums text-muted-foreground">{item.year}</span>}
              {showType && (
                <Badge variant="outline" className="h-3.5 border-white/20 px-1 text-[8px] capitalize">
                  {item.type}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </AspectRatio>
    </Link>
  );
}

export { MediaCard };
