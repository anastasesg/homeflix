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
    posterUrl: getTMDBImageUrl(movie.poster_path, 'original'),
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
// Functions
// ============================================================================

export async function fetchMovieDetail(tmdbId: number): Promise<MovieBasic> {
  const client = createTMDBClient();
  const movie = await client.getMovie(tmdbId);
  return mapToMovieBasic(movie);
}

export async function fetchMovieCredits(tmdbId: number): Promise<MovieCredits> {
  const client = createTMDBClient();
  const credits = await client.getCredits(tmdbId);
  return {
    cast: credits.cast.slice(0, 20).map((c) => ({
      name: c.name,
      character: c.character,
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
      order: c.order,
    })),
    crew: credits.crew.map((c) => ({
      name: c.name,
      job: c.job,
      department: c.department,
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
    })),
  };
}

export async function fetchMovieImages(tmdbId: number): Promise<MovieImages> {
  const client = createTMDBClient();
  const images = await client.getImages(tmdbId);
  return {
    backdrops: images.backdrops
      .slice(0, 15)
      .map((b) => getTMDBImageUrl(b.file_path, 'original')!)
      .filter(Boolean),
    posters: images.posters
      .slice(0, 5)
      .map((p) => getTMDBImageUrl(p.file_path, 'original')!)
      .filter(Boolean),
  };
}

export async function fetchMovieVideos(tmdbId: number): Promise<MovieVideos> {
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
}

export async function fetchMovieKeywords(tmdbId: number): Promise<MovieKeywords> {
  const client = createTMDBClient();
  const keywords = await client.getKeywords(tmdbId);
  return {
    keywords: keywords.keywords.map((k) => k.name),
  };
}
