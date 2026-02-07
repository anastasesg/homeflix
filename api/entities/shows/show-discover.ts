// export interface DiscoverShow {
//   id: number;
//   name: string;
//   title: string; // alias for name — satisfies BaseMediaItem contract
//   overview: string;
//   year: number;
//   rating: number;
//   voteCount: number;
//   popularity: number;
//   posterUrl?: string;
//   backdropUrl?: string;
//   genreIds: number[];
//   originCountry: string[];
// }

export interface NetworkItem {
  id: number;
  name: string;
  logoUrl?: string;
}
