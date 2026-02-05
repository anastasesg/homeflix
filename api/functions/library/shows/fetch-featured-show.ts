import { createSonarrClient } from '@/api/clients/sonarr';
import { ShowItem } from '@/api/entities';
import { mapToShowItem, sortShows } from '@/api/utils';

export async function fetchFeaturedShow(): Promise<ShowItem | undefined> {
  const client = createSonarrClient();
  const { data, error } = await client.GET('/api/v3/series', {});

  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Unknown error';
    throw new Error(`Failed to fetch shows from Sonarr: ${errorMessage}`);
  }

  // Find continuing shows with a backdrop, sorted by rating
  return (data ?? [])
    .map(mapToShowItem)
    .filter((s) => s.showStatus === 'continuing' && s.backdropUrl)
    .sort(sortShows('rating', 'desc'))
    .at(0);
}
