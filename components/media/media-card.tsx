'use client';

import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type { StatusConfig } from './types';

interface MediaCardProps<TRoute extends string = string> {
  /** Navigation href */
  href: Route<TRoute>;
  /** Media title (used for alt text and placeholder) */
  title: string;
  /** Poster image URL */
  posterUrl?: string;
  /** Resolved status configuration */
  status: StatusConfig;
  /** Status tooltip text (defaults to status.label) */
  statusTooltip?: string;
  /** Quality badge text (e.g., "1080p", "4K") */
  qualityBadge?: string;
  /** Whether to show quality badge (defaults to true when qualityBadge is provided) */
  showQualityBadge?: boolean;
  /** Custom content for top-right area (rendered after quality badge) */
  topRightSlot?: ReactNode;
  /** Icon for placeholder when no poster is available */
  placeholderIcon?: LucideIcon;
  /** Content rendered in the hover overlay */
  children?: ReactNode;
  /** Animation delay in ms (for staggered animations) */
  animationDelay?: number;
  /** Additional content rendered above the hover overlay (e.g., progress bars) */
  overlaySlot?: ReactNode;
}

function MediaCard<TRoute extends string = string>({
  href,
  title,
  posterUrl,
  status,
  statusTooltip,
  qualityBadge,
  showQualityBadge = true,
  topRightSlot,
  placeholderIcon: PlaceholderIcon,
  children,
  animationDelay,
  overlaySlot,
}: MediaCardProps<TRoute>) {
  const StatusIcon = status.icon;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl ring-1 ring-white/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-primary/40 hover:shadow-xl hover:shadow-primary/10"
      style={animationDelay ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      <AspectRatio ratio={2 / 3}>
        {/* Poster image or placeholder */}
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-850 to-zinc-900">
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
              {PlaceholderIcon && <PlaceholderIcon className="size-8 text-muted-foreground/30" />}
              <span className="text-xs font-medium text-muted-foreground">{title}</span>
            </div>
          </div>
        )}

        {/* Status Badge (top-left) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute left-2 top-2 z-10">
              <Badge
                variant="secondary"
                className={cn(
                  'size-6 p-0 shadow-md transition-transform duration-200 group-hover:scale-110',
                  status.bg,
                  status.glow && `shadow-lg ${status.glow}`
                )}
              >
                <StatusIcon className={cn('size-3.5', status.color)} />
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {statusTooltip ?? status.label}
          </TooltipContent>
        </Tooltip>

        {/* Top-right badges area */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1">
          {qualityBadge && showQualityBadge && (
            <Badge
              variant="secondary"
              className="h-5 bg-black/70 px-1.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md"
            >
              {qualityBadge}
            </Badge>
          )}
          {topRightSlot}
        </div>

        {/* Custom overlay content (e.g., progress bars) */}
        {overlaySlot}

        {/* Hover Overlay with gradient */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="p-3">{children}</div>
        </div>

        {/* Subtle top gradient for status badges visibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
      </AspectRatio>
    </Link>
  );
}

export { MediaCard };
export type { MediaCardProps };
