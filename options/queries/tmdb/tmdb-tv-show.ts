import { queryOptions } from '@tanstack/react-query';

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
// Query Options
// ============================================================================

/** Fetches basic TV show data from TMDB (hero section data) */
export function tmdbTVShowQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId] as const,
    queryFn: async (): Promise<ShowBasic> => {
      const client = createTMDBClient();
      const show = await client.getTVShow(tmdbId);
      return mapToShowBasic(show);
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetches TV show credits (cast and crew) */
export function tmdbTVCreditsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId, 'credits'] as const,
    queryFn: async (): Promise<ShowCredits> => {
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
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetches TV show images (backdrops and posters) */
export function tmdbTVImagesQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId, 'images'] as const,
    queryFn: async (): Promise<ShowImages> => {
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
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetches TV show videos (trailers) */
export function tmdbTVVideosQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId, 'videos'] as const,
    queryFn: async (): Promise<ShowVideos> => {
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
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetches TV show keywords */
export function tmdbTVKeywordsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId, 'keywords'] as const,
    queryFn: async (): Promise<ShowKeywords> => {
      const client = createTMDBClient();
      const keywords = await client.getTVKeywords(tmdbId);
      return {
        keywords: keywords.results.map((k) => k.name),
      };
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetches a specific season with all episodes */
export function tmdbTVSeasonQueryOptions(tmdbId: number, seasonNumber: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId, 'season', seasonNumber] as const,
    queryFn: async (): Promise<SeasonDetail> => {
      const client = createTMDBClient();
      const season = await client.getTVSeason(tmdbId, seasonNumber);
      return mapToSeasonDetail(season);
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetches a specific episode */
export function tmdbTVEpisodeQueryOptions(tmdbId: number, seasonNumber: number, episodeNumber: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId, 'season', seasonNumber, 'episode', episodeNumber] as const,
    queryFn: async (): Promise<EpisodeBasic> => {
      const client = createTMDBClient();
      const episode = await client.getTVEpisode(tmdbId, seasonNumber, episodeNumber);
      return mapEpisode(episode as TMDBTVSeason['episodes'][number]);
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetches TV show recommendations */
export function tmdbTVRecommendationsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId, 'recommendations'] as const,
    queryFn: async (): Promise<ShowRecommendation[]> => {
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
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetches similar TV shows */
export function tmdbTVSimilarQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId, 'similar'] as const,
    queryFn: async (): Promise<ShowRecommendation[]> => {
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
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetches TV show content ratings */
export function tmdbTVContentRatingsQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId, 'content_ratings'] as const,
    queryFn: async (): Promise<ShowContentRating[]> => {
      const client = createTMDBClient();
      const data = await client.getTVContentRatings(tmdbId);
      return data.results.map((r) => ({
        country: r.iso_3166_1,
        rating: r.rating,
      }));
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetches episode stills/images */
export function tmdbTVEpisodeImagesQueryOptions(tmdbId: number, seasonNumber: number, episodeNumber: number) {
  return queryOptions({
    queryKey: ['tmdb', 'tv', tmdbId, 'season', seasonNumber, 'episode', episodeNumber, 'images'] as const,
    queryFn: async (): Promise<EpisodeImages> => {
      const client = createTMDBClient();
      const data = await client.getTVEpisodeImages(tmdbId, seasonNumber, episodeNumber);
      return {
        stills: data.stills.slice(0, 12).map((s) => `https://image.tmdb.org/t/p/w780${s.file_path}`),
      };
    },
    staleTime: 10 * 60 * 1000,
  });
}
