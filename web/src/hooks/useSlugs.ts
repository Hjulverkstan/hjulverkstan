import { useLocation } from 'react-router-dom';
import { Lang } from '@data/webedit/types';

export default function usePortalSlugs(): {
  url: string;
  /* Contains that which prefixes the appSlug, e.g. /sv/portal */
  baseUrl: string;
  /* This is baseUrl + appUrl, for convenience */
  coreUrl: string;
  /* shop / admin / web-edit */
  appSlug: string;
  /* This is the page/tab, i.e. tickets, customers etc... */
  pageSlug: string;
  /* What is selected, form mode etc... */
  tailSlug?: string;
} {
  const location = useLocation();

  const langSlugs = Object.values(Lang).join('|'); // e.g., "sv|en|ar|..."
  const pattern = new RegExp(
    `^(?:/(${langSlugs}))?(/[^/]+)(/[^/]+)(/[^/]+)?(/.*)?`,
  );

  const match = location.pathname.match(pattern);

  if (!match) throw new Error('useSlugs failed to match the location pathname');

  const [, langSlug, base, appSlug, pageSlug, tailSlug] = match;

  const baseUrl = (langSlug ? `/${langSlug}` : '') + base;

  return {
    url: location.pathname,
    baseUrl,
    appSlug,
    pageSlug,
    tailSlug,
    coreUrl: baseUrl + appSlug,
  };
}
