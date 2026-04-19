import type { MediaCredits } from './media-credits';

export interface EpisodeCredits {
  cast: MediaCredits['cast'];
  crew: MediaCredits['crew'];
  guestStars: Array<{ id: number; name: string; character: string; profileUrl?: string; order: number }>;
}
