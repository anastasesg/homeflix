import type { TMDBKeywords } from '@/api/clients/tmdb';
import type { MediaKeywords } from '@/api/entities/shared/media-keywords';

export function tmdbToMovieKeywords(data: TMDBKeywords): MediaKeywords {
  return {
    keywords: (data.keywords ?? []).map((k) => k.name ?? ''),
  };
}
