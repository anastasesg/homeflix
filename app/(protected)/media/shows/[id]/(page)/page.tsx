import { notFound } from 'next/navigation';

import { ShowContent } from './_components/show-content';
import { ShowHeader } from './_components/show-header';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const tmdbId = parseInt(id, 10);
  if (isNaN(tmdbId) || tmdbId <= 0) notFound();

  return (
    <>
      <ShowHeader tmdbId={tmdbId} />
      <ShowContent tmdbId={tmdbId} />
    </>
  );
}
