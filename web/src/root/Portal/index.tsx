import { Routes, Route, Navigate } from 'react-router-dom';
import { ComponentType } from 'react';

import { Mode } from '@components/DataForm';
import { useAuth } from '@components/Auth';

import PortalLayout from './PortalLayout';
import ShopInventory from './ShopInventory';
import PortalLogin from './PortalLogin';

//

const shopRoutes = [
  { path: '/', label: 'Start' },
  { path: '/inventory', label: 'Inventory', hasNestedRoutes: true },
];

//

const mountCountent = (Content: ComponentType<{ mode?: Mode }>) => (
  <Routes>
    <Route index element={<Content />} />
    <Route path=":id" element={<Content mode={Mode.READ} />} />
    <Route path=":id/edit" element={<Content mode={Mode.EDIT} />} />
    <Route path="create" element={<Content mode={Mode.CREATE} />} />
    <Route path="*" element={<Navigate replace to=".." />} />
  </Routes>
);

export default function Portal() {
  const { auth } = useAuth();

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
        <Route path="inventory/*" element={mountCountent(ShopInventory)} />
      </Route>
      <Route path="*" element={<Navigate replace to="shop" />} />
    </Routes>
  );
}
