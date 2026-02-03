'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Book, Calendar, Film, Gauge, Headphones, Search, Settings, Tv } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      {/* Mobile: Icon-only button */}
      <Button
        variant="ghost"
        size="icon"
        className="size-8 md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Search className="size-4" />
      </Button>

      {/* Desktop: Full search bar */}
      <Button
        variant="outline"
        className="relative hidden h-8 w-48 justify-start rounded-md bg-muted/50 text-sm font-normal text-muted-foreground shadow-none md:flex lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 size-4" />
        Search...
        <kbd className="pointer-events-none absolute right-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search for content, pages, and actions"
      >
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
              <Gauge className="mr-2 size-4" />
              Go to Dashboard
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/discover/search'))}>
              <Search className="mr-2 size-4" />
              Search Content
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Library">
            <CommandItem onSelect={() => runCommand(() => router.push('/library/movies'))}>
              <Film className="mr-2 size-4" />
              Movies
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/library/shows'))}>
              <Tv className="mr-2 size-4" />
              Shows
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/library/music'))}>
              <Headphones className="mr-2 size-4" />
              Music
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/library/books'))}>
              <Book className="mr-2 size-4" />
              Books
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Tools">
            <CommandItem onSelect={() => runCommand(() => router.push('/discover/calendar'))}>
              <Calendar className="mr-2 size-4" />
              Calendar
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/system/settings'))}>
              <Settings className="mr-2 size-4" />
              Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export { SearchCommand };
