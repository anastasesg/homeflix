import { createTMDBClient, getTMDBImageUrl, type TMDBMovie } from '@/api/clients/tmdb';
import type {
  MovieBasic,
  MovieContentRating,
  MovieCredits,
  MovieImages,
  MovieKeywords,
  MovieRecommendation,
  MovieVideos,
} from '@/api/entities';

// ============================================================================
// Mappers
// ============================================================================

function mapToMovieBasic(movie: TMDBMovie): MovieBasic {
  return {
    id: movie.id,
    title: movie.original_title ?? '',
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
  };
}

// ============================================================================
// Functions
// ============================================================================

export async function fetchMovieDetail(tmdbId: number): Promise<MovieBasic> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie from TMDB');
  return mapToMovieBasic(data);
}

export async function fetchMovieCredits(tmdbId: number): Promise<MovieCredits> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/credits', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie credits from TMDB');
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

export async function fetchMovieImages(tmdbId: number): Promise<MovieImages> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/images', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie images from TMDB');
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

export async function fetchMovieVideos(tmdbId: number): Promise<MovieVideos> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/videos', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie videos from TMDB');

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

export async function fetchMovieKeywords(tmdbId: number): Promise<MovieKeywords> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/keywords', {
    params: { path: { movie_id: String(tmdbId) } },
  });
  if (error || !data) throw new Error('Failed to fetch movie keywords from TMDB');
  return {
    keywords: (data.keywords ?? []).map((k) => k.name ?? ''),
  };
}

export async function fetchMovieRecommendations(tmdbId: number): Promise<MovieRecommendation[]> {
  const client = createTMDBClient();
  // OpenAPI spec has empty response type for this endpoint — cast to expected shape
  const { data, error } = await client.GET('/3/movie/{movie_id}/recommendations', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie recommendations from TMDB');
  const results =
    (
      data as unknown as {
        results?: Array<{
          id?: number;
          title?: string;
          poster_path?: string;
          vote_average?: number;
          release_date?: string;
          overview?: string;
        }>;
      }
    ).results ?? [];
  return results.slice(0, 20).map((item) => ({
    id: item.id ?? 0,
    title: item.title ?? '',
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    rating: item.vote_average ?? 0,
    year: item.release_date ? parseInt(item.release_date.substring(0, 4), 10) : 0,
    overview: item.overview || undefined,
  }));
}

export async function fetchSimilarMovies(tmdbId: number): Promise<MovieRecommendation[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/similar', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch similar movies from TMDB');
  return (data.results ?? []).slice(0, 20).map((item) => ({
    id: item.id ?? 0,
    title: item.title ?? '',
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    rating: item.vote_average ?? 0,
    year: item.release_date ? parseInt(item.release_date.substring(0, 4), 10) : 0,
    overview: item.overview || undefined,
  }));
}

export async function fetchMovieContentRating(tmdbId: number): Promise<MovieContentRating[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/movie/{movie_id}/release_dates', {
    params: { path: { movie_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch movie release dates from TMDB');
  return (data.results ?? [])
    .flatMap((entry) =>
      (entry.release_dates ?? [])
        .filter((rd) => rd.certification !== '')
        .map((rd) => ({
          country: entry.iso_3166_1 ?? '',
          rating: rd.certification ?? '',
        }))
    )
    .filter((v, i, arr) => arr.findIndex((x) => x.country === v.country && x.rating === v.rating) === i);
}
