import * as DataTable from '@components/DataTable';
import { PortalFilterDate } from '../PortalFilterDate';

export default function WebEditShopFilters() {
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Shops..."
        matchFn={(
          word: string,
          row: { name: string; address: string; bodyText: string },
        ) => DataTable.fuzzyMatchFn(['name', 'address', 'bodyText'], word, row)}
      />
      <PortalFilterDate
        filterOptions={[
          { label: 'Created At', dataKeyFrom: 'createdAt' },
          { label: 'Edited At', dataKeyFrom: 'updatedAt' },
        ]}
      />
    </>
  );
}
