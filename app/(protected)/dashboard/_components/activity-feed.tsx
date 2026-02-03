'use client';

import Link from 'next/link';

import { AlertTriangle, ArrowRight, CheckCircle2, Download, Hand } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ActivityType = 'download' | 'request' | 'warning' | 'added';
type MediaType = 'movie' | 'show';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  time: string;
  user?: string;
  mediaId?: string;
  mediaType?: MediaType;
}

// Mock data - will be replaced with real API calls
const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'download',
    title: 'The Bear S03E05',
    subtitle: 'Downloaded',
    time: '2m',
    mediaId: '101',
    mediaType: 'show',
  },
  {
    id: '2',
    type: 'request',
    title: 'Dune: Part Two',
    subtitle: 'Pending',
    time: '1h',
    user: 'Alex',
    mediaId: '102',
    mediaType: 'movie',
  },
  { id: '3', type: 'warning', title: 'Indexer issue', subtitle: 'NZBgeek', time: '3h' },
  {
    id: '4',
    type: 'added',
    title: 'Severance S02E05',
    subtitle: 'Added',
    time: '5h',
    mediaId: '103',
    mediaType: 'show',
  },
  {
    id: '5',
    type: 'download',
    title: 'White Lotus S03E04',
    subtitle: 'Downloaded',
    time: '1d',
    mediaId: '104',
    mediaType: 'show',
  },
  {
    id: '6',
    type: 'request',
    title: 'Shogun',
    subtitle: 'Approved',
    time: '1d',
    user: 'Jamie',
    mediaId: '105',
    mediaType: 'show',
  },
];

const activityConfig: Record<
  ActivityType,
  { icon: typeof Download; color: string; bg: string; badgeVariant: 'default' | 'secondary' | 'destructive' }
> = {
  download: { icon: Download, color: 'text-emerald-400', bg: 'bg-emerald-500/10', badgeVariant: 'secondary' },
  request: { icon: Hand, color: 'text-blue-400', bg: 'bg-blue-500/10', badgeVariant: 'secondary' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', badgeVariant: 'destructive' },
  added: { icon: CheckCircle2, color: 'text-violet-400', bg: 'bg-violet-500/10', badgeVariant: 'secondary' },
};

function ActivityFeed() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Activity</h2>
        <Button variant="ghost" size="xs" asChild>
          <Link href="/activity/history">
            All
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>

      <ScrollArea className="-mx-1 flex-1 px-1">
        {activities.length === 0 ? (
          <div className="flex h-full items-center justify-center py-8">
            <p className="text-xs text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              const href =
                activity.mediaId && activity.mediaType
                  ? `/library/${activity.mediaType === 'movie' ? 'movies' : 'shows'}/${activity.mediaId}`
                  : activity.type === 'warning'
                    ? '/system/services'
                    : undefined;

              const itemContent = (
                <>
                  {/* Icon or User Avatar */}
                  {activity.user ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar size="sm" className={config.bg}>
                          <AvatarFallback className={cn('text-[10px]', config.color)}>
                            {activity.user.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent side="left">Requested by {activity.user}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className={cn('flex size-6 shrink-0 items-center justify-center rounded-full', config.bg)}>
                      <Icon className={cn('size-3', config.color)} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{activity.title}</p>
                    <Badge variant={config.badgeVariant} className="mt-0.5 h-4 px-1 text-[9px]">
                      {activity.subtitle}
                    </Badge>
                  </div>

                  {/* Time */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{activity.time}</span>
                    </TooltipTrigger>
                    <TooltipContent side="left">{activity.time} ago</TooltipContent>
                  </Tooltip>
                </>
              );

              const className = 'group flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-secondary/50';

              return href ? (
                <Link key={activity.id} href={href} className={className}>
                  {itemContent}
                </Link>
              ) : (
                <div key={activity.id} className={className}>
                  {itemContent}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export { ActivityFeed };
