export interface MediaCredits {
  cast: Array<{ id: number; name: string; character: string; profileUrl?: string; order: number }>;
  crew: Array<{ id: number; name: string; job: string; department: string; profileUrl?: string }>;
}
