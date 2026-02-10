import { getTMDBImageUrl } from '@/api/clients/tmdb';
import type { MediaReview } from '@/api/entities/shared/media-review';

interface TMDBReviewsResponse {
  results?: Array<{
    id?: string;
    author?: string;
    author_details?: {
      avatar_path?: string | null;
      rating?: number | null;
    };
    content?: string;
    created_at?: string;
    url?: string;
  }>;
}

export function tmdbToShowReviews(data: unknown): MediaReview[] {
  const results = (data as TMDBReviewsResponse).results ?? [];
  return results.slice(0, 10).map((item) => {
    let authorAvatar: string | undefined;
    const avatarPath = item.author_details?.avatar_path;

    // TMDB sometimes prefixes avatar paths with /https:// - detect and strip the leading /
    if (avatarPath) {
      const cleanPath = avatarPath.startsWith('/http') ? avatarPath.substring(1) : avatarPath;
      authorAvatar = cleanPath.startsWith('http') ? cleanPath : getTMDBImageUrl(cleanPath, 'w185');
    }

    return {
      id: item.id ?? '',
      author: item.author ?? '',
      authorAvatar,
      rating: item.author_details?.rating || undefined,
      content: item.content ?? '',
      createdAt: item.created_at ?? '',
      url: item.url ?? '',
    };
  });
}
