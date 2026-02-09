import { getTMDBImageUrl, type TMDBTV } from '@/api/clients/tmdb';
import type { ShowDetail } from '@/api/entities';

export function tmdbToShowDetail(show: TMDBTV): ShowDetail {
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
