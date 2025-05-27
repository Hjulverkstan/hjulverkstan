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

//

const shopRoutes = [
  {
    path: '/inventory',
    label: 'Inventory',
    hasNestedRoutes: true,
  },
  {
    path: '/ticketz',
    label: 'Tickets',
    hasNestedRoutes: true,
  },
  { path: '/customers', label: 'Customers', hasNestedRoutes: true },
];

const adminRoutes = [
  {
    path: '/locations',
    label: 'Locations',
    hasNestedRoutes: true,
  },
  {
    path: '/employees',
    label: 'Employees',
    hasNestedRoutes: true,
  },
  { path: '/users', label: 'Users', hasNestedRoutes: true },
];

//

export interface PageContentProps {
  mode?: Mode;
}

const mountPageContent = (Content: ComponentType<PageContentProps>) => (
  <Routes>
    <Route index element={<Content />} />
    <Route path=":id" element={<Content mode={Mode.READ} />} />
    <Route path=":id/edit" element={<Content mode={Mode.EDIT} />} />
    <Route path="create" element={<Content mode={Mode.CREATE} />} />
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
      <Route
        path="shop/*"
        element={
          <PortalLayout
            title="Shop"
            baseUrl="/portal/shop"
            routes={shopRoutes}
          />
        }
      >
        <Route
          path="inventory/*"
          element={mountPageContent(PortalShopInventory)}
        />

        <Route path="ticketz/*" element={mountPageContent(PortalShopTickets)} />

        <Route
          path="customers/*"
          element={mountPageContent(PortalShopCustomers)}
        />
        <Route path="*" element={<Navigate replace to="../inventory" />} />
      </Route>

      <Route
        path="admin/*"
        element={
          <ProtectedByRole roles={[AuthRole.ADMIN]} renderLandingPage>
            <PortalLayout
              title="Admin"
              baseUrl="/portal/admin"
              routes={adminRoutes}
            />
          </ProtectedByRole>
        }
      >
        <Route
          path="locations/*"
          element={mountPageContent(PortalAdminLocations)}
        />
        <Route
          path="employees/*"
          element={mountPageContent(PortalAdminEmployees)}
        />
        <Route path="users/*" element={mountPageContent(PortalAdminUsers)} />
        <Route path="*" element={<Navigate replace to="../locations" />} />
      </Route>
      <Route path="*" element={<Navigate replace to="shop" />} />
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
