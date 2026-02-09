export type ShowLibraryStatus = 'downloaded' | 'partial' | 'downloading' | 'wanted' | 'missing' | 'not_in_library';

export interface ShowLibraryInfo {
  inLibrary: boolean;
  sonarrId?: number;
  status: ShowLibraryStatus;
  monitored: boolean;
  qualityProfileId?: number;
  totalEpisodes: number;
  downloadedEpisodes: number;
  sizeOnDisk?: string;
  nextAiring?: string;
  path?: string;
  seasons: Array<{
    seasonNumber: number;
    monitored: boolean;
    episodeCount: number;
    episodeFileCount: number;
    totalEpisodeCount: number;
    sizeOnDisk: number;
  }>;
}
