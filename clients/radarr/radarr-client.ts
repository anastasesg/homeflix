import createClient from 'openapi-fetch';

import type { paths } from './radarr-client.d';

export function createRadarrClient() {
  const radarrApiUrl = process.env.NEXT_PUBLIC_RADARR_API_URL;
  const radarrApiKey = process.env.NEXT_PUBLIC_RADARR_API_KEY;
  if (!radarrApiUrl) throw new Error('Radarr API URL is not defined');
  if (!radarrApiKey) throw new Error('Radarr API Key is not defined');

  return createClient<paths>({ baseUrl: radarrApiUrl, headers: { 'X-Api-Key': radarrApiKey } });
}
