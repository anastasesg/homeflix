export type LibraryStatus = 'downloaded' | 'downloading' | 'wanted' | 'missing' | 'not_in_library';

export interface MovieFile {
  id: number;
  path: string;
  size: string;
  quality: string;
  videoCodec: string;
  audioCodec: string;
  resolution: string;
  languages: string[];
  dateAdded: string;
}

export interface HistoryEvent {
  id: number;
  type: 'grabbed' | 'downloadFolderImported' | 'downloadFailed' | 'movieFileDeleted' | 'movieFileRenamed' | 'unknown';
  date: string;
  quality: string;
  indexer?: string;
  downloadClient?: string;
  reason?: string;
  sourceTitle?: string;
}

export interface LibraryInfo {
  inLibrary: boolean;
  radarrId?: number;
  status: LibraryStatus;
  monitored: boolean;
  qualityProfileId?: number;
  quality?: string;
  size?: string;
  hasFile: boolean;
  path?: string;
  file?: MovieFile;
}
