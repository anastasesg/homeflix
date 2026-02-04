import createClient from 'openapi-fetch';

import type { paths } from './prowlarr-client.d';

export function createProwlarrClient() {
  const prowlarrApiUrl = process.env.NEXT_PUBLIC_PROWLARR_API_URL;
  const prowlarrApiKey = process.env.NEXT_PUBLIC_PROWLARR_API_KEY;
  if (!prowlarrApiUrl) throw new Error('Prowlarr API URL is not defined');
  if (!prowlarrApiKey) throw new Error('Prowlarr API Key is not defined');

  return createClient<paths>({ baseUrl: prowlarrApiUrl, headers: { 'X-Api-Key': prowlarrApiKey } });
}
