'use client';

import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Film, Hash, Loader2, Search, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { tmdbSearchKeywordsQueryOptions, tmdbSearchPeopleQueryOptions } from '@/options/queries/tmdb';

import { Input } from '@/components/ui/input';

// ============================================================================
// Types
// ============================================================================

interface SmartSearchProps {
  value: string;
  onSearchChange: (value: string) => void;
  onAddCast: (id: number, name: string) => void;
  onAddCrew: (id: number, name: string) => void;
  onAddKeyword: (id: number, name: string) => void;
  existingCast: number[];
  existingCrew: number[];
  existingKeywords: number[];
  className?: string;
}

// ============================================================================
// Sub-components
// ============================================================================

interface ResultGroupProps {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function ResultGroup({ label, icon: Icon, children }: ResultGroupProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </div>
      {children}
    </div>
  );
}

interface ResultItemProps {
  label: string;
  detail?: string;
  onSelect: () => void;
}

function ResultItem({ label, detail, onSelect }: ResultItemProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect();
      }}
      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted/50"
    >
      <span className="truncate">{label}</span>
      {detail && <span className="shrink-0 text-xs text-muted-foreground">({detail})</span>}
    </button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function SmartSearch({
  value,
  onSearchChange,
  onAddCast,
  onAddCrew,
  onAddKeyword,
  existingCast,
  existingCrew,
  existingKeywords,
  className,
}: SmartSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(value, 300);
  const isQueryActive = debouncedQuery.length >= 2;

  const peopleQuery = useQuery({
    ...tmdbSearchPeopleQueryOptions(debouncedQuery),
    enabled: isQueryActive,
  });

  const keywordsQuery = useQuery({
    ...tmdbSearchKeywordsQueryOptions(debouncedQuery),
    enabled: isQueryActive,
  });

  const isLoading = isQueryActive && (peopleQuery.isLoading || keywordsQuery.isLoading);

  const people = (peopleQuery.data ?? [])
    .filter((p) => !existingCast.includes(p.id) && !existingCrew.includes(p.id))
    .slice(0, 5);

  const keywords = (keywordsQuery.data ?? []).filter((k) => !existingKeywords.includes(k.id)).slice(0, 5);

  const hasResults = people.length > 0 || keywords.length > 0;
  const showDropdown = isFocused && isQueryActive && (hasResults || isLoading);

  const handleSelectPerson = (person: { id: number; name: string; department: string }) => {
    if (person.department === 'Acting') {
      onAddCast(person.id, person.name);
    } else {
      onAddCrew(person.id, person.name);
    }
    onSearchChange('');
  };

  const handleSelectKeyword = (keyword: { id: number; name: string }) => {
    onAddKeyword(keyword.id, keyword.name);
    onSearchChange('');
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground/60" />
      <Input
        placeholder="Search movies, actors, keywords..."
        value={value}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="h-10 border-muted/50 bg-muted/30 pl-9 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-background"
      />
      {isLoading && (
        <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border/60 bg-popover shadow-lg">
          {/* Hint */}
          <div className="border-b border-border/40 px-3 py-1.5 text-[11px] text-muted-foreground">
            <Film className="mr-1 inline size-3" />
            Press Enter to search movies for &ldquo;{value}&rdquo;
          </div>

          {people.length > 0 && (
            <ResultGroup label="People" icon={Users}>
              {people.map((person) => (
                <ResultItem
                  key={person.id}
                  label={person.name}
                  detail={person.department}
                  onSelect={() => handleSelectPerson(person)}
                />
              ))}
            </ResultGroup>
          )}

          {keywords.length > 0 && (
            <ResultGroup label="Keywords" icon={Hash}>
              {keywords.map((keyword) => (
                <ResultItem key={keyword.id} label={keyword.name} onSelect={() => handleSelectKeyword(keyword)} />
              ))}
            </ResultGroup>
          )}

          {isLoading && !hasResults && (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Searching...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Hooks
// ============================================================================

function useDebouncedValue(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export type { SmartSearchProps };
export { SmartSearch };
