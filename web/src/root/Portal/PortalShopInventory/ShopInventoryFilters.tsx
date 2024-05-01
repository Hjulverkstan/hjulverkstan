import * as enums from '@data/vehicle/enums';

import { useLocationsAsEnumsQ } from '@data/location/queries';
import { VehicleAggregated } from '@data/vehicle/types';
import * as DataTable from '@components/DataTable';

export default function ShopInventoryFilters() {
  const locationEnumsQ = useLocationsAsEnumsQ();
  const locationEnumMap = { locationId: locationEnumsQ.data ?? [] };

  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search..."
        matchFn={(word, row: VehicleAggregated) =>
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
          rowEnumAttrMap={locationEnumMap}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover label="Type">
        <DataTable.FilterMultiSelect
          filterKey="vehicle-type"
          rowEnumAttrMap={{
            vehicleType: enums.vehicleType,
            bikeType: enums.bikeType,
            strollerType: enums.strollerType,
          }}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover label="Status">
        <DataTable.FilterMultiSelect
          filterKey="vehicle-status"
          rowEnumAttrMap={{ vehicleStatus: enums.vehicleStatus }}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover label="Details" hasSearch>
        <DataTable.FilterMultiSelect
          heading="Bike Size"
          filterKey="size"
          rowEnumAttrMap={{ size: enums.size }}
        />
        <DataTable.FilterMultiSelect
          heading="Brake Type"
          filterKey="brakes"
          rowEnumAttrMap={{ brakeType: enums.brakeType }}
        />
        <DataTable.FilterMultiSelect
          heading="Brand"
          filterKey="brands"
          rowEnumAttrMap={{ brand: enums.brand }}
        />
      </DataTable.FilterPopover>
    </>
  );
}
