import { getTMDBImageUrl, type TMDBTVSeasonAggregateCredits } from '@/api/clients/tmdb';
import type { MediaCredits } from '@/api/entities';

export function tmdbToShowSeasonCredits(data: TMDBTVSeasonAggregateCredits): MediaCredits {
  return {
    cast: (data.cast ?? [])
      .slice()
      .sort((a, b) => (b.total_episode_count ?? 0) - (a.total_episode_count ?? 0) || (a.order ?? 0) - (b.order ?? 0))
      .slice(0, 20)
      .map((c) => ({
        id: c.id ?? 0,
        name: c.name ?? '',
        character: (c.roles ?? [])[0]?.character ?? '',
        profileUrl: getTMDBImageUrl(c.profile_path, 'w185'),
        order: c.order ?? 0,
      })),
    crew: (data.crew ?? []).map((c) => ({
      id: c.id ?? 0,
      name: c.name ?? '',
      job: (c.jobs ?? [])[0]?.job ?? '',
      department: c.department ?? '',
      profileUrl: getTMDBImageUrl(typeof c.profile_path === 'string' ? c.profile_path : undefined, 'w185'),
    })),
  };
}
