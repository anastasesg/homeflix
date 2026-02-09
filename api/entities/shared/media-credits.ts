export interface MediaCredits {
  cast: Array<{ name: string; character: string; profileUrl?: string; order: number }>;
  crew: Array<{ name: string; job: string; department: string; profileUrl?: string }>;
}
