'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Plus, Settings } from 'lucide-react';

import { type MovieLibraryInfo } from '@/api/entities';
import { movieLibraryInfoQueryOptions } from '@/options/queries/movies/library';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { ManagementSheet } from '../management-sheet';

// ============================================================================
// Loading
// ============================================================================

function ManagementButtonLoading() {
  return <Skeleton className="size-9 rounded-md" />;
}

// ============================================================================
// Success
// ============================================================================

interface ManagementButtonSuccessProps {
  tmdbId: number;
  title: string;
  libraryInfo: MovieLibraryInfo;
}

function ManagementButtonSuccess({ tmdbId, title, libraryInfo }: ManagementButtonSuccessProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!libraryInfo.inLibrary) {
    return (
      <Button variant="outline" size="sm" className="gap-2">
        <Plus className="size-4" />
        Add to Library
      </Button>
    );
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSheetOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Manage</TooltipContent>
      </Tooltip>

      <ManagementSheet tmdbId={tmdbId} title={title} open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}

// ============================================================================
// Main
// ============================================================================

interface ManagementButtonProps {
  tmdbId: number;
  title?: string;
}

function ManagementButton({ tmdbId, title = 'Manage Movie' }: ManagementButtonProps) {
  const query = useQuery(movieLibraryInfoQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: ManagementButtonLoading,
        error: () => null,
        success: (data) => <ManagementButtonSuccess tmdbId={tmdbId} title={title} libraryInfo={data} />,
      }}
    />
  );
}

export type { ManagementButtonProps };
export { ManagementButton };
