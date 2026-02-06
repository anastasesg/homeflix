'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowUpCircle,
  BellOff,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';

import { type LibraryInfo } from '@/api/entities';
import { cn } from '@/lib/utils';
import { radarrLookupQueryOptions } from '@/options/queries/tmdb';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

// ============================================================================
// Types
// ============================================================================

interface QualityProfile {
  id: number;
  name: string;
}

// Mock quality profiles - will come from Radarr API
const qualityProfiles: QualityProfile[] = [
  { id: 1, name: 'Any' },
  { id: 2, name: 'SD' },
  { id: 3, name: 'HD-720p' },
  { id: 4, name: 'HD-1080p' },
  { id: 5, name: 'Ultra-HD' },
  { id: 6, name: 'HD - 720p/1080p' },
];

// ============================================================================
// Setting Card
// ============================================================================

interface SettingCardProps {
  icon: React.ElementType;
  iconColor?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingCard({ icon: Icon, iconColor = 'text-amber-500', title, description, children }: SettingCardProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 to-transparent p-5 transition-colors hover:border-border">
      <div className="flex gap-4">
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/20', iconColor)}>
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

// ============================================================================
// Action Button
// ============================================================================

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
          : 'border-border/40 bg-muted/20 hover:border-border hover:bg-muted/40',
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

// ============================================================================
// Loading
// ============================================================================

function ManageTabLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 to-transparent p-5"
          >
            <div className="flex gap-4">
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="mt-4 h-8 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="mb-3 h-4 w-24" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Error
// ============================================================================

function ManageTabError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <h2 className="text-lg font-semibold text-destructive">Failed to load settings</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// ============================================================================
// Content
// ============================================================================

function ManageTabContent({ libraryInfo }: { libraryInfo: LibraryInfo }) {
  const [monitored, setMonitored] = useState(libraryInfo.monitored);
  const [qualityProfileId, setQualityProfileId] = useState(String(libraryInfo.qualityProfileId ?? 4));
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // TODO: Implement actual search via Radarr API
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Settings Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Monitoring */}
        <SettingCard
          icon={monitored ? Eye : EyeOff}
          iconColor={monitored ? 'text-emerald-400' : 'text-muted-foreground'}
          title="Monitoring"
          description="Automatically search for upgrades"
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
            <SelectTrigger className="w-full border-border/40 bg-muted/20">
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

// ============================================================================
// Main
// ============================================================================

interface ManageTabProps {
  tmdbId: number;
}

function ManageTab({ tmdbId }: ManageTabProps) {
  const libraryQuery = useQuery(radarrLookupQueryOptions(tmdbId));

  return (
    <Query
      result={libraryQuery}
      callbacks={{
        loading: ManageTabLoading,
        error: (error) => <ManageTabError error={error} />,
        success: (data) => <ManageTabContent libraryInfo={data} />,
      }}
    />
  );
}

export type { ManageTabProps };
export { ManageTab };
