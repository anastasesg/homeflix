import { getTMDBImageUrl, type TMDBTVSeason } from '@/api/clients/tmdb';
import type { EpisodeBasic, SeasonDetail } from '@/api/entities';

export function tmdbToEpisode(ep: NonNullable<TMDBTVSeason['episodes']>[number]): EpisodeBasic {
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

export function tmdbToSeasonDetail(season: TMDBTVSeason): SeasonDetail {
  return {
    id: season.id ?? 0,
    name: season.name ?? '',
    overview: season.overview ?? '',
    seasonNumber: season.season_number ?? 0,
    airDate: season.air_date ?? undefined,
    posterUrl: getTMDBImageUrl(season.poster_path, 'w342'),
    episodes: (season.episodes ?? []).map(tmdbToEpisode),
  };
}
