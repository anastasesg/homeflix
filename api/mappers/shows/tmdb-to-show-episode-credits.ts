import { getTMDBImageUrl, type TMDBTVEpisodeCredits } from '@/api/clients/tmdb';
import type { EpisodeCredits } from '@/api/entities';

export function tmdbToShowEpisodeCredits(data: TMDBTVEpisodeCredits): EpisodeCredits {
  return {
    cast: (data.cast ?? [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((c) => ({
        id: c.id ?? 0,
        name: c.name ?? '',
        character: c.character ?? '',
        profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
        order: c.order ?? 0,
      })),
    crew: (data.crew ?? []).map((c) => ({
      id: c.id ?? 0,
      name: c.name ?? '',
      job: c.job ?? '',
      department: c.department ?? '',
      profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
    })),
    guestStars: (data.guest_stars ?? [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((g) => ({
        id: g.id ?? 0,
        name: g.name ?? '',
        character: g.character ?? '',
        profileUrl: getTMDBImageUrl(g.profile_path, 'w185'),
        order: g.order ?? 0,
      })),
  };
}
