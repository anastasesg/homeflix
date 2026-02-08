'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Book,
  Calendar,
  Film,
  Gauge,
  Globe,
  Headphones,
  Loader2,
  Search,
  Settings,
  Tv,
} from 'lucide-react';
import type { Route } from 'next';

import { searchMoviesQueryOptions } from '@/options/queries/movies/discover';
import { searchShowsQueryOptions } from '@/options/queries/shows/discover';

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
  const pathname = usePathname();

  const isOnSearchPage = pathname === '/discover/search';

  // Debounce search to avoid hammering TMDB API
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const query = debouncedSearch;

  // Search TMDB for movies and shows
  const movieOptions = useMemo(() => searchMoviesQueryOptions(query), [query]);
  const showOptions = useMemo(() => searchShowsQueryOptions(query), [query]);

  const { data: movies = [], isFetching: isMoviesFetching } = useQuery({
    ...movieOptions,
    select: (data) => data.movies.slice(0, 5),
    enabled: open && query.length > 0,
  });
  const { data: shows = [], isFetching: isShowsFetching } = useQuery({
    ...showOptions,
    select: (data) => data.shows.slice(0, 5),
    enabled: open && query.length > 0,
  });

  const isDebouncing = search.trim() !== '' && search.trim() !== debouncedSearch;
  const isSearching = isDebouncing || isMoviesFetching || isShowsFetching;
  const hasSearchResults = query !== '' && (movies.length > 0 || shows.length > 0);

  useEffect(() => {
    if (isOnSearchPage) return;

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOnSearchPage]);

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

  if (isOnSearchPage) return null;

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
          {!isSearching && <CommandEmpty>No results found.</CommandEmpty>}

          {/* Discover on search page */}
          {search.trim() !== '' && (
            <CommandGroup heading="Discover">
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push(`/discover/search?q=${encodeURIComponent(search.trim())}` as Route))
                }
                className="flex items-center gap-2"
              >
                <Search className="size-4" />
                <span className="flex-1 truncate">Discover &ldquo;{search.trim()}&rdquo;</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </CommandItem>
            </CommandGroup>
          )}

          {/* Loading skeletons — two groups mirror the real Movies/Shows layout */}
          {isSearching && !hasSearchResults && (
            <>
              {(['Movies', 'Shows'] as const).map((group, gi) => (
                <CommandGroup key={group} heading={group} forceMount>
                  {[
                    { title: 'w-36', year: 'w-12' },
                    { title: 'w-24', year: 'w-10' },
                  ].map((widths, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-2 py-1.5"
                      style={{ animationDelay: `${(gi * 2 + i) * 100}ms` }}
                    >
                      <div
                        className="size-10 shrink-0 animate-pulse rounded bg-muted/60"
                        style={{ animationDelay: `${(gi * 2 + i) * 100}ms` }}
                      />
                      <div className="flex flex-1 flex-col gap-1.5">
                        <div
                          className={`h-3.5 animate-pulse rounded bg-muted/60 ${widths.title}`}
                          style={{ animationDelay: `${(gi * 2 + i) * 100 + 50}ms` }}
                        />
                        <div
                          className={`h-3 animate-pulse rounded bg-muted/40 ${widths.year}`}
                          style={{ animationDelay: `${(gi * 2 + i) * 100 + 100}ms` }}
                        />
                      </div>
                    </div>
                  ))}
                </CommandGroup>
              ))}
            </>
          )}

          {/* Fetching indicator when refining an existing search */}
          {isSearching && hasSearchResults && (
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Updating results...
            </div>
          )}

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
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  const query = search.trim();
                  const url = (query ? `/discover/search?q=${encodeURIComponent(query)}` : '/discover/search') as Route;
                  router.push(url);
                })
              }
            >
              <Search className="mr-2 size-4" />
              Discover New Content
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
