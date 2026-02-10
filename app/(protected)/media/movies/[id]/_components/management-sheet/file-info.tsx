'use client';

import { useState } from 'react';

import { Check, ChevronDown, Copy, Film, Folder, HardDrive } from 'lucide-react';

import { type MovieFile } from '@/api/entities';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// ============================================================================
// Utilities
// ============================================================================

function getQualityColor(quality: string): string {
  const q = quality.toLowerCase();
  if (q.includes('2160') || q.includes('4k') || q.includes('uhd')) {
    return 'from-amber-500 to-orange-600';
  }
  if (q.includes('1080')) {
    return 'from-blue-500 to-indigo-600';
  }
  if (q.includes('720')) {
    return 'from-emerald-500 to-teal-600';
  }
  return 'from-zinc-500 to-zinc-600';
}

function getQualityLabel(quality: string): string {
  const q = quality.toLowerCase();
  if (q.includes('2160') || q.includes('4k') || q.includes('uhd')) return '4K UHD';
  if (q.includes('1080')) return '1080p';
  if (q.includes('720')) return '720p';
  if (q.includes('480')) return '480p';
  return quality;
}

function getCodecIcon(codec: string): { icon: string; color: string } {
  const c = codec.toLowerCase();
  if (c.includes('x265') || c.includes('hevc')) {
    return { icon: 'H.265', color: 'text-emerald-400' };
  }
  if (c.includes('x264') || c.includes('avc')) {
    return { icon: 'H.264', color: 'text-blue-400' };
  }
  if (c.includes('av1')) {
    return { icon: 'AV1', color: 'text-purple-400' };
  }
  return { icon: codec, color: 'text-muted-foreground' };
}

function getAudioBadge(audio: string): { label: string; premium: boolean } {
  const a = audio.toLowerCase();
  if (a.includes('atmos')) return { label: 'Dolby Atmos', premium: true };
  if (a.includes('truehd')) return { label: 'TrueHD', premium: true };
  if (a.includes('dts-hd') || a.includes('dts:x')) return { label: 'DTS-HD MA', premium: true };
  if (a.includes('dts')) return { label: 'DTS', premium: false };
  if (a.includes('ac3') || a.includes('dd')) return { label: 'Dolby Digital', premium: false };
  if (a.includes('aac')) return { label: 'AAC', premium: false };
  return { label: audio, premium: false };
}

// ============================================================================
// Main
// ============================================================================

interface FileInfoProps {
  file?: MovieFile;
  onSearch?: () => void;
}

function FileInfo({ file, onSearch }: FileInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Empty state: no file available
  if (!file) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/50 bg-muted/20 py-8 text-center">
        <div className="flex items-center gap-2">
          <HardDrive className="size-5 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No file available</p>
        </div>
        {onSearch && (
          <Button variant="outline" size="sm" onClick={onSearch} className="gap-2">
            <Film className="size-4" />
            Search for Releases
          </Button>
        )}
      </div>
    );
  }

  const qualityGradient = getQualityColor(file.quality);
  const qualityLabel = getQualityLabel(file.quality);
  const audioBadge = getAudioBadge(file.audioCodec);
  const videoCodec = getCodecIcon(file.videoCodec);
  const filename = file.path.split('/').pop() ?? file.path;
  const directory = file.path.split('/').slice(0, -1).join('/');

  const handleCopyPath = async () => {
    await navigator.clipboard.writeText(file.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Essential row: Quality, Audio, Size */}
      <div className="flex items-center gap-4">
        {/* Quality badge */}
        <Badge className={cn('bg-gradient-to-r px-2.5 py-0.5 text-xs font-semibold text-white', qualityGradient)}>
          {qualityLabel}
        </Badge>

        {/* Audio format */}
        <div className="flex items-center gap-1.5">
          <span className={cn('text-sm font-medium', audioBadge.premium ? 'text-amber-400' : 'text-foreground')}>
            {audioBadge.label}
          </span>
        </div>

        {/* File size */}
        <div className="ml-auto flex items-center gap-1.5">
          <HardDrive className="size-4 text-muted-foreground/50" />
          <span className="text-sm font-semibold tabular-nums">{file.size}</span>
        </div>
      </div>

      {/* Expandable details */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-full gap-2 text-xs text-muted-foreground">
            <span>{isOpen ? 'Hide details' : 'Show details'}</span>
            <ChevronDown className={cn('size-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3 space-y-3">
          {/* Technical specs grid */}
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
            {/* Resolution */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Resolution</p>
              <span className="text-sm font-medium tabular-nums">{file.resolution}</span>
            </div>

            {/* Video codec */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Video Codec</p>
              <span className={cn('text-sm font-semibold', videoCodec.color)}>{videoCodec.icon}</span>
            </div>

            {/* Audio codec */}
            <div className="col-span-2 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Audio Codec</p>
              <span className="text-sm font-medium">{file.audioCodec}</span>
            </div>
          </div>

          {/* File path details */}
          <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-3">
            {/* Filename */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Filename</p>
              <div className="flex items-center gap-1.5">
                <Film className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate font-mono text-xs" title={filename}>
                  {filename}
                </span>
              </div>
            </div>

            {/* Directory path with copy */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Directory</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCopyPath}
                    className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 transition-colors hover:bg-muted/50"
                  >
                    <Folder className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate text-left font-mono text-xs text-muted-foreground">
                      {directory}
                    </span>
                    {copied ? (
                      <Check className="size-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5 shrink-0 text-muted-foreground/50" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Click to copy full path</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export type { FileInfoProps };
export { FileInfo };
