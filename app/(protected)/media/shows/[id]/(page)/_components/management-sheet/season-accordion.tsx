'use client';

import type { ShowLibraryInfo } from '@/api/entities';
import { cn } from '@/lib/utils';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// ============================================================================
// Utilities
// ============================================================================

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// ============================================================================
// Main
// ============================================================================

interface SeasonAccordionProps {
  seasons: ShowLibraryInfo['seasons'];
}

function SeasonAccordion({ seasons }: SeasonAccordionProps) {
  // Filter out specials (season 0) and sort by season number
  const displaySeasons = seasons.filter((s) => s.seasonNumber > 0).sort((a, b) => a.seasonNumber - b.seasonNumber);

  if (displaySeasons.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-muted-foreground/20 bg-muted/20 p-6 text-center">
        <p className="text-sm text-muted-foreground">No seasons available</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {displaySeasons.map((season) => {
        const progress = season.totalEpisodeCount > 0 ? (season.episodeFileCount / season.totalEpisodeCount) * 100 : 0;
        const isComplete = season.episodeFileCount === season.totalEpisodeCount && season.totalEpisodeCount > 0;

        return (
          <AccordionItem
            key={season.seasonNumber}
            value={`season-${season.seasonNumber}`}
            className="rounded-xl border border-border/40 bg-muted/10 px-4 transition-colors hover:border-border"
          >
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex flex-1 items-center justify-between pr-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Season {season.seasonNumber}</span>
                  {season.monitored && (
                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      Monitored
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>
                    {season.episodeFileCount} of {season.totalEpisodeCount} episodes
                  </span>
                  {isComplete && <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">✓</Badge>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-2">
              <div className="space-y-3">
                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Download Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        isComplete ? 'bg-emerald-500' : 'bg-blue-500'
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Size on Disk */}
                <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
                  <span className="text-sm text-muted-foreground">Size on disk</span>
                  <span className="font-mono text-sm font-medium">{formatBytes(season.sizeOnDisk)}</span>
                </div>

                {/* Monitoring Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
                  <Label htmlFor={`season-${season.seasonNumber}-monitor`} className="cursor-pointer text-sm">
                    Monitor this season
                  </Label>
                  <Switch
                    id={`season-${season.seasonNumber}-monitor`}
                    checked={season.monitored}
                    disabled
                    className="cursor-not-allowed opacity-60"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export type { SeasonAccordionProps };
export { SeasonAccordion };
