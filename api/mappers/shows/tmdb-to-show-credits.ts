import { getTMDBImageUrl, type TMDBTVAggregateCredits } from '@/api/clients/tmdb';
import type { MediaCredits } from '@/api/entities';

export function tmdbToShowCredits(data: TMDBTVAggregateCredits): MediaCredits {
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
