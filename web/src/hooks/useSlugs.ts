import { useLocation } from 'react-router-dom';

export default function usePortalSlugs(): {
  url: string;
  baseUrl: string;
  coreUrl?: string;
  appSlug?: string;
  tailSlug?: string;
} {
  const location = useLocation();
  const match = location.pathname.match(/^(\/[^/]+)(?:(\/[^/]+))?(\/.*)?/);

  if (!match) throw new Error('useSlugs failed to match the location pathname');

  const [url, baseUrl, appSlug, tailSlug] = match;

  return {
    url,
    baseUrl,
    appSlug,
    tailSlug,
    coreUrl: baseUrl + appSlug,
  };
}
