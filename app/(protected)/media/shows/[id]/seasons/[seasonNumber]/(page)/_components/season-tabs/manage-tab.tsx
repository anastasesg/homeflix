'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowUpCircle, Eye, EyeOff, Loader2, Search, Trash2, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';
import { sonarrLookupQueryOptions } from '@/options/queries/tmdb';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

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
      <div className="rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 to-transparent p-5">
        <div className="flex gap-4">
          <Skeleton className="size-10 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="mt-4 h-8 w-32" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="mb-3 h-4 w-24" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Content
// ============================================================================

interface ManageTabContentProps {
  seasonMonitored: boolean;
  seasonNumber: number;
}

function ManageTabContent({ seasonMonitored: initialMonitored }: ManageTabContentProps) {
  const [monitored, setMonitored] = useState(initialMonitored);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchMissing = () => {
    setIsSearching(true);
    // TODO: Implement actual search via Sonarr API
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Season Monitoring */}
      <SettingCard
        icon={monitored ? Eye : EyeOff}
        iconColor={monitored ? 'text-emerald-400' : 'text-muted-foreground'}
        title="Season Monitoring"
        description="Automatically search for and download episodes in this season"
      >
        <div className="flex items-center gap-3">
          <Switch id="season-monitored" checked={monitored} onCheckedChange={setMonitored} />
          <Label htmlFor="season-monitored" className="cursor-pointer text-sm">
            <span className={cn('font-medium', monitored ? 'text-emerald-400' : 'text-muted-foreground')}>
              {monitored ? 'Monitored' : 'Not Monitored'}
            </span>
          </Label>
        </div>
      </SettingCard>

      {/* Quick Actions */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Zap className="size-4 text-amber-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <ActionButton
            icon={Search}
            label="Search Missing"
            description="Find missing episodes"
            onClick={handleSearchMissing}
            loading={isSearching}
          />
          <ActionButton icon={ArrowUpCircle} label="Search Upgrades" description="Find better quality" />
          <ActionButton icon={Trash2} label="Delete Files" description="Remove season files" variant="destructive" />
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
                Delete Season Files
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
  seasonNumber: number;
  sonarrId: number;
}

function ManageTab({ tmdbId, seasonNumber }: ManageTabProps) {
  const libraryQuery = useQuery(sonarrLookupQueryOptions(tmdbId));

  return (
    <Query
      result={libraryQuery}
      callbacks={{
        loading: ManageTabLoading,
        error: () => null,
        success: (data) => {
          const sonarrSeason = data.seasons.find((s) => s.seasonNumber === seasonNumber);
          return <ManageTabContent seasonMonitored={sonarrSeason?.monitored ?? false} seasonNumber={seasonNumber} />;
        },
      }}
    />
  );
}

export type { ManageTabProps };
export { ManageTab };
