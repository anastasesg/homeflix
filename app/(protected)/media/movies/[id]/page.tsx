import { notFound } from 'next/navigation';

import { MovieContent } from './_components/movie-content';
import { MovieHeader } from './_components/movie-header';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const tmdbId = parseInt(id, 10);
  if (isNaN(tmdbId) || tmdbId <= 0) notFound();

  return (
    <>
      <MovieHeader tmdbId={tmdbId} />
      <MovieContent tmdbId={tmdbId} />
    </>
  );
}
