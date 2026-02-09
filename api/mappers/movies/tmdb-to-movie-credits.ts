import { getTMDBImageUrl, type TMDBCredits } from '@/api/clients/tmdb';
import type { MediaCredits } from '@/api/entities/shared/media-credits';

export function tmdbToMovieCredits(data: TMDBCredits): MediaCredits {
  return {
    cast: (data.cast ?? []).slice(0, 20).map((c) => ({
      name: c.name ?? '',
      character: c.character ?? '',
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
      order: c.order ?? 0,
    })),
    crew: (data.crew ?? []).map((c) => ({
      name: c.name ?? '',
      job: c.job ?? '',
      department: c.department ?? '',
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
    })),
  };
}
