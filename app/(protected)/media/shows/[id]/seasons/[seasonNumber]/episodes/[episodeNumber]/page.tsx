import { notFound } from 'next/navigation';

import { EpisodeCast } from './_components/episode-cast';
import { EpisodeCrew } from './_components/episode-crew';
import { EpisodeGallery } from './_components/episode-gallery';
import { EpisodeHeader } from './_components/episode-header';
import { EpisodeLinks } from './_components/episode-links';
import { EpisodeSynopsis } from './_components/episode-synopsis';

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
      <EpisodeSynopsis tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
      <EpisodeCast tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
      <EpisodeCrew tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
      <EpisodeGallery tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
      <EpisodeLinks tmdbId={tmdbId} seasonNumber={seasonNumber} episodeNumber={episodeNumber} />
    </>
  );
}
