export interface MovieHistoryEvent {
  mediaType: 'movie';
  id: number;
  type: 'grabbed' | 'downloadFolderImported' | 'downloadFailed' | 'movieFileDeleted' | 'movieFileRenamed' | 'unknown';
  date: string;
  quality: string;
  indexer?: string;
  downloadClient?: string;
  reason?: string;
  sourceTitle?: string;
}

export interface ShowHistoryEvent {
  mediaType: 'show';
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

export type HistoryEvent = MovieHistoryEvent | ShowHistoryEvent;
