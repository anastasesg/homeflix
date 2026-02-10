'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { type ShowLibraryInfo } from '@/api/entities';
import { showLibraryInfoQueryOptions } from '@/options/queries/shows/library';

import { Query } from '@/components/query';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

import { ActionsSection } from './actions-section';
import { DangerSection } from './danger-section';
import { SeasonAccordion } from './season-accordion';
import { SettingsSection } from './settings-section';
import { StatusPill } from './status-pill';

// ============================================================================
// Loading
// ============================================================================

function ManagementSheetLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header elements skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-10 w-16" />
      </div>

      <Separator className="bg-border/20" />

      {/* Season accordion skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>

      <Separator className="bg-border/20" />

      {/* Settings skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>

      <Separator className="bg-border/20" />

      {/* Actions skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Separator className="bg-border/20" />

      {/* Danger section skeleton */}
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}

// ============================================================================
// Error
// ============================================================================

interface ManagementSheetErrorProps {
  error: Error;
}

function ManagementSheetError({ error }: ManagementSheetErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-6 text-center">
      <p className="text-sm text-destructive">Failed to load show information</p>
      <p className="text-xs text-muted-foreground">{error.message}</p>
    </div>
  );
}

// ============================================================================
// Success
// ============================================================================

interface ManagementSheetSuccessProps {
  title: string;
  libraryInfo: ShowLibraryInfo;
}

function ManagementSheetSuccess({ title, libraryInfo }: ManagementSheetSuccessProps) {
  const [monitored, setMonitored] = useState(libraryInfo.monitored);

  const handleMonitoredChange = (checked: boolean) => {
    setMonitored(checked);
    // TODO: Wire up API mutation to update monitored status
  };

  const handleQualityProfileChange = (_id: number) => {
    // TODO: Wire up API mutation to update quality profile
  };

  const handleSeriesTypeChange = (_value: string) => {
    // TODO: Wire up API mutation to update series type
  };

  const handleSearchAllMissing = () => {
    // TODO: Wire up search all missing action
  };

  const handleRefresh = () => {
    // TODO: Wire up refresh metadata action
  };

  const handleBrowseReleases = () => {
    // TODO: Wire up browse releases modal
  };

  const handleDeleteFiles = () => {
    // TODO: Wire up delete all files action
  };

  const handleRemoveShow = (_deleteFiles: boolean) => {
    // TODO: Wire up remove show action
  };

  const hasFiles = libraryInfo.downloadedEpisodes > 0;

  return (
    <>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        <div className="flex items-center gap-3 pt-2">
          <StatusPill status={libraryInfo.status} />
          <div className="flex items-center gap-2">
            <Switch id="monitored" checked={monitored} onCheckedChange={handleMonitoredChange} />
            <Label htmlFor="monitored" className="cursor-pointer text-sm text-muted-foreground">
              Monitored
            </Label>
          </div>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6">
          {/* Season Accordion */}
          <SeasonAccordion seasons={libraryInfo.seasons} />

          <Separator className="bg-border/20" />

          {/* Settings */}
          <SettingsSection
            qualityProfileId={libraryInfo.qualityProfileId}
            onQualityProfileChange={handleQualityProfileChange}
            onSeriesTypeChange={handleSeriesTypeChange}
          />

          <Separator className="bg-border/20" />

          {/* Actions */}
          <ActionsSection
            onSearchAllMissing={handleSearchAllMissing}
            onRefresh={handleRefresh}
            onBrowseReleases={handleBrowseReleases}
          />

          <Separator className="bg-border/20" />

          {/* Danger Zone */}
          <DangerSection hasFiles={hasFiles} onDeleteFiles={handleDeleteFiles} onRemoveShow={handleRemoveShow} />
        </div>
      </ScrollArea>
    </>
  );
}

// ============================================================================
// Main
// ============================================================================

interface ManagementSheetProps {
  tmdbId: number;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ManagementSheet({ tmdbId, title, open, onOpenChange }: ManagementSheetProps) {
  const query = useQuery(showLibraryInfoQueryOptions(tmdbId));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col sm:max-w-lg">
        <Query
          result={query}
          callbacks={{
            loading: ManagementSheetLoading,
            error: (error) => <ManagementSheetError error={error} />,
            success: (data) => <ManagementSheetSuccess title={title} libraryInfo={data} />,
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

export type { ManagementSheetProps };
export { ManagementSheet };
