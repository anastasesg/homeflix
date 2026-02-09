export interface MovieRecommendation {
  mediaType: 'movie';
  id: number;
  title: string;
  posterUrl?: string;
  rating: number;
  year: number;
  overview?: string;
}

export interface ShowRecommendation {
  mediaType: 'show';
  id: number;
  title: string;
  posterUrl?: string;
  rating: number;
  year: number;
  overview?: string;
}

export type MediaRecommendation = MovieRecommendation | ShowRecommendation;
