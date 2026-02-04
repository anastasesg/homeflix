import createClient from 'openapi-fetch';

import type { paths } from './sonarr-client.d';

/**
 * Creates a Sonarr API client that routes through our Next.js proxy.
 * This avoids CORS issues since requests go to the same origin.
 *
 * The proxy at /api/sonarr/[...path] forwards to the actual Sonarr server
 * and handles authentication server-side.
 */
export function createSonarrClient() {
  // Use relative URL to hit our proxy - works in browser
  // The proxy handles the actual Sonarr URL and API key server-side
  return createClient<paths>({ baseUrl: '/api/sonarr' });
}
