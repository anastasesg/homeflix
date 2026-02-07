import { createTMDBClient, getTMDBImageUrl } from '@/api/clients/tmdb';
import type { CertificationItem, TMDBGenreItem, WatchProviderItem } from '@/api/entities';

// ============================================================================
// Functions
// ============================================================================

export async function fetchMovieGenres(): Promise<TMDBGenreItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/genre/movie/list');
  if (error || !data) throw new Error('Failed to fetch movie genres from TMDB');
  return (data.genres ?? []).map((g) => ({ id: g.id ?? 0, name: g.name ?? '' }));
}

export async function fetchMovieWatchProviders(region: string = 'US'): Promise<WatchProviderItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/watch/providers/movie', {
    params: { query: { watch_region: region } },
  });
  if (error || !data) throw new Error('Failed to fetch movie watch providers from TMDB');
  return (data.results ?? [])
    .sort((a, b) => (a.display_priority ?? 0) - (b.display_priority ?? 0))
    .slice(0, 30)
    .map((p) => ({
      id: p.provider_id ?? 0,
      name: p.provider_name ?? '',
      logoUrl: getTMDBImageUrl(p.logo_path, 'w92'),
    }));
}

export async function fetchMovieCertifications(country: string = 'US'): Promise<CertificationItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/certification/movie/list');
  if (error || !data) throw new Error('Failed to fetch movie certifications from TMDB');
  const certs =
    (data.certifications as Record<string, Array<{ certification?: string; meaning?: string; order?: number }>>)?.[
      country
    ] ?? [];
  return certs
    .filter((c) => c.certification !== '')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => ({
      certification: c.certification ?? '',
      meaning: c.meaning ?? '',
      order: c.order ?? 0,
    }));
}
