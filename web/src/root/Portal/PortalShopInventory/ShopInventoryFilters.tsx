import * as enums from '@data/vehicle/enums';

import { useLocationsAsEnumsQ } from '@data/location/queries';
import { Vehicle } from '@data/vehicle/types';
import * as DataTable from '@components/DataTable';

export default function ShopInventoryFilters() {
  const locationEnumsQ = useLocationsAsEnumsQ();

  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search..."
        matchFn={(word, row: Vehicle) =>
          enums.matchFn(word, row) ||
          DataTable.fuzzyMatchFn(['comment', 'regTag'], word, row) ||
          word === String(row.gearCount) ||
          row.tickets.some((ticket) =>
            ticket.customerFirstName?.toLowerCase().includes(word),
          )
        }
      />
      <DataTable.FilterPopover label="Location">
        <DataTable.FilterMultiSelect
          filterKey="location"
          enums={locationEnumsQ.data ?? []}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover label="Type">
        <DataTable.FilterMultiSelect
          filterKey="vehicle-type"
          enums={[
            ...enums.vehicleType,
            ...enums.bikeType,
            ...enums.strollerType,
          ]}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover label="Status">
        <DataTable.FilterMultiSelect
          filterKey="vehicle-status"
          enums={enums.vehicleStatus}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover label="Details" hasSearch>
        <DataTable.FilterMultiSelect
          heading="Bike Size"
          filterKey="size"
          enums={enums.size}
        />
        <DataTable.FilterMultiSelect
          heading="Brake Type"
          filterKey="brakes"
          enums={enums.brakeType}
        />
        <DataTable.FilterMultiSelect
          heading="Brand"
          filterKey="brands"
          enums={enums.brand}
        />
      </DataTable.FilterPopover>
    </>
  );
}
