import * as enums from '@data/vehicle/enums';

import * as DataTable from '@components/DataTable';
import { enumsMatchUtil } from '@data/enums';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { useTicketsAsEnumsQ } from '@data/ticket/queries';
import { Vehicle } from '@data/vehicle/types';

export default function ShopInventoryFilters() {
  const locationEnumsQ = useLocationsAsEnumsQ();
  const ticketEnumsQ = useTicketsAsEnumsQ();

  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Inventory..."
        matchFn={(word: string, row: Vehicle) =>
          enums.matchFn(word, row) ||
          DataTable.fuzzyMatchFn(['comment', 'regTag'], word, row) ||
          word === String(row.gearCount) ||
          enumsMatchUtil({
            enums: ticketEnumsQ.data,
            isOf: row.ticketIds,
            startsWith: word,
          }) ||
          enumsMatchUtil({
            enums: locationEnumsQ.data,
            isOf: row.locationId,
            startsWith: word,
          })
        }
      />

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

      <DataTable.FilterPopover label="Location">
        <DataTable.FilterMultiSelect
          filterKey="location"
          enums={locationEnumsQ.data ?? []}
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
