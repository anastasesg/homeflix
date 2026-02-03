'use client';

import { useState } from 'react';

import {
  AudioLines,
  Check,
  Copy,
  Film,
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

import type { Movie, MovieFile } from './types';

interface FilesTabProps {
  movie: Movie;
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

interface FileCardProps {
  file: MovieFile;
}

function FileCard({ file }: FileCardProps) {
  const [copied, setCopied] = useState(false);
  const filename = file.path.split('/').pop() ?? file.path;
  const directory = file.path.split('/').slice(0, -1).join('/');
  const qualityGradient = getQualityColor(file.quality);
  const qualityLabel = getQualityLabel(file.quality);
  const videoCodec = getCodecIcon(file.videoCodec);
  const audioBadge = getAudioBadge(file.audioCodec);

  const handleCopyPath = async () => {
    await navigator.clipboard.writeText(file.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent transition-all duration-300 hover:border-white/[0.12] hover:from-white/[0.05]">
      {/* Quality accent bar */}
      <div className={cn('absolute left-0 top-0 h-full w-1 bg-gradient-to-b', qualityGradient)} />

      <div className="p-5 pl-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Filename */}
            <div className="flex items-center gap-2">
              <Film className="size-4 shrink-0 text-amber-500" />
              <h4 className="truncate font-mono text-sm font-medium" title={filename}>
                {filename}
              </h4>
            </div>

            {/* Directory path */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <Folder className="size-3 text-muted-foreground/50" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCopyPath}
                    className="flex items-center gap-1 truncate text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
                  >
                    <span className="truncate">{directory}</span>
                    {copied ? (
                      <Check className="size-3 shrink-0 text-emerald-400" />
                    ) : (
                      <Copy className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Click to copy full path</TooltipContent>
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

        <Separator className="my-4 bg-white/[0.04]" />

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Quality */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Quality</p>
            <div className="flex items-center gap-2">
              <Badge className={cn('bg-gradient-to-r px-2 py-0.5 text-xs font-semibold text-white', qualityGradient)}>
                {qualityLabel}
              </Badge>
            </div>
          </div>

          {/* Resolution */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Resolution</p>
            <div className="flex items-center gap-1.5">
              <MonitorPlay className="size-3.5 text-muted-foreground" />
              <span className="text-sm font-medium tabular-nums">{file.resolution}</span>
            </div>
          </div>

          {/* Video Codec */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Video</p>
            <div className="flex items-center gap-1.5">
              <Video className="size-3.5 text-muted-foreground" />
              <span className={cn('text-sm font-semibold', videoCodec.color)}>{videoCodec.icon}</span>
            </div>
          </div>

          {/* Audio */}
          <div className="space-y-1.5">
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
        <div className="mt-4 flex items-center gap-3">
          <HardDrive className="size-4 text-muted-foreground/50" />
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold tabular-nums">{file.size}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">File Size</span>
            </div>
            <Progress
              value={Math.min((parseFileSize(file.size) / 50) * 100, 100)}
              className="mt-1.5 h-1.5 bg-white/[0.04]"
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
        This movie hasn&apos;t been downloaded yet. Search for releases or wait for automatic download.
      </p>
      <Button variant="outline" size="sm" className="mt-6 gap-2 border-white/10">
        <Play className="size-4" />
        Search for releases
      </Button>
    </div>
  );
}

function StorageSummary({ files }: { files: MovieFile[] }) {
  const totalSize = files.reduce((acc, file) => acc + parseFileSize(file.size), 0);
  const formattedTotal = totalSize >= 1024 ? `${(totalSize / 1024).toFixed(2)} TB` : `${totalSize.toFixed(2)} GB`;

  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
          <HardDrive className="size-4 text-amber-500" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Storage</p>
          <p className="text-lg font-semibold tabular-nums">{formattedTotal}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Files</p>
        <p className="text-lg font-semibold tabular-nums">{files.length}</p>
      </div>
    </div>
  );
}

export function FilesTab({ movie }: FilesTabProps) {
  if (movie.files.length === 0) {
    return <EmptyFiles />;
  }

  return (
    <div className="space-y-4">
      <StorageSummary files={movie.files} />

      <div className="space-y-3">
        {movie.files.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
