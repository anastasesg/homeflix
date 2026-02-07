'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { Book, Calendar, Film, Gauge, Globe, Headphones, Search, Settings, Tv } from 'lucide-react';

import { movieItemsQueryOptions } from '@/options/queries/movies/library';
import { showItemsQueryOptions } from '@/options/queries/shows/library';

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
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Fetch movies and shows data
  const { data: movies = [] } = useQuery({
    ...movieItemsQueryOptions({ search: search.trim() ? search : undefined }),
    select: (data) => data.movies.slice(0, 5), // Limit to top 5 results for performance
    enabled: open && search.trim() !== '', // Only fetch when dialog is open and search is not empty
  });
  const { data: shows = [] } = useQuery({
    ...showItemsQueryOptions({ search: search.trim() ? search : undefined }),
    select: (data) => data.shows.slice(0, 5), // Limit to top 5 results for performance
    enabled: open && search.trim() !== '', // Only fetch when dialog is open and search is not empty
  });

  const hasSearchResults = search.trim() !== '' && (movies.length > 0 || shows.length > 0);

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

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearch('');
    }
  }, []);

  const runCommand = useCallback(
    (command: () => void) => {
      handleOpenChange(false);
      command();
    },
    [handleOpenChange]
  );

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
        onOpenChange={handleOpenChange}
        title="Search"
        description="Search for movies, shows, and more"
      >
        <CommandInput placeholder="Search movies, shows..." value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Movie Search Results */}
          {search.trim() !== '' && movies.length > 0 && (
            <CommandGroup heading="Movies">
              {movies.map((movie) => (
                <CommandItem
                  key={`movie-${movie.tmdbId}`}
                  value={`movie-${movie.title}`}
                  onSelect={() => runCommand(() => router.push(`/media/movies/${movie.tmdbId}`))}
                  className="flex items-center gap-3"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded bg-muted">
                    {movie.posterUrl ? (
                      <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Film className="size-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate font-medium">{movie.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{movie.year}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Show Search Results */}
          {search.trim() !== '' && shows.length > 0 && (
            <CommandGroup heading="Shows">
              {shows.map((show) => (
                <CommandItem
                  key={`show-${show.tmdbId}`}
                  value={`show-${show.title}`}
                  onSelect={() => runCommand(() => router.push(`/media/shows/${show.tmdbId}`))}
                  className="flex items-center gap-3"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded bg-muted">
                    {show.posterUrl ? (
                      <Image src={show.posterUrl} alt={show.title} fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Tv className="size-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate font-medium">{show.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{show.year}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {hasSearchResults && <CommandSeparator />}

          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => runCommand(() => router.push('/browse'))}>
              <Globe className="mr-2 size-4" />
              Browse Content
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/discover/search'))}>
              <Search className="mr-2 size-4" />
              Discover New Content
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/system/dashboard'))}>
              <Gauge className="mr-2 size-4" />
              Go To Dashboard
              <CommandShortcut>⌘L</CommandShortcut>
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
