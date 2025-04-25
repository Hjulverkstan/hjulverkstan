import { CloudFrontRequestEvent, CloudFrontRequest } from 'aws-lambda';

let cachedManifest: string[] | null = null;

export const handler = async (event: CloudFrontRequestEvent) => {
  const request: CloudFrontRequest = event.Records[0].cf.request;

  //console.log('Lambda is alive!');
  //await new Promise((resolve) => setTimeout(resolve, 500));

  if (!cachedManifest) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);

    try {
      const res = await fetch('__ROUTE_MANIFEST_URL__', {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        console.error('Manifest fetch failed with status:', res.status);
      }

      cachedManifest = await res.json();
      console.log('Fetched manifest:', cachedManifest);
    } catch (e) {
      console.error('Failed to get manifest, proceeding without it, error:', e);
    }
  }

  if (cachedManifest) {
    if (/\.[a-zA-Z0-9]+$/.test(request.uri)) {
      return request; // Static asset, pass through
    }

    const originalUri = request.uri.endsWith('/')
      ? request.uri.slice(0, -1)
      : request.uri;

    const parts = originalUri.split('/').filter(Boolean);

    for (let i = parts.length; i >= 0; i--) {
      const candidate = '/' + parts.slice(0, i).join('/') + '/';
      if (cachedManifest.includes(candidate)) {
        request.uri = candidate + 'index.html';
        return request;
      }
    }

    request.uri = '/index.html';
  }

  return request;
};
