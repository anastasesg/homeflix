import { createTMDBClient, getTMDBImageUrl } from '@/api/clients/tmdb';
import type { NetworkItem, TMDBGenreItem, WatchProviderItem } from '@/api/entities';

// ============================================================================
// Functions
// ============================================================================

export async function fetchShowGenres(): Promise<TMDBGenreItem[]> {
  const client = createTMDBClient();
  const res = await client.getTVGenres();
  return res.genres;
}

export async function fetchShowWatchProviders(region: string = 'US'): Promise<WatchProviderItem[]> {
  const client = createTMDBClient();
  const res = await client.getTVWatchProviders(region);
  return res.results
    .sort((a, b) => a.display_priority - b.display_priority)
    .slice(0, 30)
    .map((p) => ({
      id: p.provider_id,
      name: p.provider_name,
      logoUrl: getTMDBImageUrl(p.logo_path, 'w92'),
    }));
}

export async function fetchShowNetworks(): Promise<NetworkItem[]> {
  // TMDB doesn't have a dedicated "list all networks" endpoint.
  // We use a curated list of major networks instead.
  const majorNetworks = [
    { id: 213, name: 'Netflix' },
    { id: 1024, name: 'Amazon' },
    { id: 2552, name: 'Apple TV+' },
    { id: 49, name: 'HBO' },
    { id: 2739, name: 'Disney+' },
    { id: 453, name: 'Hulu' },
    { id: 67, name: 'Showtime' },
    { id: 2697, name: 'Paramount+' },
    { id: 3353, name: 'Peacock' },
    { id: 174, name: 'AMC' },
    { id: 16, name: 'CBS' },
    { id: 6, name: 'NBC' },
    { id: 19, name: 'FOX' },
    { id: 318, name: 'Starz' },
    { id: 2, name: 'ABC' },
    { id: 71, name: 'The CW' },
    { id: 56, name: 'Cartoon Network' },
    { id: 13, name: 'Nickelodeon' },
    { id: 64, name: 'Discovery' },
    { id: 43, name: 'National Geographic' },
    { id: 4, name: 'BBC One' },
    { id: 332, name: 'BBC Two' },
    { id: 26, name: 'Channel 4' },
    { id: 493, name: 'BBC America' },
    { id: 1, name: 'Fuji TV' },
    { id: 614, name: 'Crunchyroll' },
  ];
  return majorNetworks.map((n) => ({ id: n.id, name: n.name }));
}
