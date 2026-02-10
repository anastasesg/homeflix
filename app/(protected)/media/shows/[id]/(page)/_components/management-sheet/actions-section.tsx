'use client';

import { ListFilter, Loader2, RefreshCw, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ============================================================================
// Main
// ============================================================================

interface ActionsSectionProps {
  onSearchAllMissing?: () => void;
  onRefresh?: () => void;
  onBrowseReleases?: () => void;
  isSearching?: boolean;
  isRefreshing?: boolean;
}

function ActionsSection({
  onSearchAllMissing,
  onRefresh,
  onBrowseReleases,
  isSearching,
  isRefreshing,
}: ActionsSectionProps) {
  return (
    <div className="space-y-3">
      {/* Primary Actions */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-border/40 bg-muted/20 hover:border-border hover:bg-muted/40"
          onClick={onSearchAllMissing}
          disabled={isSearching}
        >
          {isSearching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Search All Missing
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-border/40 bg-muted/20 hover:border-border hover:bg-muted/40"
          onClick={onBrowseReleases}
        >
          <ListFilter className="size-4" />
          Browse Releases
        </Button>
      </div>

      {/* Separator */}
      <Separator className="bg-border/20" />

      {/* Secondary Action */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
        Refresh Metadata
      </Button>
    </div>
  );
}

export type { ActionsSectionProps };
export { ActionsSection };
