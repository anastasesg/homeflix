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
  const runTimes = show.episode_run_time ?? [];
  const runtime = runTimes.length > 0 ? runTimes[0] : undefined;

  return {
    id: show.id,
    name: show.name ?? '',
    originalName: show.original_name ?? '',
    overview: show.overview ?? '',
    tagline: show.tagline || undefined,
    firstAirDate: show.first_air_date ?? '',
    lastAirDate: show.last_air_date || undefined,
    year: firstYear,
    endYear: show.status === 'Ended' || show.status === 'Canceled' ? lastYear : undefined,
    numberOfSeasons: show.number_of_seasons ?? 0,
    numberOfEpisodes: show.number_of_episodes ?? 0,
    runtime,
    rating: show.vote_average ?? 0,
    voteCount: show.vote_count ?? 0,
    posterUrl: getTMDBImageUrl(show.poster_path, 'original'),
    backdropUrl: getTMDBImageUrl(show.backdrop_path, 'original'),
    genres: (show.genres ?? []).map((g) => g.name ?? ''),
    networks: (show.networks ?? []).map((n) => ({
      name: n.name ?? '',
      logoUrl: getTMDBImageUrl(n.logo_path, 'w185'),
    })),
    productionCompanies: (show.production_companies ?? []).map((c) => ({
      name: c.name ?? '',
      logoUrl: getTMDBImageUrl(c.logo_path, 'w185'),
    })),
    createdBy: (show.created_by ?? []).map((c) => ({
      name: c.name ?? '',
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
    })),
    languages: (show.spoken_languages ?? []).map((l) => l.english_name ?? ''),
    status: show.status ?? '',
    type: show.type ?? '',
    inProduction: show.in_production ?? false,
    // external_ids comes from append_to_response — not in the base OpenAPI type
    imdbId:
      (show as unknown as { external_ids?: { imdb_id?: string | null; tvdb_id?: number | null } }).external_ids
        ?.imdb_id ?? undefined,
    tvdbId:
      (show as unknown as { external_ids?: { imdb_id?: string | null; tvdb_id?: number | null } }).external_ids
        ?.tvdb_id ?? undefined,
    tmdbId: show.id,
    homepage: show.homepage || undefined,
    seasons: (show.seasons ?? [])
      .filter((s) => (s.season_number ?? 0) > 0)
      .map((s) => ({
        id: s.id ?? 0,
        name: s.name ?? '',
        overview: s.overview ?? '',
        seasonNumber: s.season_number ?? 0,
        episodeCount: s.episode_count ?? 0,
        airDate: s.air_date ?? undefined,
        posterUrl: getTMDBImageUrl(s.poster_path, 'w342'),
      })),
  };
}

function mapEpisode(ep: NonNullable<TMDBTVSeason['episodes']>[number]): EpisodeBasic {
  return {
    id: ep.id ?? 0,
    name: ep.name ?? '',
    overview: ep.overview ?? '',
    episodeNumber: ep.episode_number ?? 0,
    seasonNumber: ep.season_number ?? 0,
    airDate: ep.air_date ?? undefined,
    runtime: ep.runtime ?? undefined,
    stillUrl: getTMDBImageUrl(ep.still_path, 'original'),
    rating: ep.vote_average ?? 0,
    voteCount: ep.vote_count ?? 0,
    crew: (ep.crew ?? []).map((c) => ({
      name: c.name ?? '',
      job: c.job ?? '',
      department: c.department ?? '',
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
    })),
    guestStars: (ep.guest_stars ?? []).map((g) => ({
      name: g.name ?? '',
      character: g.character ?? '',
      profileUrl: getTMDBImageUrl(g.profile_path, 'w185'),
      order: g.order ?? 0,
    })),
  };
}

function mapToSeasonDetail(season: TMDBTVSeason): SeasonDetail {
  return {
    id: season.id ?? 0,
    name: season.name ?? '',
    overview: season.overview ?? '',
    seasonNumber: season.season_number ?? 0,
    airDate: season.air_date ?? undefined,
    posterUrl: getTMDBImageUrl(season.poster_path, 'w342'),
    episodes: (season.episodes ?? []).map(mapEpisode),
  };
}

// ============================================================================
// Functions
// ============================================================================

export async function fetchShowDetail(tmdbId: number): Promise<ShowBasic> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}', {
    params: { path: { series_id: tmdbId }, query: { append_to_response: 'external_ids' } },
  });
  if (error || !data) throw new Error('Failed to fetch show from TMDB');
  return mapToShowBasic(data);
}

export async function fetchShowCredits(tmdbId: number): Promise<ShowCredits> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/aggregate_credits', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show credits from TMDB');
  return {
    cast: (data.cast ?? []).slice(0, 20).map((c) => ({
      name: c.name ?? '',
      character: (c.roles ?? [])[0]?.character ?? '',
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
      order: c.order ?? 0,
    })),
    crew: (data.crew ?? []).map((c) => ({
      name: c.name ?? '',
      job: (c.jobs ?? [])[0]?.job ?? '',
      department: c.department ?? '',
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
    })),
  };
}

export async function fetchShowImages(tmdbId: number): Promise<ShowImages> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/images', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show images from TMDB');
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

export async function fetchShowVideos(tmdbId: number): Promise<ShowVideos> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/videos', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show videos from TMDB');

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

export async function fetchShowKeywords(tmdbId: number): Promise<ShowKeywords> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/keywords', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show keywords from TMDB');
  return {
    keywords: (data.results ?? []).map((k) => k.name ?? ''),
  };
}

export async function fetchShowSeason(tmdbId: number, seasonNumber: number): Promise<SeasonDetail> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/season/{season_number}', {
    params: { path: { series_id: tmdbId, season_number: seasonNumber } },
  });
  if (error || !data) throw new Error('Failed to fetch show season from TMDB');
  return mapToSeasonDetail(data);
}

export async function fetchShowEpisode(
  tmdbId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<EpisodeBasic> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/season/{season_number}/episode/{episode_number}', {
    params: { path: { series_id: tmdbId, season_number: seasonNumber, episode_number: episodeNumber } },
  });
  if (error || !data) throw new Error('Failed to fetch show episode from TMDB');
  return mapEpisode(data as NonNullable<TMDBTVSeason['episodes']>[number]);
}

export async function fetchShowEpisodeImages(
  tmdbId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<EpisodeImages> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/season/{season_number}/episode/{episode_number}/images', {
    params: { path: { series_id: tmdbId, season_number: seasonNumber, episode_number: episodeNumber } },
  });
  if (error || !data) throw new Error('Failed to fetch episode images from TMDB');
  return {
    stills: (data.stills ?? []).slice(0, 12).map((s) => `https://image.tmdb.org/t/p/w780${s.file_path}`),
  };
}

export async function fetchShowRecommendations(tmdbId: number): Promise<ShowRecommendation[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/recommendations', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show recommendations from TMDB');
  return (data.results ?? []).slice(0, 20).map((item) => ({
    id: item.id,
    name: item.name ?? '',
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    rating: item.vote_average,
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4), 10) : 0,
    overview: item.overview || undefined,
  }));
}

export async function fetchSimilarShows(tmdbId: number): Promise<ShowRecommendation[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/similar', {
    params: { path: { series_id: String(tmdbId) } },
  });
  if (error || !data) throw new Error('Failed to fetch similar shows from TMDB');
  return (data.results ?? []).slice(0, 20).map((item) => ({
    id: item.id ?? 0,
    name: item.name ?? '',
    posterUrl: getTMDBImageUrl(item.poster_path, 'w342'),
    rating: item.vote_average ?? 0,
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4), 10) : 0,
    overview: item.overview || undefined,
  }));
}

export async function fetchShowContentRatings(tmdbId: number): Promise<ShowContentRating[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/tv/{series_id}/content_ratings', {
    params: { path: { series_id: tmdbId } },
  });
  if (error || !data) throw new Error('Failed to fetch show content ratings from TMDB');
  return (data.results ?? []).map((r) => ({
    country: r.iso_3166_1 ?? '',
    rating: r.rating ?? '',
  }));
}
