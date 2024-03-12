import { Routes, Route } from 'react-router-dom';
import { ComponentType } from 'react';

import ShopInventoryTable from './ShopInventoryTable';
import PortalLayout from './PortalLayout';

const shopRoutes = [
  { path: '/', label: 'Start' },
  { path: '/inventory', label: 'Inventory' },
];

const createContent = (
  Table: ComponentType,
  Panel?: ComponentType<{ mode: string }>,
) => (
  <>
    <Table />
    {Panel && (
      <Routes>
        <Route path="create" element={<Panel mode="create" />} />
        <Route path=":id" element={<Panel mode="read" />} />
        <Route path="edit/:id" element={<Panel mode="edit" />} />
      </Routes>
    )}
  </>
);

export default function Portal() {
  return (
    <Routes>
      <Route
        path="shop"
        element={
          <PortalLayout
            title="Shop"
            baseUrl="/portal/shop"
            routes={shopRoutes}
          />
        }
      >
        <Route path="inventory" element={createContent(ShopInventoryTable)} />
      </Route>
    </Routes>
  );
}
