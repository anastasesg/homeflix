import { queryOptions } from '@tanstack/react-query';

import type { ShowItemsRequest } from '@/api/dtos';
import {
  fetchFeaturedShow,
  fetchShowEpisodeFiles,
  fetchShowHistory,
  fetchShowItems,
  fetchShowLibraryInfo,
} from '@/api/functions';

export type ShowQueryProps = ShowItemsRequest;

export function showItemsQueryOptions(props: ShowQueryProps) {
  return queryOptions({
    queryKey: ['shows', 'library', 'items', props] as const,
    queryFn: () => fetchShowItems(props),
    staleTime: 2 * 60 * 1000,
  });
}

export function featuredShowQueryOptions() {
  return queryOptions({
    queryKey: ['shows', 'library', 'featured'] as const,
    queryFn: fetchFeaturedShow,
    staleTime: 2 * 60 * 1000,
  });
}

export function showLibraryInfoQueryOptions(tmdbId: number) {
  return queryOptions({
    queryKey: ['shows', 'library', 'info', tmdbId] as const,
    queryFn: () => fetchShowLibraryInfo(tmdbId),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function showEpisodeFilesQueryOptions(sonarrId: number) {
  return queryOptions({
    queryKey: ['shows', 'library', 'episode-files', sonarrId] as const,
    queryFn: () => fetchShowEpisodeFiles(sonarrId),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function showHistoryQueryOptions(sonarrId: number) {
  return queryOptions({
    queryKey: ['shows', 'library', 'history', sonarrId] as const,
    queryFn: () => fetchShowHistory(sonarrId),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
