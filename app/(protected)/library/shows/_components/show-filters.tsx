'use client';

import { Grid3X3, LayoutGrid, Search, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface ShowFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

const sortOptions = [
  { value: 'added', label: 'Recently Added' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'year', label: 'Release Year' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'nextAiring', label: 'Next Airing' },
];

function ShowFilters({ search, onSearchChange, sort, onSortChange }: ShowFiltersProps) {
  const currentSort = sortOptions.find((opt) => opt.value === sort);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          placeholder="Search shows, genres..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 border-muted/50 bg-muted/30 pl-9 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-background"
        />
      </div>

      {/* Filters & View Toggle */}
      <div className="flex items-center gap-2">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-2 border-muted/50 bg-muted/30 hover:bg-muted/50">
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">{currentSort?.label ?? 'Sort'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sort} onValueChange={onSortChange}>
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-muted/50 bg-muted/30 p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 hover:bg-muted data-[active=true]:bg-muted"
            data-active="true"
          >
            <Grid3X3 className="size-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button variant="ghost" size="icon" className="size-9 hover:bg-muted data-[active=true]:bg-muted">
            <LayoutGrid className="size-4" />
            <span className="sr-only">Large grid view</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ShowFilters };
