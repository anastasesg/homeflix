import { createTMDBClient, getTMDBImageUrl } from '@/api/clients/tmdb';
import type { KeywordItem, PersonItem } from '@/api/entities';

// ============================================================================
// Functions
// ============================================================================

export async function searchKeywords(query: string): Promise<KeywordItem[]> {
  const client = createTMDBClient();
  const res = await client.searchKeywords(query);
  return res.results.slice(0, 20).map((k) => ({
    id: k.id,
    name: k.name,
  }));
}

export async function searchPeople(query: string): Promise<PersonItem[]> {
  const client = createTMDBClient();
  const res = await client.searchPeople(query);
  return res.results
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20)
    .map((p) => ({
      id: p.id,
      name: p.name,
      department: p.known_for_department,
      profileUrl: getTMDBImageUrl(p.profile_path, 'w92'),
    }));
}
