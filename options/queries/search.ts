import { queryOptions } from '@tanstack/react-query';

import { searchKeywords, searchPeople } from '@/api/functions';

export function keywordSearchQueryOptions(query: string) {
  return queryOptions({
    queryKey: ['search', 'keywords', query] as const,
    queryFn: () => searchKeywords(query),
    staleTime: 10 * 60 * 1000,
    enabled: query.length >= 2,
  });
}

export function peopleSearchQueryOptions(query: string) {
  return queryOptions({
    queryKey: ['search', 'people', query] as const,
    queryFn: () => searchPeople(query),
    staleTime: 10 * 60 * 1000,
    enabled: query.length >= 2,
  });
}
