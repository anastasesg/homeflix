import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route for Sonarr API requests.
 * Forwards requests to the Sonarr server to avoid CORS issues.
 *
 * Usage: /api/sonarr/api/v5/series -> http://SONARR_URL/api/v5/series
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const sonarrApiUrl = process.env.SONARR_API_URL;
  const sonarrApiKey = process.env.SONARR_API_KEY;

  if (!sonarrApiUrl) {
    return NextResponse.json({ error: 'Sonarr API URL is not configured' }, { status: 500 });
  }
  if (!sonarrApiKey) {
    return NextResponse.json({ error: 'Sonarr API Key is not configured' }, { status: 500 });
  }

  const { path } = await params;
  const pathString = path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${sonarrApiUrl}/${pathString}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': sonarrApiKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Sonarr proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from Sonarr' }, { status: 502 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const sonarrApiUrl = process.env.SONARR_API_URL;
  const sonarrApiKey = process.env.SONARR_API_KEY;

  if (!sonarrApiUrl || !sonarrApiKey) {
    return NextResponse.json({ error: 'Sonarr API is not configured' }, { status: 500 });
  }

  const { path } = await params;
  const pathString = path.join('/');
  const body = await request.json();

  try {
    const response = await fetch(`${sonarrApiUrl}/${pathString}`, {
      method: 'POST',
      headers: {
        'X-Api-Key': sonarrApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Sonarr proxy error:', error);
    return NextResponse.json({ error: 'Failed to post to Sonarr' }, { status: 502 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const sonarrApiUrl = process.env.SONARR_API_URL;
  const sonarrApiKey = process.env.SONARR_API_KEY;

  if (!sonarrApiUrl || !sonarrApiKey) {
    return NextResponse.json({ error: 'Sonarr API is not configured' }, { status: 500 });
  }

  const { path } = await params;
  const pathString = path.join('/');
  const body = await request.json();

  try {
    const response = await fetch(`${sonarrApiUrl}/${pathString}`, {
      method: 'PUT',
      headers: {
        'X-Api-Key': sonarrApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Sonarr proxy error:', error);
    return NextResponse.json({ error: 'Failed to update Sonarr' }, { status: 502 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const sonarrApiUrl = process.env.SONARR_API_URL;
  const sonarrApiKey = process.env.SONARR_API_KEY;

  if (!sonarrApiUrl || !sonarrApiKey) {
    return NextResponse.json({ error: 'Sonarr API is not configured' }, { status: 500 });
  }

  const { path } = await params;
  const pathString = path.join('/');

  try {
    const response = await fetch(`${sonarrApiUrl}/${pathString}`, {
      method: 'DELETE',
      headers: {
        'X-Api-Key': sonarrApiKey,
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Sonarr proxy error:', error);
    return NextResponse.json({ error: 'Failed to delete from Sonarr' }, { status: 502 });
  }
}
