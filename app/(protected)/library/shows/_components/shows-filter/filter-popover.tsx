'use client';

import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Filter } from 'lucide-react';

import { showItemsQueryOptions } from '@/options/queries/shows/library';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

interface FilterPopoverProps {
  genres: string[];
  networks: string[];
  yearMin: number | null;
  yearMax: number | null;
  ratingMin: number | null;
  onGenresChange: (genres: string[]) => void;
  onNetworksChange: (networks: string[]) => void;
  onYearRangeChange: (min: number | null, max: number | null) => void;
  onRatingMinChange: (rating: number | null) => void;
  onClear: () => void;
  activeCount: number;
}

function FilterPopover({
  genres,
  networks,
  yearMin,
  yearMax,
  ratingMin,
  onGenresChange,
  onNetworksChange,
  onYearRangeChange,
  onRatingMinChange,
  onClear,
  activeCount,
}: FilterPopoverProps) {
  const [open, setOpen] = useState(false);

  // Fetch all shows to extract available filter options
  const showsQuery = useQuery(showItemsQueryOptions({}));
  const allShows = showsQuery.data?.shows ?? [];

  // Extract available genres from shows
  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>();
    allShows.forEach((show) => {
      show.genres?.forEach((genre) => genreSet.add(genre));
    });
    return Array.from(genreSet).sort();
  }, [allShows]);

  // Extract available networks from shows
  const availableNetworks = useMemo(() => {
    const networkSet = new Set<string>();
    allShows.forEach((show) => {
      if (show.network) networkSet.add(show.network);
    });
    return Array.from(networkSet).sort();
  }, [allShows]);

  // Calculate year bounds from shows
  const yearBounds = useMemo(() => {
    const years = allShows.map((s) => s.year).filter((y): y is number => y !== undefined);
    if (years.length === 0) return { min: 1900, max: new Date().getFullYear() };
    return { min: Math.min(...years), max: Math.max(...years) };
  }, [allShows]);

  // Local state for sliders (for smooth dragging)
  const [localYearRange, setLocalYearRange] = useState<[number, number]>([
    yearMin ?? yearBounds.min,
    yearMax ?? yearBounds.max,
  ]);
  const [localRating, setLocalRating] = useState(ratingMin ?? 0);

  const handleGenreToggle = (genre: string) => {
    if (genres.includes(genre)) {
      onGenresChange(genres.filter((g) => g !== genre));
    } else {
      onGenresChange([...genres, genre]);
    }
  };

  const handleNetworkToggle = (network: string) => {
    if (networks.includes(network)) {
      onNetworksChange(networks.filter((n) => n !== network));
    } else {
      onNetworksChange([...networks, network]);
    }
  };

  const handleYearCommit = (values: number[]) => {
    const [min, max] = values;
    const isDefault = min === yearBounds.min && max === yearBounds.max;
    onYearRangeChange(isDefault ? null : min, isDefault ? null : max);
  };

  const handleRatingCommit = (values: number[]) => {
    const rating = values[0];
    onRatingMinChange(rating === 0 ? null : rating);
  };

  const handleClear = () => {
    setLocalYearRange([yearBounds.min, yearBounds.max]);
    setLocalRating(0);
    onClear();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-2 border-muted/50 bg-muted/30 hover:bg-muted/50">
          <Filter className="size-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-medium">Filters</h4>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" onClick={handleClear}>
              Clear all
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Genres */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Genres</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableGenres.slice(0, 10).map((genre) => (
                  <label
                    key={genre}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                  >
                    <Checkbox checked={genres.includes(genre)} onCheckedChange={() => handleGenreToggle(genre)} />
                    <span className="truncate">{genre}</span>
                  </label>
                ))}
              </div>
              {availableGenres.length === 0 && <p className="text-xs text-muted-foreground">No genres available</p>}
            </div>

            <Separator />

            {/* Networks */}
            {availableNetworks.length > 0 && (
              <>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Networks</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableNetworks.slice(0, 8).map((network) => (
                      <label
                        key={network}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={networks.includes(network)}
                          onCheckedChange={() => handleNetworkToggle(network)}
                        />
                        <span className="truncate">{network}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Year Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Release Year</Label>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {localYearRange[0]} – {localYearRange[1]}
                </span>
              </div>
              <Slider
                min={yearBounds.min}
                max={yearBounds.max}
                step={1}
                value={localYearRange}
                onValueChange={(v) => setLocalYearRange(v as [number, number])}
                onValueCommit={handleYearCommit}
                className="py-2"
              />
            </div>

            <Separator />

            {/* Minimum Rating */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Minimum Rating</Label>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {localRating > 0 ? `≥ ${localRating.toFixed(1)}` : 'Any'}
                </span>
              </div>
              <Slider
                min={0}
                max={10}
                step={0.5}
                value={[localRating]}
                onValueChange={(v) => setLocalRating(v[0])}
                onValueCommit={handleRatingCommit}
                className="py-2"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { FilterPopover };
