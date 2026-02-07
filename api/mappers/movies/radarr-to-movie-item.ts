import { MovieResource } from '@/api/clients/radarr';
import { MovieItem } from '@/api/entities';
import { MediaStatus } from '@/api/types';

import { mapGenreNames } from '../genres';

function deriveMediaStatus(movie: MovieResource): MediaStatus {
  if (movie.hasFile) return 'downloaded';
  if (movie.monitored && movie.isAvailable) return 'wanted';
  if (movie.monitored) return 'missing';
  return 'missing';
}

export function radarrToMovieItem(movie: MovieResource): MovieItem {
  const posterImage = movie.images?.find((img) => img.coverType === 'poster');
  const backdropImage = movie.images?.find((img) => img.coverType === 'fanart');

  return {
    tmdbId: movie.tmdbId ?? 0,
    title: movie.title ?? 'Unknown',
    overview: movie.overview ?? '',
    year: movie.year ?? 0,
    rating: movie.ratings?.tmdb?.value ?? movie.ratings?.imdb?.value ?? 0,
    voteCount: movie.ratings?.tmdb?.votes ?? 0,
    popularity: 0,
    posterUrl: posterImage?.remoteUrl ?? undefined,
    backdropUrl: backdropImage?.remoteUrl ?? undefined,
    genres: mapGenreNames(movie.genres ?? [], 'movie'),
    status: deriveMediaStatus(movie),
    dateAdded: movie.added ?? undefined,
  };
}
