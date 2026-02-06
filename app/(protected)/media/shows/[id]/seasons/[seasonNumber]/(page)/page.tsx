import { notFound } from 'next/navigation';

import { SeasonHeader } from './_components/season-header';
import { SeasonStats } from './_components/season-stats';
import { SeasonTabs } from './_components/season-tabs';

interface PageProps {
  params: Promise<{ id: string; seasonNumber: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, seasonNumber: seasonStr } = await params;
  const tmdbId = parseInt(id, 10);
  const seasonNumber = parseInt(seasonStr, 10);
  if (isNaN(tmdbId) || tmdbId <= 0 || isNaN(seasonNumber) || seasonNumber < 0) notFound();

  return (
    <>
      <SeasonHeader tmdbId={tmdbId} seasonNumber={seasonNumber} />
      <SeasonStats tmdbId={tmdbId} seasonNumber={seasonNumber} />
      <SeasonTabs tmdbId={tmdbId} seasonNumber={seasonNumber} />
    </>
  );
}
