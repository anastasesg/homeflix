export interface MovieFile {
  mediaType: 'movie';
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

export interface EpisodeFile {
  mediaType: 'show';
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

export type MediaFile = MovieFile | EpisodeFile;
