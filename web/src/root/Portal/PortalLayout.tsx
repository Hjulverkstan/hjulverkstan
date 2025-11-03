import { useIsFetching } from '@tanstack/react-query';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import * as C from '@utils/common';
import { cn } from '@utils/common';
import { Separator } from '@components/shadcn/Separator';
import Spinner from '@components/Spinner';
import usePortalSlugs from '@hooks/useSlugs';
import { Mode } from '@components/DataForm';
import { IconButton } from '@components/shadcn/Button';

import * as PortalWebEditLang from './PortalWebEditLang';
import { PortalAppRoute } from './index';
import { PortalMenu } from './PortalMenu';

//

export interface PortalLayoutProps {
  appRoutes: PortalAppRoute[];
  currAppRoute: PortalAppRoute;
}

export default function PortalLayout({
  appRoutes,
  currAppRoute,
}: PortalLayoutProps) {
  const isFetching = useIsFetching();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { coreUrl, baseUrl } = usePortalSlugs();

  const pageSlugToUrl = (slug: string) => `${coreUrl}/${slug}`;
  const appSlugToUrl = (slug: string) => `${baseUrl}/${slug}`;

  const currPage = currAppRoute.pageRoutes.find((pageRoute) =>
    pathname.startsWith(pageSlugToUrl(pageRoute.slug)),
  );

  const shouldDarken = pathname
    .split('/')
    .some((slug) => slug === Mode.EDIT || slug === Mode.CREATE);

  return (
    <>
      <div
        className={C.cn(
          'bg-muted flex h-screen flex-col px-4 pt-2',
          shouldDarken && 'bg-accent/60',
        )}
      >
        <nav
          className="mb-2 flex flex-shrink items-center justify-center space-x-4
            py-1"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="flex-1 whitespace-nowrap text-lg font-semibold">
                Hjulverkstan
                <span className="text-muted-foreground font-normal">
                  {' '}
                  {currAppRoute.title}
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {currAppRoute.pageRoutes.map((pageRoute) => (
                <IconButton
                  key={pageRoute.slug}
                  variant="ghost"
                  className={cn(
                    pageRoute === currPage
                      ? 'bg-accent border-secondary-border border shadow'
                      : '',
                  )}
                  tooltip={pageRoute.title}
                  icon={pageRoute.icon}
                  onClick={() => navigate(pageSlugToUrl(pageRoute.slug))}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <Spinner visible={!!isFetching} className="h-6 w-6" />
            {currAppRoute.slug === 'web-edit' && <PortalWebEditLang.Select />}
            <PortalMenu />
          </div>
        </nav>
        <Separator className="mb-4 opacity-60" />
        <Outlet />
      </div>
    </>
  );
}
