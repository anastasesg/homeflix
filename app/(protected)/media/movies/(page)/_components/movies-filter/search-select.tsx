'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// ============================================================================
// Types
// ============================================================================

interface SearchSelectItem {
  id: number;
  name: string;
  detail?: string;
}

interface SearchSelectProps {
  selected: number[];
  selectedLabels: Map<number, string>;
  onChange: (ids: number[], labels: Map<number, string>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchQueryFn: (query: string) => any;
  mapResults: (data: unknown) => SearchSelectItem[];
  placeholder: string;
}

// ============================================================================
// Main Component
// ============================================================================

function SearchSelect({
  selected,
  selectedLabels,
  onChange,
  searchQueryFn,
  mapResults,
  placeholder,
}: SearchSelectProps) {
  const [search, setSearch] = useState('');

  const resultsQuery = useQuery(searchQueryFn(search));
  const results: SearchSelectItem[] = resultsQuery.data ? mapResults(resultsQuery.data) : [];

  const handleAdd = (item: SearchSelectItem) => {
    if (!selected.includes(item.id)) {
      const newLabels = new Map(selectedLabels);
      newLabels.set(item.id, item.name);
      onChange([...selected, item.id], newLabels);
    }
    setSearch('');
  };

  const handleRemove = (id: number) => {
    const newLabels = new Map(selectedLabels);
    newLabels.delete(id);
    onChange(
      selected.filter((s) => s !== id),
      newLabels
    );
  };

  return (
    <div className="space-y-2">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 border-muted/50 bg-muted/30 pl-8 text-sm placeholder:text-muted-foreground/50"
        />
        {resultsQuery.isLoading && search.length >= 2 && (
          <Loader2 className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Search results dropdown */}
      {search.length >= 2 && results.length > 0 && (
        <div className="max-h-32 overflow-y-auto rounded-md border border-muted/50 bg-background">
          {results
            .filter((r) => !selected.includes(r.id))
            .slice(0, 8)
            .map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleAdd(item)}
                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-muted/50"
              >
                <span className="truncate">{item.name}</span>
                {item.detail && <span className="shrink-0 text-xs text-muted-foreground">({item.detail})</span>}
              </button>
            ))}
        </div>
      )}

      {/* Selected items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((id) => (
            <Badge key={id} variant="secondary" className="gap-1 bg-muted/50 pl-2 pr-1 text-xs font-normal">
              {selectedLabels.get(id) ?? `#${id}`}
              <button
                type="button"
                onClick={() => handleRemove(id)}
                className="rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export type { SearchSelectItem, SearchSelectProps };
export { SearchSelect };
