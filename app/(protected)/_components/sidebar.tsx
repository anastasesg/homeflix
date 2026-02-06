'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Book,
  Calendar,
  Clapperboard,
  Clock,
  Download,
  Film,
  Gauge,
  Globe,
  Hand,
  Headphones,
  MonitorPlay,
  Search,
  Server,
  Settings,
  Tv,
} from 'lucide-react';

import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

// Navigation structure from UI plan
const navigation = {
  main: [{ title: 'Browse', url: '/browse', icon: Globe }],
  discover: [
    { title: 'Search', url: '/discover/search', icon: Search },
    { title: 'Calendar', url: '/discover/calendar', icon: Calendar },
    { title: 'Requests', url: '/discover/requests', icon: Hand },
  ],
  media: [
    { title: 'Movies', url: '/media/movies', icon: Film },
    { title: 'Shows', url: '/media/shows', icon: Tv },
  ],
  library: [
    { title: 'Movies', url: '/library/movies', icon: Clapperboard },
    { title: 'Shows', url: '/library/shows', icon: MonitorPlay },
    { title: 'Music', url: '/library/music', icon: Headphones },
    { title: 'Books', url: '/library/books', icon: Book },
  ],
  activity: [
    { title: 'Downloads', url: '/activity/downloads', icon: Download },
    { title: 'History', url: '/activity/history', icon: Clock },
  ],
  system: [
    { title: 'Dashboard', url: '/system/dashboard', icon: Gauge },
    { title: 'Services', url: '/system/services', icon: Server },
    { title: 'Settings', url: '/system/settings', icon: Settings },
  ],
} as const;

type SidebarProps = object;

function Sidebar({}: SidebarProps) {
  const pathname = usePathname();

  return (
    <BaseSidebar collapsible="icon" variant="floating">
      {/* Header with branding */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/browse">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Film className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Homeflix</span>
                  <span className="truncate text-xs text-muted-foreground">Media Hub</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main navigation - Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.main.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarSeparator /> */}

        {/* Discover section */}
        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.discover.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Media section */}
        <SidebarGroup>
          <SidebarGroupLabel>Media</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.media.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Library section */}
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.library.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Activity section */}
        <SidebarGroup>
          <SidebarGroupLabel>Activity</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.activity.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System section */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.system.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter />

      {/* Rail for hover-to-expand on collapsed state */}
      <SidebarRail />
    </BaseSidebar>
  );
}

export type { SidebarProps };
export { Sidebar };
