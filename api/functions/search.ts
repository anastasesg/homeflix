import { createTMDBClient, getTMDBImageUrl } from '@/api/clients/tmdb';
import type { KeywordItem, PersonItem } from '@/api/entities';

// ============================================================================
// Functions
// ============================================================================

export async function searchKeywords(query: string): Promise<KeywordItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/search/keyword', {
    params: { query: { query } },
  });
  if (error || !data) throw new Error('Failed to search keywords from TMDB');
  return (data.results ?? []).slice(0, 20).map((k) => ({
    id: k.id ?? 0,
    name: k.name ?? '',
  }));
}

export async function searchPeople(query: string): Promise<PersonItem[]> {
  const client = createTMDBClient();
  const { data, error } = await client.GET('/3/search/person', {
    params: { query: { query } },
  });
  if (error || !data) throw new Error('Failed to search people from TMDB');
  return (data.results ?? [])
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 20)
    .map((p) => ({
      id: p.id ?? 0,
      name: p.name ?? '',
      department: p.known_for_department ?? '',
      profileUrl: getTMDBImageUrl(p.profile_path, 'w92'),
    }));
}
