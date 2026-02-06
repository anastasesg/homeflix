'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Filter, Globe, Hash, Radio, Star, Timer, Tv } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  showGenresQueryOptions,
  showNetworksQueryOptions,
  showWatchProvidersQueryOptions,
} from '@/options/queries/shows/metadata';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

// ============================================================================
// Types
// ============================================================================

interface FilterSheetProps {
  genres: number[];
  yearMin: number | null;
  yearMax: number | null;
  ratingMin: number | null;
  runtimeMin: number | null;
  runtimeMax: number | null;
  language: string;
  voteCountMin: number | null;
  networks: number[];
  status: string[];
  providers: number[];
  region: string;
  onGenresChange: (genres: number[]) => void;
  onYearRangeChange: (min: number | null, max: number | null) => void;
  onRatingMinChange: (rating: number | null) => void;
  onRuntimeRangeChange: (min: number | null, max: number | null) => void;
  onLanguageChange: (language: string) => void;
  onVoteCountMinChange: (count: number | null) => void;
  onNetworksChange: (networks: number[]) => void;
  onStatusChange: (status: string[]) => void;
  onProvidersChange: (providers: number[]) => void;
  onClear: () => void;
  activeCount: number;
}

// ============================================================================
// Constants
// ============================================================================

const YEAR_MIN = 1950;
const YEAR_MAX = new Date().getFullYear();
const RUNTIME_MAX = 120;

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: 'Korean' },
  { code: 'ja', label: 'Japanese' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ru', label: 'Russian' },
  { code: 'th', label: 'Thai' },
  { code: 'sv', label: 'Swedish' },
  { code: 'da', label: 'Danish' },
  { code: 'no', label: 'Norwegian' },
  { code: 'pl', label: 'Polish' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ar', label: 'Arabic' },
] as const;

const STATUS_OPTIONS = [
  { value: '0', label: 'Returning Series' },
  { value: '3', label: 'Ended' },
  { value: '2', label: 'In Production' },
  { value: '4', label: 'Cancelled' },
] as const;

// ============================================================================
// Sub-components
// ============================================================================

interface FilterSectionProps {
  title: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  badge?: number | string;
  children: React.ReactNode;
}

function FilterSection({ title, icon: Icon, defaultOpen = false, badge, children }: FilterSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="group flex w-full items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">{title}</span>
          {badge !== undefined && badge !== 0 && (
            <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
              {badge}
            </Badge>
          )}
        </div>
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function FilterSheet({
  genres,
  yearMin,
  yearMax,
  ratingMin,
  runtimeMin,
  runtimeMax,
  language,
  voteCountMin,
  networks,
  status,
  providers,
  region,
  onGenresChange,
  onYearRangeChange,
  onRatingMinChange,
  onRuntimeRangeChange,
  onLanguageChange,
  onVoteCountMinChange,
  onNetworksChange,
  onStatusChange,
  onProvidersChange,
  onClear,
  activeCount,
}: FilterSheetProps) {
  // Local slider state for smooth dragging
  const [localYearRange, setLocalYearRange] = useState<[number, number]>([yearMin ?? YEAR_MIN, yearMax ?? YEAR_MAX]);
  const [localRating, setLocalRating] = useState(ratingMin ?? 0);
  const [localRuntime, setLocalRuntime] = useState<[number, number]>([runtimeMin ?? 0, runtimeMax ?? RUNTIME_MAX]);
  const [localVoteCount, setLocalVoteCount] = useState(voteCountMin ?? 0);

  // Data queries
  const genresQuery = useQuery(showGenresQueryOptions());
  const providersQuery = useQuery(showWatchProvidersQueryOptions(region));
  const networksQuery = useQuery(showNetworksQueryOptions());

  const availableGenres = genresQuery.data ?? [];
  const availableProviders = providersQuery.data ?? [];
  const availableNetworks = networksQuery.data ?? [];

  // Handlers
  const handleGenreToggle = (genreId: number) => {
    onGenresChange(genres.includes(genreId) ? genres.filter((g) => g !== genreId) : [...genres, genreId]);
  };

  const handleYearCommit = (values: number[]) => {
    const [min, max] = values;
    const isDefault = min === YEAR_MIN && max === YEAR_MAX;
    onYearRangeChange(isDefault ? null : min, isDefault ? null : max);
  };

  const handleRatingCommit = (values: number[]) => {
    onRatingMinChange(values[0] === 0 ? null : values[0]);
  };

  const handleRuntimeCommit = (values: number[]) => {
    const [min, max] = values;
    const isDefault = min === 0 && max === RUNTIME_MAX;
    onRuntimeRangeChange(isDefault ? null : min, isDefault ? null : max);
  };

  const handleVoteCountCommit = (values: number[]) => {
    onVoteCountMinChange(values[0] === 0 ? null : values[0]);
  };

  const handleNetworkToggle = (networkId: number) => {
    onNetworksChange(networks.includes(networkId) ? networks.filter((n) => n !== networkId) : [...networks, networkId]);
  };

  const handleStatusToggle = (statusValue: string) => {
    onStatusChange(status.includes(statusValue) ? status.filter((s) => s !== statusValue) : [...status, statusValue]);
  };

  const handleProviderToggle = (providerId: number) => {
    onProvidersChange(
      providers.includes(providerId) ? providers.filter((p) => p !== providerId) : [...providers, providerId]
    );
  };

  const handleClear = () => {
    setLocalYearRange([YEAR_MIN, YEAR_MAX]);
    setLocalRating(0);
    setLocalRuntime([0, RUNTIME_MAX]);
    setLocalVoteCount(0);
    onClear();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-2 border-muted/50 bg-muted/30 hover:bg-muted/50">
          <Filter className="size-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>Refine your TV show discovery</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 scrollbar-none">
          <div className="divide-y divide-muted/30">
            {/* ─── Genres ─── */}
            <FilterSection title="Genres" icon={Tv} defaultOpen badge={genres.length || undefined}>
              <div className="grid grid-cols-2 gap-1.5">
                {availableGenres.map((genre) => (
                  <label
                    key={genre.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                  >
                    <Checkbox checked={genres.includes(genre.id)} onCheckedChange={() => handleGenreToggle(genre.id)} />
                    <span className="truncate">{genre.name}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* ─── Year Range ─── */}
            <FilterSection
              title="First Air Date"
              icon={Timer}
              badge={yearMin !== null || yearMax !== null ? `${yearMin ?? YEAR_MIN}–${yearMax ?? YEAR_MAX}` : undefined}
            >
              <div className="space-y-3 pt-1">
                <span className="text-xs tabular-nums text-muted-foreground">
                  {localYearRange[0]} – {localYearRange[1]}
                </span>
                <Slider
                  min={YEAR_MIN}
                  max={YEAR_MAX}
                  step={1}
                  value={localYearRange}
                  onValueChange={(v) => setLocalYearRange(v as [number, number])}
                  onValueCommit={handleYearCommit}
                  className="py-2"
                />
              </div>
            </FilterSection>

            {/* ─── Rating ─── */}
            <FilterSection title="Minimum Rating" icon={Star} badge={ratingMin !== null ? `≥${ratingMin}` : undefined}>
              <div className="space-y-3 pt-1">
                <span className="text-xs tabular-nums text-muted-foreground">
                  {localRating > 0 ? `≥ ${localRating.toFixed(1)}` : 'Any'}
                </span>
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
            </FilterSection>

            {/* ─── Runtime ─── */}
            <FilterSection
              title="Episode Runtime"
              icon={Timer}
              badge={
                runtimeMin !== null || runtimeMax !== null
                  ? `${runtimeMin ?? 0}–${runtimeMax ?? RUNTIME_MAX}min`
                  : undefined
              }
            >
              <div className="space-y-3 pt-1">
                <span className="text-xs tabular-nums text-muted-foreground">
                  {localRuntime[0]}min – {localRuntime[1] === RUNTIME_MAX ? `${RUNTIME_MAX}+` : `${localRuntime[1]}min`}
                </span>
                <Slider
                  min={0}
                  max={RUNTIME_MAX}
                  step={5}
                  value={localRuntime}
                  onValueChange={(v) => setLocalRuntime(v as [number, number])}
                  onValueCommit={handleRuntimeCommit}
                  className="py-2"
                />
              </div>
            </FilterSection>

            {/* ─── Language ─── */}
            <FilterSection
              title="Original Language"
              icon={Globe}
              badge={language ? LANGUAGES.find((l) => l.code === language)?.label : undefined}
            >
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {LANGUAGES.map((lang) => (
                  <label
                    key={lang.code}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={language === lang.code}
                      onCheckedChange={() => onLanguageChange(language === lang.code ? '' : lang.code)}
                    />
                    <span className="truncate">{lang.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* ─── Vote Count ─── */}
            <FilterSection
              title="Minimum Votes"
              icon={Hash}
              badge={voteCountMin !== null ? `≥${voteCountMin}` : undefined}
            >
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Filters out obscure titles with few ratings</Label>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {localVoteCount > 0 ? `≥ ${localVoteCount}` : 'Default (50)'}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={1000}
                  step={50}
                  value={[localVoteCount]}
                  onValueChange={(v) => setLocalVoteCount(v[0])}
                  onValueCommit={handleVoteCountCommit}
                  className="py-2"
                />
              </div>
            </FilterSection>

            {/* ─── Networks ─── */}
            <FilterSection title="Networks" icon={Tv} badge={networks.length || undefined}>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {availableNetworks.map((network) => (
                  <label
                    key={network.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={networks.includes(network.id)}
                      onCheckedChange={() => handleNetworkToggle(network.id)}
                    />
                    <span className="truncate">{network.name}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* ─── Status ─── */}
            <FilterSection title="Show Status" icon={Radio} badge={status.length || undefined}>
              <div className="flex flex-wrap gap-2 pt-1">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleStatusToggle(opt.value)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                      status.includes(opt.value)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted/50 text-muted-foreground hover:bg-muted/50'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* ─── Watch Providers ─── */}
            <FilterSection title="Streaming On" icon={Tv} badge={providers.length || undefined}>
              <div className="grid grid-cols-5 gap-2 pt-1">
                {availableProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleProviderToggle(provider.id)}
                    title={provider.name}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-lg p-1.5 transition-all',
                      providers.includes(provider.id) ? 'bg-primary/10 ring-2 ring-primary/40' : 'hover:bg-muted/50'
                    )}
                  >
                    {provider.logoUrl ? (
                      <Image src={provider.logoUrl} alt={provider.name} width={36} height={36} className="rounded-lg" />
                    ) : (
                      <div className="size-9 rounded-lg bg-muted" />
                    )}
                    <span className="max-w-full truncate text-[10px] text-muted-foreground">{provider.name}</span>
                  </button>
                ))}
                {availableProviders.length === 0 && (
                  <p className="col-span-5 text-xs text-muted-foreground">Loading providers...</p>
                )}
              </div>
            </FilterSection>
          </div>
        </div>

        <SheetFooter>
          {activeCount > 0 && (
            <Button variant="outline" onClick={handleClear} className="w-full">
              Clear all filters ({activeCount})
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export type { FilterSheetProps };
export { FilterSheet };
