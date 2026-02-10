'use client';

import { useState } from 'react';

import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// ============================================================================
// Main
// ============================================================================

interface DangerSectionProps {
  hasFiles: boolean;
  onDeleteFiles?: () => void;
  onRemoveShow?: (deleteFiles: boolean) => void;
  isDeleting?: boolean;
  isRemoving?: boolean;
}

function DangerSection({ hasFiles, onDeleteFiles, onRemoveShow, isDeleting, isRemoving }: DangerSectionProps) {
  const [deleteFiles, setDeleteFiles] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRemoveShow = () => {
    onRemoveShow?.(deleteFiles);
    setIsDialogOpen(false);
    setDeleteFiles(false); // Reset for next time
  };

  return (
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
            {/* Delete All Files Button */}
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
              onClick={onDeleteFiles}
              disabled={!hasFiles || isDeleting}
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Delete All Files
            </Button>

            {/* Remove Show Button with Confirmation Dialog */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  disabled={isRemoving}
                >
                  {isRemoving ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
                  Remove Show
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Show</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove the show from your library. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Checkbox for deleting files */}
                <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-4">
                  <Checkbox
                    id="delete-files"
                    checked={deleteFiles}
                    onCheckedChange={(checked) => setDeleteFiles(checked === true)}
                  />
                  <Label htmlFor="delete-files" className="cursor-pointer text-sm">
                    Also delete files on disk
                  </Label>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveShow();
                    }}
                  >
                    Remove Show
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { DangerSectionProps };
export { DangerSection };
