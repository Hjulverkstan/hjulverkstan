import { ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  Bike,
  BookOpen,
  GraduationCap,
  Handshake,
  LucideIcon,
  MapPin,
  Newspaper,
  ReceiptText,
  Store,
  Type,
  User,
} from 'lucide-react';

import * as Auth from '@components/Auth';
import { ProtectedByRole, useAuth } from '@components/Auth';
import { Mode } from '@components/DataForm';
import { AuthRole } from '@data/auth/types';
import useIsMobile from '@hooks/useIsMobile';

import PortalAdminEmployees from './PortalAdminEmployees';
import PortalAdminLocations from './PortalAdminLocations';
import PortalAdminUsers from './PortalAdminUsers';
import PortalLayout from './PortalLayout';
import PortalLogin from './PortalLogin';
import PortalShopCustomers from './PortalShopCustomers';
import PortalShopInventory from './PortalShopInventory';
import PortalShopTickets from './PortalShopTickets';
import MobileImageInventory from './PortalMobileInventory/index';
import PortalWebEditText from './PortalWebEditText';
import * as PortalWebEditLang from './PortalWebEditLang';
import PortalWebEditShops from './PortalWebEditShops';
import PortalWebEditStories from './PortalWebEditStories';

//

export interface PortalAppPageProps {
  mode?: Mode;
}

export type PortalAppPage = ComponentType<PortalAppPageProps>;

export interface PortalAppPageRoute {
  slug: string;
  title: string;
  icon: LucideIcon;
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
      {
        slug: 'inventory',
        title: 'Inventory',
        icon: Bike,
        page: PortalShopInventory,
      },
      {
        slug: 'tickets',
        title: 'Tickets',
        icon: ReceiptText,
        page: PortalShopTickets,
      },
      {
        slug: 'customers',
        title: 'Customers',
        icon: User,
        page: PortalShopCustomers,
      },
    ],
  },
  {
    slug: 'admin',
    title: 'Admin',
    roles: [AuthRole.ADMIN],
    pageRoutes: [
      {
        slug: 'locations',
        title: 'Locations',
        icon: MapPin,
        page: PortalAdminLocations,
      },
      {
        slug: 'employees',
        title: 'Employees',
        icon: GraduationCap,
        page: PortalAdminEmployees,
      },
      { slug: 'users', title: 'Users', icon: User, page: PortalAdminUsers },
    ],
  },
  {
    slug: 'web-edit',
    title: 'WebEdit',
    roles: [AuthRole.ADMIN],
    pageRoutes: [
      { slug: 'text', title: 'Text', icon: Type, page: PortalWebEditText },
      { slug: 'shops', title: 'Shops', icon: Store, page: PortalWebEditShops },
      {
        slug: 'stories',
        title: 'Stories',
        icon: Newspaper,
        page: PortalWebEditStories,
      },
      { slug: 'courses', title: 'Courses', icon: BookOpen, page: () => null },
      {
        slug: 'partners',
        title: 'Partners',
        icon: Handshake,
        page: () => null,
      },
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
          key={appRoute.slug}
          path={`${appRoute.slug}/*`}
          element={
            <ProtectedByRole roles={appRoute.roles ?? []} renderLandingPage>
              <PortalLayout appRoutes={appRoutes} currAppRoute={appRoute} />
            </ProtectedByRole>
          }
        >
          {appRoute.pageRoutes.map(({ slug, page }) => (
            <Route key={slug} path={`${slug}/*`} element={mountPage(page)} />
          ))}
          <Route
            path="*"
            element={
              <Navigate replace to={`../${appRoute.pageRoutes[0].slug}`} />
            }
          />
        </Route>
      ))}
      <Route path="*" element={<Navigate replace to={appRoutes[0].slug} />} />
    </Routes>
  );
};

export default function Portal() {
  return (
    <Auth.Provider>
      <PortalWebEditLang.Provider>
        <PortalRouter />
      </PortalWebEditLang.Provider>
    </Auth.Provider>
  );
}
