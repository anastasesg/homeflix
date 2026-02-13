'use client';

import { useCallback } from 'react';

import { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';

import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Film, Home, Search, Tv } from 'lucide-react';

import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', icon: Home, href: '/tv' },
  { key: 'movies', label: 'Movies', icon: Film, href: '/tv/movies' },
  { key: 'shows', label: 'Shows', icon: Tv, href: '/tv/shows' },
  { key: 'search', label: 'Search', icon: Search, href: '/tv/search' },
];

// ============================================================
// Sub-components
// ============================================================

interface TvRailNavItemProps {
  item: NavItem;
  isActive: boolean;
}

function TvRailNavItem({ item, isActive }: TvRailNavItemProps) {
  const router = useRouter();
  const Icon = item.icon;

  const { ref, focused } = useFocusable({
    onEnterPress: () => router.push(item.href as Route),
  });

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-4 rounded-xl px-5 py-4 transition-all duration-150 ease-out',
        'outline-none',
        focused && 'scale-105 bg-accent/20 ring-3 ring-accent',
        isActive && !focused && 'bg-accent/10',
        !focused && !isActive && 'opacity-60'
      )}
    >
      <Icon className="size-7 shrink-0" />
      <span
        className={cn(
          'text-lg font-medium whitespace-nowrap transition-all duration-150',
          focused ? 'w-auto opacity-100' : 'w-0 overflow-hidden opacity-0'
        )}
      >
        {item.label}
      </span>
    </div>
  );
}

// ============================================================
// Main
// ============================================================

function TvRailNav() {
  const pathname = usePathname();

  const { ref, focusKey } = useFocusable({
    trackChildren: true,
    saveLastFocusedChild: true,
    isFocusBoundary: false,
    focusKey: 'rail-nav',
  });

  const isActive = useCallback(
    (href: string) => {
      if (href === '/tv') return pathname === '/tv';
      return pathname.startsWith(href);
    },
    [pathname]
  );

  return (
    <FocusContext.Provider value={focusKey}>
      <nav ref={ref} className="flex h-full w-20 flex-col items-center gap-2 border-r border-border/20 py-8">
        <div className="mb-8 text-2xl font-bold text-accent">H</div>
        <div className="flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <TvRailNavItem key={item.key} item={item} isActive={isActive(item.href)} />
          ))}
        </div>
      </nav>
    </FocusContext.Provider>
  );
}

export { TvRailNav };
