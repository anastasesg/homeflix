import type { TMDBReleaseDatesResponse } from '@/api/clients/tmdb';
import type { ContentRating } from '@/api/entities/shared/content-rating';

export function tmdbToMovieContentRatings(data: TMDBReleaseDatesResponse): ContentRating[] {
  return (data.results ?? [])
    .flatMap((entry) =>
      (entry.release_dates ?? [])
        .filter((rd) => rd.certification !== '')
        .map((rd) => ({
          country: entry.iso_3166_1 ?? '',
          rating: rd.certification ?? '',
        }))
    )
    .filter((v, i, arr) => arr.findIndex((x) => x.country === v.country && x.rating === v.rating) === i);
}
