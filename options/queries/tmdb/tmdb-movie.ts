import { queryOptions } from '@tanstack/react-query';

import { createTMDBClient, getTMDBImageUrl, type TMDBMovie } from '@/api/clients/tmdb';
import type { MovieBasic, MovieCredits, MovieImages, MovieKeywords, MovieVideos } from '@/api/entities';

// ============================================================================
// Mappers
// ============================================================================

function mapToMovieBasic(movie: TMDBMovie): MovieBasic {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    tagline: movie.tagline || undefined,
    releaseDate: movie.release_date,
    year: movie.release_date ? parseInt(movie.release_date.substring(0, 4), 10) : 0,
    runtime: movie.runtime,
    budget: movie.budget || undefined,
    revenue: movie.revenue || undefined,
    rating: movie.vote_average,
    voteCount: movie.vote_count,
    posterUrl: getTMDBImageUrl(movie.poster_path, 'w500'),
    backdropUrl: getTMDBImageUrl(movie.backdrop_path, 'original'),
    genres: movie.genres.map((g) => g.name),
    productionCompanies: movie.production_companies.map((c) => ({
      name: c.name,
      logoUrl: getTMDBImageUrl(c.logo_path, 'w185'),
    })),
    languages: movie.spoken_languages.map((l) => l.english_name),
    status: movie.status,
    imdbId: movie.imdb_id || undefined,
    tmdbId: movie.id,
    homepage: movie.homepage || undefined,
  };
}

// ============================================================================
// Query Options
// ============================================================================

/**
 * Fetches basic movie data from TMDB (hero section data)
 */
export function tmdbMovieQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'movie', tmdbId] as const,
    queryFn: async (): Promise<MovieBasic> => {
      const client = createTMDBClient();
      const movie = await client.getMovie(tmdbId);
      return mapToMovieBasic(movie);
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetches movie credits (cast and crew)
 */
export function tmdbCreditsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'movie', tmdbId, 'credits'] as const,
    queryFn: async (): Promise<MovieCredits> => {
      const client = createTMDBClient();
      const credits = await client.getCredits(tmdbId);
      return {
        cast: credits.cast.slice(0, 20).map((c) => ({
          name: c.name,
          character: c.character,
          profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
          order: c.order,
        })),
        // Show all crew, no filter
        crew: credits.crew.map((c) => ({
          name: c.name,
          job: c.job,
          department: c.department,
          profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
        })),
      };
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetches movie images (backdrops and posters)
 */
export function tmdbImagesQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'movie', tmdbId, 'images'] as const,
    queryFn: async (): Promise<MovieImages> => {
      const client = createTMDBClient();
      const images = await client.getImages(tmdbId);
      return {
        backdrops: images.backdrops
          .slice(0, 15)
          .map((b) => getTMDBImageUrl(b.file_path, 'original')!)
          .filter(Boolean),
        posters: images.posters
          .slice(0, 5)
          .map((p) => getTMDBImageUrl(p.file_path, 'w500')!)
          .filter(Boolean),
      };
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetches movie videos (trailers)
 */
export function tmdbVideosQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'movie', tmdbId, 'videos'] as const,
    queryFn: async (): Promise<MovieVideos> => {
      const client = createTMDBClient();
      const videos = await client.getVideos(tmdbId);

      const youtubeVideos = videos.results
        .filter((v) => v.site === 'YouTube')
        .map((v) => ({
          id: v.id,
          name: v.name,
          type: v.type,
          url: `https://www.youtube.com/watch?v=${v.key}`,
        }));

      const trailer = youtubeVideos.find((v) => v.type === 'Trailer' || v.type === 'Teaser');

      return {
        trailerUrl: trailer?.url,
        videos: youtubeVideos,
      };
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetches movie keywords
 */
export function tmdbKeywordsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'movie', tmdbId, 'keywords'] as const,
    queryFn: async (): Promise<MovieKeywords> => {
      const client = createTMDBClient();
      const keywords = await client.getKeywords(tmdbId);
      return {
        keywords: keywords.keywords.map((k) => k.name),
      };
    },
    staleTime: 10 * 60 * 1000,
  });
}
