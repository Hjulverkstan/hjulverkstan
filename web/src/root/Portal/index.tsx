import { ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from '@components/Auth';
import { Mode } from '@components/DataForm';

import PortalLayout from './PortalLayout';
import PortalLogin from './PortalLogin';
import PortalShopCustomers from './PortalShopCustomers';
import PortalShopInventory from './PortalShopInventory';
import PortalShopTickets from './PortalShopTickets';

//

const shopRoutes = [
  /* { path: '/', label: 'Start' }, */
  { path: '/inventory', label: 'Inventory', hasNestedRoutes: true },
  { path: '/ticketz', label: 'Tickets', hasNestedRoutes: true },
  { path: '/customers', label: 'Customers', hasNestedRoutes: true },
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

export default function Portal() {
  const { auth, isInitialising } = useAuth();

  if (isInitialising) return null;
  if (!auth) return <PortalLogin />;

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
      <Route path="*" element={<Navigate replace to="shop" />} />
    </Routes>
  );
}
