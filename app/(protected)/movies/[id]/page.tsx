import { notFound } from 'next/navigation';

import { MovieHeader } from './_components/movie-header';
import { MovieStats } from './_components/movie-stats';
import { MovieTabs } from './_components/movie-tabs';

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
      <MovieStats tmdbId={tmdbId} />
      <MovieTabs tmdbId={tmdbId} />
    </>
  );
}
