import { notFound } from 'next/navigation';

import { EpisodeActions } from './_components/episode-actions';
import { EpisodeFile } from './_components/episode-file';
import { EpisodeGallery } from './_components/episode-gallery';
import { EpisodeHeader } from './_components/episode-header';
import { EpisodeInfo } from './_components/episode-info';
import { EpisodeLinks } from './_components/episode-links';

interface PageProps {
  params: Promise<{ id: string; seasonNumber: string; episodeNumber: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, seasonNumber: seasonStr, episodeNumber: episodeStr } = await params;
  const tmdbId = parseInt(id, 10);
  const seasonNumber = parseInt(seasonStr, 10);
  const episodeNumber = parseInt(episodeStr, 10);
  if (
    isNaN(tmdbId) ||
    tmdbId <= 0 ||
    isNaN(seasonNumber) ||
    seasonNumber < 0 ||
    isNaN(episodeNumber) ||
    episodeNumber <= 0
  )
    notFound();

  return (
    <>
      <EpisodeHeader tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
      <EpisodeInfo tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
      <EpisodeGallery tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
      <EpisodeFile tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
      <EpisodeActions tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
      <EpisodeLinks tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
    </>
  );
}
