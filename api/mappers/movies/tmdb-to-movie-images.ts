import { getTMDBImageUrl, type TMDBImages } from '@/api/clients/tmdb';
import type { MediaImages } from '@/api/entities/shared/media-images';

export function tmdbToMovieImages(data: TMDBImages): MediaImages {
  return {
    backdrops: (data.backdrops ?? [])
      .slice(0, 15)
      .map((b) => getTMDBImageUrl(b.file_path, 'original')!)
      .filter(Boolean),
    posters: (data.posters ?? [])
      .slice(0, 5)
      .map((p) => getTMDBImageUrl(p.file_path, 'original')!)
      .filter(Boolean),
  };
}
