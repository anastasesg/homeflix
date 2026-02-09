'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FilesTab } from '../movie-tabs/files-tab';
import { HistoryTab } from '../movie-tabs/history-tab';
import { ManageTab } from '../movie-tabs/manage-tab';

// ============================================================================
// Main
// ============================================================================

interface ManagementSheetProps {
  tmdbId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ManagementSheet({ tmdbId, open, onOpenChange }: ManagementSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Manage Movie</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="files" className="mt-6">
          <TabsList className="w-full bg-muted/20">
            <TabsTrigger value="files" className="flex-1">
              Files
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              History
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex-1">
              Manage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-4">
            <FilesTab tmdbId={tmdbId} />
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <HistoryTab tmdbId={tmdbId} />
          </TabsContent>

          <TabsContent value="manage" className="mt-4">
            <ManageTab tmdbId={tmdbId} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export type { ManagementSheetProps };
export { ManagementSheet };
