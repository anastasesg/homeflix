import type { LucideIcon } from 'lucide-react';

/**
 * Base item that all media types must satisfy for use with MediaGrid/MediaCard.
 */
export interface BaseMediaItem {
  id: string | number;
  title: string;
  year?: number;
  posterUrl?: string;
}

/**
 * Status configuration for rendering status badges.
 * Each media type defines its own status configs.
 */
export interface StatusConfig {
  icon: LucideIcon;
  label: string;
  color: string; // Tailwind text color class (e.g., 'text-emerald-400')
  bg: string; // Tailwind background class (e.g., 'bg-emerald-500/20')
  glow?: string; // Optional shadow glow class (e.g., 'shadow-emerald-500/20')
}

/**
 * View modes for media grids.
 */
export type ViewMode = 'grid' | 'list';
