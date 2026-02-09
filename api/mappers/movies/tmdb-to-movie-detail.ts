import { getTMDBImageUrl, type TMDBMovie } from '@/api/clients/tmdb';
import type { MovieDetail } from '@/api/entities/movies/movie-detail';

// ============================================================================
// Types
// ============================================================================

interface TMDBCollection {
  id: number;
  name: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
}

// ============================================================================
// Mapper
// ============================================================================

export function tmdbToMovieDetail(movie: TMDBMovie): MovieDetail {
  const belongsToCollection = movie.belongs_to_collection as TMDBCollection | null | undefined;

  return {
    id: movie.id,
    title: movie.title ?? '',
    originalTitle: movie.original_title ?? '',
    overview: movie.overview ?? '',
    tagline: movie.tagline || undefined,
    releaseDate: movie.release_date ?? '',
    year: movie.release_date ? parseInt(movie.release_date.substring(0, 4), 10) : 0,
    runtime: movie.runtime,
    budget: movie.budget || undefined,
    revenue: movie.revenue || undefined,
    rating: movie.vote_average,
    voteCount: movie.vote_count,
    posterUrl: getTMDBImageUrl(movie.poster_path, 'original'),
    backdropUrl: getTMDBImageUrl(movie.backdrop_path, 'original'),
    genres: (movie.genres ?? []).map((g) => g.name ?? ''),
    productionCompanies: (movie.production_companies ?? []).map((c) => ({
      name: c.name ?? '',
      logoUrl: getTMDBImageUrl(c.logo_path, 'w185'),
    })),
    languages: (movie.spoken_languages ?? []).map((l) => l.english_name ?? ''),
    status: movie.status ?? '',
    imdbId: movie.imdb_id || undefined,
    tmdbId: movie.id,
    homepage: movie.homepage || undefined,
    collection: belongsToCollection
      ? {
          id: belongsToCollection.id,
          name: belongsToCollection.name,
          posterUrl: getTMDBImageUrl(belongsToCollection.poster_path, 'w342'),
          backdropUrl: getTMDBImageUrl(belongsToCollection.backdrop_path, 'w780'),
        }
      : undefined,
  };
}
