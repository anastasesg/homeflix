import { createTMDBClient, getTMDBImageUrl } from '@/api/clients/tmdb';
import type { CertificationItem, TMDBGenreItem, WatchProviderItem } from '@/api/entities';

// ============================================================================
// Functions
// ============================================================================

export async function fetchMovieGenres(): Promise<TMDBGenreItem[]> {
  const client = createTMDBClient();
  const res = await client.getGenres();
  return res.genres;
}

export async function fetchMovieWatchProviders(region: string = 'US'): Promise<WatchProviderItem[]> {
  const client = createTMDBClient();
  const res = await client.getWatchProviders(region);
  return res.results
    .sort((a, b) => a.display_priority - b.display_priority)
    .slice(0, 30)
    .map((p) => ({
      id: p.provider_id,
      name: p.provider_name,
      logoUrl: getTMDBImageUrl(p.logo_path, 'w92'),
    }));
}

export async function fetchMovieCertifications(country: string = 'US'): Promise<CertificationItem[]> {
  const client = createTMDBClient();
  const res = await client.getCertifications();
  const certs = res.certifications[country] ?? [];
  return certs
    .filter((c) => c.certification !== '')
    .sort((a, b) => a.order - b.order)
    .map((c) => ({
      certification: c.certification,
      meaning: c.meaning,
      order: c.order,
    }));
}
