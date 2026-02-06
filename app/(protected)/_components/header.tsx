'use client';

import React from 'react';

import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BadgeCheck, Book, Clapperboard, Headphones, Library, LogOut, MonitorPlay } from 'lucide-react';

import { useBreadcrumbOverride } from '@/context';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { Notifications } from './notifications';
import { SearchCommand } from './search-command';
import { ThemeToggle } from './theme-toggle';

// Mocked user data (same as sidebar)
const user = {
  name: 'Alex Thompson',
  email: 'alex@homeflix.local',
  avatar: '',
} as const;

const libraryItems = [
  { title: 'Movies', url: '/library/movies', icon: Clapperboard },
  { title: 'Shows', url: '/library/shows', icon: MonitorPlay },
  { title: 'Music', url: '/library/music', icon: Headphones },
  { title: 'Books', url: '/library/books', icon: Book },
] as const;

function generateBreadcrumbs(pathname: string, overrides: Map<string, string>) {
  const segments = pathname.split('/').filter(Boolean);

  return segments.map((segment, index) => {
    const href = ('/' + segments.slice(0, index + 1).join('/')) as Route;
    // Use override if available, otherwise capitalize the segment
    const label = overrides.get(segment) || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === segments.length - 1;

    return { href, label, isLast, segment };
  });
}

// ============================================================================
// Sub-Components
// ============================================================================

function HeaderUserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex size-8 items-center justify-center rounded-full outline-none md:size-9">
          <Avatar className="size-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-lg" align="end" sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">AT</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Library className="size-4" />
              Library
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {libraryItems.map((item) => (
                <DropdownMenuItem key={item.url} asChild>
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck className="size-4" />
            Account
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// Main
// ============================================================================

type HeaderProps = object;

function Header({}: HeaderProps) {
  const pathname = usePathname();
  const { overrides } = useBreadcrumbOverride();
  const breadcrumbs = generateBreadcrumbs(pathname, overrides);

  return (
    <header className="sticky top-0 z-20 shrink-0 bg-background pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 w-full items-center justify-between gap-1 overflow-hidden md:h-16 md:gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1 px-2 md:gap-2 md:px-4">
          <SidebarTrigger className="size-8 shrink-0 md:size-9" />
          <Separator orientation="vertical" className="hidden h-4! shrink-0 md:block" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage className="max-w-30 truncate text-sm md:max-w-none md:text-base">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild className="hidden md:block">
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex shrink-0 items-center gap-1 px-2 md:gap-2 md:px-4">
          <SearchCommand />
          <ThemeToggle />
          <Notifications />
          <div className="md:hidden">
            <HeaderUserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

export type { HeaderProps };
export { Header };
