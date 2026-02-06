import { notFound } from 'next/navigation';

import { ShowHeader } from './_components/show-header';
import { ShowStats } from './_components/show-stats';
import { ShowTabs } from './_components/show-tabs';

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
      <ShowStats tmdbId={tmdbId} />
      <ShowTabs tmdbId={tmdbId} />
    </>
  );
}
