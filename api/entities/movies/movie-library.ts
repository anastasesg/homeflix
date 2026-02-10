import type { MovieFile } from '../shared';

export type MovieLibraryStatus = 'downloaded' | 'downloading' | 'wanted' | 'missing' | 'not_in_library';

export type MinimumAvailability = 'tba' | 'announced' | 'inCinemas' | 'released';

export interface MovieLibraryInfo {
  inLibrary: boolean;
  radarrId?: number;
  status: MovieLibraryStatus;
  monitored: boolean;
  qualityProfileId?: number;
  quality?: string;
  size?: string;
  hasFile: boolean;
  path?: string;
  file?: MovieFile;
  minimumAvailability?: MinimumAvailability;
}
