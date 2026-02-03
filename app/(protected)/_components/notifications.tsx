'use client';

import { Bell, Download, Film, Tv } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock notifications - will be replaced with real data
const notifications = [
  {
    id: '1',
    type: 'download' as const,
    title: 'The Bear S03E05',
    description: 'Download complete',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'movie' as const,
    title: 'Dune: Part Two',
    description: 'Added to library',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'show' as const,
    title: 'Severance S02E06',
    description: 'New episode available',
    time: '3 hours ago',
    read: true,
  },
];

const iconMap = {
  download: Download,
  movie: Film,
  show: Tv,
};

function Notifications() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative size-8">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] max-w-80 sm:w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => {
              const Icon = iconMap[notification.type];
              return (
                <DropdownMenuItem key={notification.id} className="flex cursor-pointer gap-3 p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  {!notification.read && <div className="size-2 shrink-0 rounded-full bg-primary" />}
                </DropdownMenuItem>
              );
            })
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm">View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { Notifications };
