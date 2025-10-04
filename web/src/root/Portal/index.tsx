import { ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedByRole, useAuth } from '@components/Auth';
import { Mode } from '@components/DataForm';
import { AuthRole } from '@data/auth/types';
import useIsMobile from '@hooks/useIsMobile';
import * as Auth from '@components/Auth';

import PortalAdminEmployees from './PortalAdminEmployees';
import PortalAdminLocations from './PortalAdminLocations';
import PortalAdminUsers from './PortalAdminUsers';
import PortalLayout from './PortalLayout';
import PortalLogin from './PortalLogin';
import PortalShopCustomers from './PortalShopCustomers';
import PortalShopInventory from './PortalShopInventory';
import PortalShopTickets from './PortalShopTickets';
import MobileImageInventory from './PortalMobileInventory/index';
import PortalWebEditGeneral from './PortalWebEditGeneral';

//

export interface PortalAppPageProps {
  mode?: Mode;
}

export type PortalAppPage = ComponentType<PortalAppPageProps>;

export interface PortalAppPageRoute {
  slug: string;
  title: string;
  page: PortalAppPage;
}

export interface PortalAppRoute {
  slug: string;
  title: string;
  roles?: AuthRole[];
  pageRoutes: PortalAppPageRoute[];
}

//

const appRoutes: PortalAppRoute[] = [
  {
    slug: 'shop',
    title: 'Shop',
    pageRoutes: [
      { slug: 'inventory', title: 'Inventory', page: PortalShopInventory },
      { slug: 'tickets', title: 'Tickets', page: PortalShopTickets },
      { slug: 'customers', title: 'Customers', page: PortalShopCustomers },
    ],
  },
  {
    slug: 'admin',
    title: 'Admin',
    roles: [AuthRole.ADMIN],
    pageRoutes: [
      { slug: 'locations', title: 'Locations', page: PortalAdminLocations },
      { slug: 'employees', title: 'Employees', page: PortalAdminEmployees },
      { slug: 'users', title: 'Users', page: PortalAdminUsers },
    ],
  },
];

//

const mountPage = (Page: PortalAppPage) => (
  <Routes>
    <Route index element={<Page />} />
    <Route path=":id" element={<Page mode={Mode.READ} />} />
    <Route path=":id/edit" element={<Page mode={Mode.EDIT} />} />
    <Route path="create" element={<Page mode={Mode.CREATE} />} />
    <Route path="*" element={<Navigate replace to=".." />} />
  </Routes>
);

const PortalRouter = () => {
  const { auth, isInitialising } = useAuth();
  const mobile = useIsMobile();

  if (isInitialising) return null;
  if (!auth) return <PortalLogin />;
  if (mobile) return <MobileImageInventory />;

  return (
    <Routes>
      {appRoutes.map((appRoute) => (
        <Route
          path={`${appRoute.slug}/*`}
          element={
            <ProtectedByRole roles={appRoute.roles ?? []} renderLandingPage>
              <PortalLayout appRoute={appRoute} />
            </ProtectedByRole>
          }
        >
          {appRoute.pageRoutes.map(({ slug, page }) => (
            <Route path={`${slug}/*`} element={mountPage(page)} />
          ))}
          <Route
            path="*"
            element={<Navigate replace to={`../${appRoute.slug}`} />}
          />
        </Route>
      ))}
    </Routes>
  );
};

export default function Portal() {
  return (
    <Auth.Provider>
      <PortalRouter />
    </Auth.Provider>
  );
}
