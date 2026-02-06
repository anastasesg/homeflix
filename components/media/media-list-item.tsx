'use client';

import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type { StatusConfig } from './types';

interface MediaListItemProps<TRoute extends string = string> {
  /** Navigation href */
  href: Route<TRoute>;
  /** Media title */
  title: string;
  /** Year of release */
  year?: number;
  /** Poster image URL */
  posterUrl?: string;
  /** Resolved status configuration */
  status: StatusConfig;
  /** Icon for placeholder when no poster is available */
  placeholderIcon?: LucideIcon;
  /** Slot for metadata (genres, network, etc.) - renders below title */
  metadataSlot?: ReactNode;
  /** Slot for additional content below metadata (e.g., progress bar) */
  extraSlot?: ReactNode;
  /** Slot for stats/info on the right side (rating, episode counts, etc.) */
  statsSlot?: ReactNode;
  /** Slot for badges/actions on the far right (quality badge, etc.) */
  badgesSlot?: ReactNode;
}

function MediaListItem<TRoute extends string = string>({
  href,
  title,
  year,
  posterUrl,
  status,
  placeholderIcon: PlaceholderIcon,
  metadataSlot,
  extraSlot,
  statsSlot,
  badgesSlot,
}: MediaListItemProps<TRoute>) {
  const StatusIcon = status.icon;

  return (
    <Link href={href} className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50">
      {/* Poster Thumbnail */}
      <div className="relative h-[72px] w-12 shrink-0 overflow-hidden rounded-md bg-muted">
        {posterUrl ? (
          <Image src={posterUrl} alt={title} className="h-full w-full object-cover" fill />
        ) : (
          <div className="flex h-full items-center justify-center">
            {PlaceholderIcon && <PlaceholderIcon className="size-5 text-muted-foreground/30" />}
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-foreground group-hover:text-primary">{title}</h3>
          {year && <span className="shrink-0 text-sm tabular-nums text-muted-foreground">({year})</span>}
        </div>

        {metadataSlot && (
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {metadataSlot}
          </div>
        )}

        {extraSlot}
      </div>

      {/* Stats section (hidden on mobile) */}
      {statsSlot}

      {/* Badges and status */}
      <div className="flex shrink-0 items-center gap-2">
        {badgesSlot}

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="secondary"
              className={cn('size-7 p-0', status.bg, status.glow && `shadow-lg ${status.glow}`)}
            >
              <StatusIcon className={cn('size-4', status.color)} />
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-medium">
            {status.label}
          </TooltipContent>
        </Tooltip>
      </div>
    </Link>
  );
}

export { MediaListItem };
export type { MediaListItemProps };
