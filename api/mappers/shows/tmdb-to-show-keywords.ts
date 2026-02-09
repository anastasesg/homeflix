import type { TMDBTVKeywords } from '@/api/clients/tmdb';
import type { MediaKeywords } from '@/api/entities';

export function tmdbToShowKeywords(data: TMDBTVKeywords): MediaKeywords {
  return {
    keywords: (data.results ?? []).map((k) => k.name ?? ''),
  };
}
