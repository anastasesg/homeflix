'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { type MovieLibraryInfo } from '@/api/entities';
import { movieLibraryInfoQueryOptions } from '@/options/queries/movies/library';

import { Query } from '@/components/query';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

import { ActionsSection } from './actions-section';
import { DangerSection } from './danger-section';
import { FileInfo } from './file-info';
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

      {/* FileInfo skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-32" />
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
      <p className="text-sm text-destructive">Failed to load movie information</p>
      <p className="text-xs text-muted-foreground">{error.message}</p>
    </div>
  );
}

// ============================================================================
// Success
// ============================================================================

interface ManagementSheetSuccessProps {
  title: string;
  libraryInfo: MovieLibraryInfo;
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

  const handleMinimumAvailabilityChange = (_value: string) => {
    // TODO: Wire up API mutation to update minimum availability
  };

  const handleSearch = () => {
    // TODO: Wire up search action
  };

  const handleInteractiveSearch = () => {
    // TODO: Wire up interactive search modal
  };

  const handleSearchUpgrade = () => {
    // TODO: Wire up search upgrade action
  };

  const handleRefresh = () => {
    // TODO: Wire up refresh metadata action
  };

  const handleDeleteFile = () => {
    // TODO: Wire up delete file action
  };

  const handleRemoveMovie = (_deleteFiles: boolean) => {
    // TODO: Wire up remove movie action
  };

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
          {/* File Info */}
          <FileInfo file={libraryInfo.file} onSearch={handleSearch} />

          <Separator className="bg-border/20" />

          {/* Settings */}
          <SettingsSection
            qualityProfileId={libraryInfo.qualityProfileId}
            minimumAvailability={libraryInfo.minimumAvailability}
            onQualityProfileChange={handleQualityProfileChange}
            onMinimumAvailabilityChange={handleMinimumAvailabilityChange}
          />

          <Separator className="bg-border/20" />

          {/* Actions */}
          <ActionsSection
            onSearch={handleSearch}
            onInteractiveSearch={handleInteractiveSearch}
            onSearchUpgrade={handleSearchUpgrade}
            onRefresh={handleRefresh}
          />

          <Separator className="bg-border/20" />

          {/* Danger Zone */}
          <DangerSection
            hasFile={libraryInfo.hasFile}
            onDeleteFile={handleDeleteFile}
            onRemoveMovie={handleRemoveMovie}
          />
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
  const query = useQuery(movieLibraryInfoQueryOptions(tmdbId));

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
