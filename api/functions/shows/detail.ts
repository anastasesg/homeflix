import { createTMDBClient, getTMDBImageUrl, type TMDBTV, type TMDBTVSeason } from '@/api/clients/tmdb';
import type {
  EpisodeBasic,
  EpisodeImages,
  SeasonDetail,
  ShowBasic,
  ShowContentRating,
  ShowCredits,
  ShowImages,
  ShowKeywords,
  ShowRecommendation,
  ShowVideos,
} from '@/api/entities';

// ============================================================================
// Mappers
// ============================================================================

function mapToShowBasic(show: TMDBTV): ShowBasic {
  const firstYear = show.first_air_date ? parseInt(show.first_air_date.substring(0, 4), 10) : 0;
  const lastYear = show.last_air_date ? parseInt(show.last_air_date.substring(0, 4), 10) : undefined;
  const runtime = show.episode_run_time.length > 0 ? show.episode_run_time[0] : undefined;

  return {
    id: show.id,
    name: show.name,
    originalName: show.original_name,
    overview: show.overview,
    tagline: show.tagline || undefined,
    firstAirDate: show.first_air_date,
    lastAirDate: show.last_air_date || undefined,
    year: firstYear,
    endYear: show.status === 'Ended' || show.status === 'Canceled' ? lastYear : undefined,
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
    runtime,
    rating: show.vote_average,
    voteCount: show.vote_count,
    posterUrl: getTMDBImageUrl(show.poster_path, 'original'),
    backdropUrl: getTMDBImageUrl(show.backdrop_path, 'original'),
    genres: show.genres.map((g) => g.name),
    networks: show.networks.map((n) => ({
      name: n.name,
      logoUrl: getTMDBImageUrl(n.logo_path, 'w185'),
    })),
    productionCompanies: show.production_companies.map((c) => ({
      name: c.name,
      logoUrl: getTMDBImageUrl(c.logo_path, 'w185'),
    })),
    createdBy: show.created_by.map((c) => ({
      name: c.name,
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
    })),
    languages: show.spoken_languages.map((l) => l.english_name),
    status: show.status,
    type: show.type,
    inProduction: show.in_production,
    imdbId: show.external_ids?.imdb_id ?? undefined,
    tvdbId: show.external_ids?.tvdb_id ?? undefined,
    tmdbId: show.id,
    homepage: show.homepage || undefined,
    seasons: show.seasons
      .filter((s) => s.season_number > 0)
      .map((s) => ({
        id: s.id,
        name: s.name,
        overview: s.overview,
        seasonNumber: s.season_number,
        episodeCount: s.episode_count,
        airDate: s.air_date ?? undefined,
        posterUrl: getTMDBImageUrl(s.poster_path, 'w342'),
      })),
  };
}

function mapEpisode(ep: TMDBTVSeason['episodes'][number]): EpisodeBasic {
  return {
    id: ep.id,
    name: ep.name,
    overview: ep.overview,
    episodeNumber: ep.episode_number,
    seasonNumber: ep.season_number,
    airDate: ep.air_date ?? undefined,
    runtime: ep.runtime ?? undefined,
    stillUrl: getTMDBImageUrl(ep.still_path, 'original'),
    rating: ep.vote_average,
    voteCount: ep.vote_count,
    crew: ep.crew.map((c) => ({
      name: c.name,
      job: c.job,
      department: c.department,
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
    })),
    guestStars: ep.guest_stars.map((g) => ({
      name: g.name,
      character: g.character,
      profileUrl: getTMDBImageUrl(g.profile_path, 'w185'),
      order: g.order,
    })),
  };
}

function mapToSeasonDetail(season: TMDBTVSeason): SeasonDetail {
  return {
    id: season.id,
    name: season.name,
    overview: season.overview,
    seasonNumber: season.season_number,
    airDate: season.air_date ?? undefined,
    posterUrl: getTMDBImageUrl(season.poster_path, 'w342'),
    episodes: season.episodes.map(mapEpisode),
  };
}

// ============================================================================
// Functions
// ============================================================================

export async function fetchShowDetail(tmdbId: number): Promise<ShowBasic> {
  const client = createTMDBClient();
  const show = await client.getTVShow(tmdbId);
  return mapToShowBasic(show);
}

export async function fetchShowCredits(tmdbId: number): Promise<ShowCredits> {
  const client = createTMDBClient();
  const credits = await client.getTVCredits(tmdbId);
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

export async function fetchShowImages(tmdbId: number): Promise<ShowImages> {
  const client = createTMDBClient();
  const images = await client.getTVImages(tmdbId);
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

export async function fetchShowVideos(tmdbId: number): Promise<ShowVideos> {
  const client = createTMDBClient();
  const videos = await client.getTVVideos(tmdbId);

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

export async function fetchShowKeywords(tmdbId: number): Promise<ShowKeywords> {
  const client = createTMDBClient();
  const keywords = await client.getTVKeywords(tmdbId);
  return {
    keywords: keywords.results.map((k) => k.name),
  };
}

export async function fetchShowSeason(tmdbId: number, seasonNumber: number): Promise<SeasonDetail> {
  const client = createTMDBClient();
  const season = await client.getTVSeason(tmdbId, seasonNumber);
  return mapToSeasonDetail(season);
}

export async function fetchShowEpisode(
  tmdbId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<EpisodeBasic> {
  const client = createTMDBClient();
  const episode = await client.getTVEpisode(tmdbId, seasonNumber, episodeNumber);
  return mapEpisode(episode as TMDBTVSeason['episodes'][number]);
}

export async function fetchShowEpisodeImages(
  tmdbId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<EpisodeImages> {
  const client = createTMDBClient();
  const data = await client.getTVEpisodeImages(tmdbId, seasonNumber, episodeNumber);
  return {
    stills: data.stills.slice(0, 12).map((s) => `https://image.tmdb.org/t/p/w780${s.file_path}`),
  };
}

export async function fetchShowRecommendations(tmdbId: number): Promise<ShowRecommendation[]> {
  const client = createTMDBClient();
  const data = await client.getTVRecommendations(tmdbId);
  return data.results.slice(0, 20).map((item) => ({
    id: item.id,
    name: item.name,
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    rating: item.vote_average,
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4), 10) : 0,
    overview: item.overview || undefined,
  }));
}

export async function fetchSimilarShows(tmdbId: number): Promise<ShowRecommendation[]> {
  const client = createTMDBClient();
  const data = await client.getTVSimilar(tmdbId);
  return data.results.slice(0, 20).map((item) => ({
    id: item.id,
    name: item.name,
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    rating: item.vote_average,
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4), 10) : 0,
    overview: item.overview || undefined,
  }));
}

export async function fetchShowContentRatings(tmdbId: number): Promise<ShowContentRating[]> {
  const client = createTMDBClient();
  const data = await client.getTVContentRatings(tmdbId);
  return data.results.map((r) => ({
    country: r.iso_3166_1,
    rating: r.rating,
  }));
}
