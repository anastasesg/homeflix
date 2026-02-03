import createClient from 'openapi-fetch';

import type { paths } from './sonarr-client.d';

export function createSonarrClient() {
  const sonarrApiUrl = process.env.NEXT_PUBLIC_SONARR_API_URL;
  const sonarrApiKey = process.env.NEXT_PUBLIC_SONARR_API_KEY;
  if (!sonarrApiUrl) throw new Error('Sonarr API URL is not defined');
  if (!sonarrApiKey) throw new Error('Sonarr API Key is not defined');

  return createClient<paths>({ baseUrl: sonarrApiUrl, headers: { 'X-Api-Key': sonarrApiKey } });
}
