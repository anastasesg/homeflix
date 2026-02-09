import type { TMDBVideos } from '@/api/clients/tmdb';
import type { MediaVideos } from '@/api/entities/shared/media-videos';

export function tmdbToMovieVideos(data: TMDBVideos): MediaVideos {
  const youtubeVideos = (data.results ?? [])
    .filter((v) => v.site === 'YouTube')
    .map((v) => ({
      id: v.id ?? '',
      name: v.name ?? '',
      type: v.type ?? '',
      url: `https://www.youtube.com/watch?v=${v.key}`,
    }));

  const trailer = youtubeVideos.find((v) => v.type === 'Trailer' || v.type === 'Teaser');

  return {
    trailerUrl: trailer?.url,
    videos: youtubeVideos,
  };
}
