'use client';

import { type MinimumAvailability } from '@/api/entities';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ============================================================================
// Types
// ============================================================================

interface QualityProfile {
  id: number;
  name: string;
}

// Mock quality profiles - will come from Radarr API
const qualityProfiles: QualityProfile[] = [
  { id: 1, name: 'Any' },
  { id: 2, name: 'SD' },
  { id: 3, name: 'HD-720p' },
  { id: 4, name: 'HD-1080p' },
  { id: 5, name: 'Ultra-HD' },
  { id: 6, name: 'HD - 720p/1080p' },
];

const minimumAvailabilityOptions: { value: MinimumAvailability; label: string }[] = [
  { value: 'tba', label: 'TBA' },
  { value: 'announced', label: 'Announced' },
  { value: 'inCinemas', label: 'In Cinemas' },
  { value: 'released', label: 'Released' },
];

// ============================================================================
// Main
// ============================================================================

interface SettingsSectionProps {
  qualityProfileId?: number;
  minimumAvailability?: MinimumAvailability;
  onQualityProfileChange?: (id: number) => void;
  onMinimumAvailabilityChange?: (value: MinimumAvailability) => void;
}

function SettingsSection({
  qualityProfileId,
  minimumAvailability,
  onQualityProfileChange,
  onMinimumAvailabilityChange,
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

      {/* Minimum Availability */}
      <div className="space-y-1.5">
        <Label htmlFor="minimum-availability" className="text-xs text-muted-foreground">
          Minimum Availability
        </Label>
        <Select
          value={minimumAvailability}
          onValueChange={(value) => onMinimumAvailabilityChange?.(value as MinimumAvailability)}
        >
          <SelectTrigger id="minimum-availability" className="w-full border-border/40 bg-muted/20">
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
          <SelectContent>
            {minimumAvailabilityOptions.map((option) => (
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
