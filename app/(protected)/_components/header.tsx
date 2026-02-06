'use client';

import React from 'react';

import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useBreadcrumbOverride } from '@/context';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { Notifications } from './notifications';
import { SearchCommand } from './search-command';
import { ThemeToggle } from './theme-toggle';

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

type HeaderProps = object;

function Header({}: HeaderProps) {
  const pathname = usePathname();
  const { overrides } = useBreadcrumbOverride();
  const breadcrumbs = generateBreadcrumbs(pathname, overrides);

  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between gap-1 overflow-hidden md:h-16 md:gap-2">
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
      </div>
    </header>
  );
}

export type { HeaderProps };
export { Header };
