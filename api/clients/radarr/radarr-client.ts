import createClient from 'openapi-fetch';

import type { components, paths } from './radarr-client.d';

export type MovieResource = components['schemas']['MovieResource'];
export type MovieFileResource = components['schemas']['MovieFileResource'];
export type HistoryResource = components['schemas']['HistoryResource'];

export function createRadarrClient() {
  const radarrApiUrl = process.env.NEXT_PUBLIC_RADARR_API_URL;
  const radarrApiKey = process.env.NEXT_PUBLIC_RADARR_API_KEY;
  if (!radarrApiUrl) throw new Error('Radarr API URL is not defined');
  if (!radarrApiKey) throw new Error('Radarr API Key is not defined');

  return createClient<paths>({ baseUrl: radarrApiUrl, headers: { 'X-Api-Key': radarrApiKey } });
}
