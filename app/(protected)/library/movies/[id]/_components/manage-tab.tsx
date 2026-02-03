'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  ArrowUpCircle,
  BellOff,
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  HardDrive,
  Loader2,
  RefreshCw,
  Search,
  Server,
  Shield,
  Sparkles,
  Trash2,
  Users,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { Movie, QualityProfile } from './types';

// Mock quality profiles - will come from Radarr API
const qualityProfiles: QualityProfile[] = [
  { id: 1, name: 'Any' },
  { id: 2, name: 'SD' },
  { id: 3, name: 'HD-720p' },
  { id: 4, name: 'HD-1080p' },
  { id: 5, name: 'Ultra-HD' },
  { id: 6, name: 'HD - 720p/1080p' },
];

interface SearchResult {
  id: number;
  title: string;
  indexer: string;
  size: string;
  seeders: number;
  quality: string;
  source: string;
  codec: string;
  age: string;
  approved: boolean;
  rejected?: string;
}

// Mock search results with more data
const mockSearchResults: SearchResult[] = [
  {
    id: 1,
    title: 'Dune.Part.Two.2024.2160p.UHD.BluRay.x265-GROUP',
    indexer: 'NZBgeek',
    size: '45.2 GB',
    seeders: 156,
    quality: 'Bluray-2160p',
    source: 'BluRay',
    codec: 'x265',
    age: '2 days',
    approved: true,
  },
  {
    id: 2,
    title: 'Dune.Part.Two.2024.1080p.BluRay.x264-GROUP',
    indexer: 'Drunkenslug',
    size: '12.4 GB',
    seeders: 89,
    quality: 'Bluray-1080p',
    source: 'BluRay',
    codec: 'x264',
    age: '5 days',
    approved: true,
  },
  {
    id: 3,
    title: 'Dune.Part.Two.2024.2160p.WEB-DL.DDP5.1.Atmos.x265',
    indexer: 'NZBFinder',
    size: '18.7 GB',
    seeders: 234,
    quality: 'WEBDL-2160p',
    source: 'WEB',
    codec: 'x265',
    age: '1 day',
    approved: true,
  },
  {
    id: 4,
    title: 'Dune.Part.Two.2024.720p.WEB-DL.x264',
    indexer: 'NZBFinder',
    size: '4.2 GB',
    seeders: 45,
    quality: 'WEBDL-720p',
    source: 'WEB',
    codec: 'x264',
    age: '3 days',
    approved: false,
    rejected: 'Quality not in profile',
  },
];

function getQualityTier(quality: string): 'premium' | 'high' | 'standard' | 'low' {
  const q = quality.toLowerCase();
  if (q.includes('2160') || q.includes('4k')) return 'premium';
  if (q.includes('1080')) return 'high';
  if (q.includes('720')) return 'standard';
  return 'low';
}

function getQualityGradient(tier: 'premium' | 'high' | 'standard' | 'low'): string {
  switch (tier) {
    case 'premium':
      return 'from-amber-500 to-orange-600';
    case 'high':
      return 'from-blue-500 to-indigo-600';
    case 'standard':
      return 'from-emerald-500 to-teal-600';
    default:
      return 'from-zinc-500 to-zinc-600';
  }
}

function parseFileSize(size: string): number {
  const match = size.match(/([\d.]+)\s*(GB|MB|TB)/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === 'TB') return value * 1024;
  if (unit === 'GB') return value;
  if (unit === 'MB') return value / 1024;
  return 0;
}

interface ManageTabProps {
  movie: Movie;
}

interface SettingCardProps {
  icon: React.ElementType;
  iconColor?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingCard({ icon: Icon, iconColor = 'text-amber-500', title, description, children }: SettingCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-5 transition-colors hover:border-white/[0.1]">
      <div className="flex gap-4">
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]', iconColor)}>
          <Icon className="size-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground/80">{description}</p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick?: () => void;
  loading?: boolean;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

function ActionButton({
  icon: Icon,
  label,
  description,
  onClick,
  loading,
  variant = 'default',
  disabled,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'group flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200',
        variant === 'destructive'
          ? 'border-red-500/20 bg-red-500/5 hover:border-red-500/40 hover:bg-red-500/10'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]',
        (disabled || loading) && 'cursor-not-allowed opacity-50'
      )}
    >
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full transition-colors',
          variant === 'destructive' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-500'
        )}
      >
        {loading ? <Loader2 className="size-5 animate-spin" /> : <Icon className="size-5" />}
      </div>
      <div>
        <p className={cn('text-sm font-medium', variant === 'destructive' && 'text-red-400')}>{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground/70">{description}</p>
      </div>
    </button>
  );
}

function SearchResultCard({ result, onDownload }: { result: SearchResult; onDownload: () => void }) {
  const tier = getQualityTier(result.quality);
  const gradient = getQualityGradient(tier);
  const sizeGB = parseFileSize(result.size);

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border transition-all duration-200',
        result.approved
          ? 'border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/[0.12]'
          : 'border-red-500/10 bg-red-500/[0.02] opacity-60'
      )}
    >
      {/* Quality accent */}
      <div className={cn('absolute left-0 top-0 h-full w-1 bg-gradient-to-b', gradient)} />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Title */}
            <p className="truncate font-mono text-xs font-medium" title={result.title}>
              {result.title}
            </p>

            {/* Badges */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge className={cn('bg-gradient-to-r px-2 py-0.5 text-[10px] font-semibold text-white', gradient)}>
                {result.quality}
              </Badge>
              <Badge variant="outline" className="border-white/10 text-[10px]">
                {result.source}
              </Badge>
              <Badge variant="outline" className="border-white/10 text-[10px]">
                {result.codec}
              </Badge>
              {!result.approved && result.rejected && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-red-500/20 text-[10px] text-red-400">
                      <AlertTriangle className="mr-1 size-3" />
                      Rejected
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{result.rejected}</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Download button */}
          {result.approved && (
            <Button
              size="icon"
              variant="ghost"
              className="size-9 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={onDownload}
            >
              <Download className="size-4" />
            </Button>
          )}
        </div>

        <Separator className="my-3 bg-white/[0.04]" />

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Server className="size-3.5" />
            <span className="font-medium">{result.indexer}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="size-3.5" />
            <span className="font-medium tabular-nums">{result.size}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            <span className="font-medium tabular-nums">{result.seeders} seeders</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <span>{result.age} old</span>
          </div>
        </div>

        {/* Size bar */}
        <div className="mt-3">
          <Progress value={Math.min((sizeGB / 50) * 100, 100)} className="h-1 bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}

export function ManageTab({ movie }: ManageTabProps) {
  const [monitored, setMonitored] = useState(movie.monitored);
  const [qualityProfileId, setQualityProfileId] = useState(String(movie.qualityProfileId));
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = () => {
    setIsSearching(true);
    setSearchOpen(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsSearching(false);
    }, 1500);
  };

  const approvedResults = searchResults.filter((r) => r.approved);

  return (
    <div className="space-y-6">
      {/* Settings Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Monitoring */}
        <SettingCard
          icon={monitored ? Eye : EyeOff}
          iconColor={monitored ? 'text-emerald-400' : 'text-muted-foreground'}
          title="Monitoring"
          description="Automatically search for upgrades and new releases"
        >
          <div className="flex items-center gap-3">
            <Switch id="monitored" checked={monitored} onCheckedChange={setMonitored} />
            <Label htmlFor="monitored" className="cursor-pointer text-sm">
              <span className={cn('font-medium', monitored ? 'text-emerald-400' : 'text-muted-foreground')}>
                {monitored ? 'Monitored' : 'Not Monitored'}
              </span>
            </Label>
          </div>
        </SettingCard>

        {/* Quality Profile */}
        <SettingCard
          icon={Shield}
          iconColor="text-blue-400"
          title="Quality Profile"
          description="Acceptable release quality criteria"
        >
          <Select value={qualityProfileId} onValueChange={setQualityProfileId}>
            <SelectTrigger className="w-full border-white/10 bg-white/[0.02]">
              <SelectValue placeholder="Select profile" />
            </SelectTrigger>
            <SelectContent>
              {qualityProfiles.map((profile) => (
                <SelectItem key={profile.id} value={String(profile.id)}>
                  <div className="flex items-center gap-2">
                    {profile.name === 'Ultra-HD' && <Sparkles className="size-3 text-amber-400" />}
                    {profile.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingCard>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Zap className="size-4 text-amber-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ActionButton
            icon={Search}
            label="Search"
            description="Find releases"
            onClick={handleSearch}
            loading={isSearching}
          />
          <ActionButton icon={RefreshCw} label="Refresh" description="Update metadata" />
          <ActionButton icon={ArrowUpCircle} label="Upgrade" description="Find better quality" />
          <ActionButton icon={Trash2} label="Remove" description="Delete from library" variant="destructive" />
        </div>
      </div>

      {/* Search Results */}
      <Collapsible open={searchOpen} onOpenChange={setSearchOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-gradient-to-r from-white/[0.03] to-transparent p-4 text-left transition-colors hover:border-white/[0.1]">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                <Search className="size-4 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold">Manual Search Results</h3>
                <p className="text-xs text-muted-foreground">
                  {searchResults.length > 0
                    ? `${approvedResults.length} approved of ${searchResults.length} found`
                    : 'Click Search to find releases'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {searchResults.length > 0 && (
                <Badge
                  className={cn(
                    'tabular-nums',
                    approvedResults.length > 0
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/10 text-muted-foreground'
                  )}
                >
                  {approvedResults.length}
                </Badge>
              )}
              <ChevronDown
                className={cn(
                  'size-5 text-muted-foreground transition-transform duration-200',
                  searchOpen && 'rotate-180'
                )}
              />
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-4">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] py-12">
              <Loader2 className="size-8 animate-spin text-amber-500" />
              <p className="mt-4 text-sm font-medium">Searching indexers...</p>
              <p className="mt-1 text-xs text-muted-foreground">This may take a moment</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((result) => (
                <SearchResultCard
                  key={result.id}
                  result={result}
                  onDownload={() => console.log('Download', result.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] py-12 text-center">
              <Search className="size-10 text-muted-foreground/30" />
              <p className="mt-4 text-sm font-medium">No search results</p>
              <p className="mt-1 text-xs text-muted-foreground">Click Search above to find available releases</p>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.02] p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="size-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-400">Danger Zone</h3>
            <p className="mt-0.5 text-sm text-muted-foreground/80">
              Destructive actions that cannot be undone. Use with caution.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Trash2 className="size-4" />
                Delete Files
              </Button>
              <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <BellOff className="size-4" />
                Unmonitor & Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
