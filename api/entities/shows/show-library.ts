export type ShowLibraryStatus = 'downloaded' | 'partial' | 'downloading' | 'wanted' | 'missing' | 'not_in_library';

export interface EpisodeFile {
  id: number;
  path: string;
  size: string;
  quality: string;
  videoCodec: string;
  audioCodec: string;
  resolution: string;
  languages: string[];
  dateAdded: string;
  seasonNumber: number;
  episodeNumber: number;
}

export interface ShowHistoryEvent {
  id: number;
  type:
    | 'grabbed'
    | 'downloadFolderImported'
    | 'downloadFailed'
    | 'episodeFileDeleted'
    | 'episodeFileRenamed'
    | 'unknown';
  date: string;
  quality: string;
  indexer?: string;
  downloadClient?: string;
  reason?: string;
  sourceTitle?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
}

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
