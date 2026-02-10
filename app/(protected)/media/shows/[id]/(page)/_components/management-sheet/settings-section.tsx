'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ============================================================================
// Types
// ============================================================================

interface QualityProfile {
  id: number;
  name: string;
}

// Mock quality profiles - will come from Sonarr API
const qualityProfiles: QualityProfile[] = [
  { id: 1, name: 'Any' },
  { id: 2, name: 'SD' },
  { id: 3, name: 'HD-720p' },
  { id: 4, name: 'HD-1080p' },
  { id: 5, name: 'Ultra-HD' },
  { id: 6, name: 'HD - 720p/1080p' },
];

const seriesTypeOptions: { value: string; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'daily', label: 'Daily' },
  { value: 'anime', label: 'Anime' },
];

// ============================================================================
// Main
// ============================================================================

interface SettingsSectionProps {
  qualityProfileId?: number;
  seriesType?: string;
  onQualityProfileChange?: (id: number) => void;
  onSeriesTypeChange?: (value: string) => void;
}

function SettingsSection({
  qualityProfileId,
  seriesType = 'standard',
  onQualityProfileChange,
  onSeriesTypeChange,
}: SettingsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Quality Profile */}
      <div className="space-y-1.5">
        <Label htmlFor="quality-profile" className="text-xs text-muted-foreground">
          Quality Profile
        </Label>
        <Select
          value={qualityProfileId ? String(qualityProfileId) : undefined}
          onValueChange={(value) => onQualityProfileChange?.(parseInt(value, 10))}
        >
          <SelectTrigger id="quality-profile" className="w-full border-border/40 bg-muted/20">
            <SelectValue placeholder="Select profile" />
          </SelectTrigger>
          <SelectContent>
            {qualityProfiles.map((profile) => (
              <SelectItem key={profile.id} value={String(profile.id)}>
                {profile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Series Type */}
      <div className="space-y-1.5">
        <Label htmlFor="series-type" className="text-xs text-muted-foreground">
          Series Type
        </Label>
        <Select value={seriesType} onValueChange={(value) => onSeriesTypeChange?.(value)}>
          <SelectTrigger id="series-type" className="w-full border-border/40 bg-muted/20">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {seriesTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export type { SettingsSectionProps };
export { SettingsSection };
