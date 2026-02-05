import { createRadarrClient } from '@/api/clients/radarr';
import { MovieItem } from '@/api/entities';
import { filterByStatus, mapToMovieItem, sortMovies } from '@/api/utils';

export async function fetchFeaturedMovie(): Promise<MovieItem | undefined> {
  const client = createRadarrClient();
  const { data, error } = await client.GET('/api/v3/movie');

  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Unknown error';
    throw new Error(`Failed to fetch movies from Radarr: ${errorMessage}`);
  }

  return data.map(mapToMovieItem).filter(filterByStatus('downloaded')).sort(sortMovies('rating', 'desc')).at(0);
}
