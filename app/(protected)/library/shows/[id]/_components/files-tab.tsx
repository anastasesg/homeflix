'use client';

import { useState } from 'react';

import {
  AudioLines,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  File,
  Folder,
  HardDrive,
  MonitorPlay,
  MoreHorizontal,
  Pencil,
  Play,
  Trash2,
  Video,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { EpisodeFile, Show } from './types';

interface FilesTabProps {
  show: Show;
}

function parseFileSize(size: string): number {
  const match = size.match(/([\d.]+)\s*(GB|MB|TB)/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === 'TB') return value * 1024;
  if (unit === 'GB') return value;
  if (unit === 'MB') return value / 1024;
  return 0;
}

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

interface EpisodeFileCardProps {
  file: EpisodeFile;
  compact?: boolean;
}

function EpisodeFileCard({ file, compact }: EpisodeFileCardProps) {
  const [copied, setCopied] = useState(false);
  const filename = file.path.split('/').pop() ?? file.path;
  const qualityGradient = getQualityColor(file.quality);
  const qualityLabel = getQualityLabel(file.quality);
  const videoCodec = getCodecIcon(file.videoCodec);
  const audioBadge = getAudioBadge(file.audioCodec);

  const handleCopyPath = async () => {
    await navigator.clipboard.writeText(file.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <div className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-white/[0.04] bg-white/[0.01] px-3 py-2.5 transition-all hover:border-white/[0.08] hover:bg-white/[0.03]">
        {/* Quality accent */}
        <div className={cn('absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b', qualityGradient)} />

        {/* Episode number */}
        <span className="shrink-0 font-mono text-xs text-muted-foreground/70">
          E{file.episodeNumber.toString().padStart(2, '0')}
        </span>

        {/* Title */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <File className="size-3.5 shrink-0 text-muted-foreground/50" />
          <span className="truncate text-sm" title={file.episodeTitle}>
            {file.episodeTitle}
          </span>
        </div>

        {/* Badges */}
        <div className="flex shrink-0 items-center gap-2">
          <Badge className={cn('bg-gradient-to-r px-1.5 py-0 text-[10px] font-semibold text-white', qualityGradient)}>
            {qualityLabel}
          </Badge>
          <span className={cn('font-mono text-[10px] font-semibold', videoCodec.color)}>{videoCodec.icon}</span>
          <span className="text-xs tabular-nums text-muted-foreground">{file.size}</span>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopyPath}>
              {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
              {copied ? 'Copied!' : 'Copy path'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Play className="size-4" />
              Play file
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Folder className="size-4" />
              Open folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="size-4" />
              Delete file
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent transition-all duration-300 hover:border-white/[0.12] hover:from-white/[0.05]">
      {/* Quality accent bar */}
      <div className={cn('absolute left-0 top-0 h-full w-1 bg-gradient-to-b', qualityGradient)} />

      <div className="p-4 pl-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Episode badge + title */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="shrink-0 border-white/20 font-mono text-xs">
                S{file.seasonNumber.toString().padStart(2, '0')}E{file.episodeNumber.toString().padStart(2, '0')}
              </Badge>
              <h4 className="truncate text-sm font-medium" title={file.episodeTitle}>
                {file.episodeTitle}
              </h4>
            </div>

            {/* Filename */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <File className="size-3 text-muted-foreground/50" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCopyPath}
                    className="flex items-center gap-1 truncate font-mono text-[11px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                  >
                    <span className="truncate">{filename}</span>
                    {copied ? (
                      <Check className="size-3 shrink-0 text-emerald-400" />
                    ) : (
                      <Copy className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Click to copy full path</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Play className="size-4" />
                Play file
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Folder className="size-4" />
                Open folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pencil className="size-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="size-4" />
                Delete file
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator className="my-3 bg-white/[0.04]" />

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Quality */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Quality</p>
            <Badge className={cn('bg-gradient-to-r px-2 py-0.5 text-xs font-semibold text-white', qualityGradient)}>
              {qualityLabel}
            </Badge>
          </div>

          {/* Resolution */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Resolution</p>
            <div className="flex items-center gap-1.5">
              <MonitorPlay className="size-3.5 text-muted-foreground" />
              <span className="text-sm font-medium tabular-nums">{file.resolution}</span>
            </div>
          </div>

          {/* Video Codec */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Video</p>
            <div className="flex items-center gap-1.5">
              <Video className="size-3.5 text-muted-foreground" />
              <span className={cn('text-sm font-semibold', videoCodec.color)}>{videoCodec.icon}</span>
            </div>
          </div>

          {/* Audio */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Audio</p>
            <div className="flex items-center gap-1.5">
              <AudioLines className="size-3.5 text-muted-foreground" />
              <span className={cn('text-sm font-medium', audioBadge.premium ? 'text-amber-400' : 'text-foreground')}>
                {audioBadge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Size indicator */}
        <div className="mt-3 flex items-center gap-3">
          <HardDrive className="size-3.5 text-muted-foreground/50" />
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold tabular-nums">{file.size}</span>
            </div>
            <Progress
              value={Math.min((parseFileSize(file.size) / 5) * 100, 100)}
              className="mt-1 h-1 bg-white/[0.04]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyFiles() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] py-16 text-center">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl" />
        <HardDrive className="relative size-14 text-muted-foreground/30" />
      </div>
      <h3 className="mt-6 text-lg font-medium">No files found</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        No episode files are currently downloaded for this show. Search for releases or wait for automatic download.
      </p>
      <Button variant="outline" size="sm" className="mt-6 gap-2 border-white/10">
        <Play className="size-4" />
        Search for releases
      </Button>
    </div>
  );
}

interface StorageSummaryProps {
  files: EpisodeFile[];
  seasonCount: number;
}

function StorageSummary({ files, seasonCount }: StorageSummaryProps) {
  const totalSize = files.reduce((acc, file) => acc + parseFileSize(file.size), 0);
  const formattedTotal = totalSize >= 1024 ? `${(totalSize / 1024).toFixed(2)} TB` : `${totalSize.toFixed(1)} GB`;
  const seasonsWithFiles = new Set(files.map((f) => f.seasonNumber)).size;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-gradient-to-r from-white/[0.03] to-transparent px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
          <HardDrive className="size-5 text-amber-500" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Storage</p>
          <p className="text-xl font-semibold tabular-nums">{formattedTotal}</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-lg font-semibold tabular-nums">{files.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Episodes</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold tabular-nums">
            {seasonsWithFiles}/{seasonCount}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Seasons</p>
        </div>
      </div>
    </div>
  );
}

export function FilesTab({ show }: FilesTabProps) {
  const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(new Set());

  if (show.files.length === 0) {
    return <EmptyFiles />;
  }

  // Group files by season
  const filesBySeason = show.files.reduce(
    (acc, file) => {
      if (!acc[file.seasonNumber]) {
        acc[file.seasonNumber] = [];
      }
      acc[file.seasonNumber].push(file);
      return acc;
    },
    {} as Record<number, EpisodeFile[]>
  );

  const seasonNumbers = Object.keys(filesBySeason)
    .map(Number)
    .sort((a, b) => a - b);

  const toggleSeason = (seasonNumber: number) => {
    setExpandedSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(seasonNumber)) {
        next.delete(seasonNumber);
      } else {
        next.add(seasonNumber);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedSeasons(new Set(seasonNumbers));
  const collapseAll = () => setExpandedSeasons(new Set());

  return (
    <div className="space-y-4">
      <StorageSummary files={show.files} seasonCount={show.seasons.length} />

      {/* Controls */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={expandAll} className="h-7 text-xs">
          Expand All
        </Button>
        <Button variant="ghost" size="sm" onClick={collapseAll} className="h-7 text-xs">
          Collapse All
        </Button>
      </div>

      {/* Seasons */}
      <div className="space-y-2">
        {seasonNumbers.map((seasonNumber) => {
          const seasonFiles = filesBySeason[seasonNumber].sort((a, b) => a.episodeNumber - b.episodeNumber);
          const isExpanded = expandedSeasons.has(seasonNumber);
          const seasonSize = seasonFiles.reduce((acc, f) => acc + parseFileSize(f.size), 0);

          return (
            <Collapsible key={seasonNumber} open={isExpanded} onOpenChange={() => toggleSeason(seasonNumber)}>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:bg-white/[0.03]">
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center gap-4 px-4 py-3 text-left">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                      {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">Season {seasonNumber}</span>
                        <Badge variant="secondary" className="text-xs">
                          {seasonFiles.length} {seasonFiles.length === 1 ? 'file' : 'files'}
                        </Badge>
                      </div>
                      <span className="text-sm tabular-nums text-muted-foreground">{seasonSize.toFixed(1)} GB</span>
                    </div>
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t border-white/[0.04] px-4 pb-4 pt-2">
                    <div className="space-y-1">
                      {seasonFiles.map((file) => (
                        <EpisodeFileCard key={file.id} file={file} compact />
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
