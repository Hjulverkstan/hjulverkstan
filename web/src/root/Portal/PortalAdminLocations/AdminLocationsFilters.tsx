import * as enums from '@data/location/enums';

import * as DataTable from '@components/DataTable';
import { Location } from '@data/location/types';
import { PortalFilterDate } from '../PortalFilterDate';

export default function AdminLocationFilters() {
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Locations..."
        matchFn={(word: string, row: Location) =>
          enums.matchFn(word, row) ||
          DataTable.fuzzyMatchFn(['comment', 'name', 'address'], word, row)
        }
      />

      <DataTable.FilterPopover label="Type">
        <DataTable.FilterMultiSelect
          filterKey="location-type"
          enums={enums.locationType}
        />
      </DataTable.FilterPopover>

      <PortalFilterDate
        filterOptions={[
          { label: 'Created At', dataKeyFrom: 'createdAt' },
          { label: 'Edited At', dataKeyFrom: 'updatedAt' },
        ]}
      />
    </>
  );
}
