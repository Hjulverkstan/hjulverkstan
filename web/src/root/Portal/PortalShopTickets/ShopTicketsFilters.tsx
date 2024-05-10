import * as enums from '@data/ticket/enums';

import { useLocationsAsEnumsQ } from '@data/location/queries';
import { TicketAggregated } from '@data/ticket/types';
import * as DataTable from '@components/DataTable';
import { useVehiclesAsEnumsQ } from '@data/vehicle/queries';
import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';

export default function ShopTicketFilters() {
  const locationEnumsQ = useLocationsAsEnumsQ({ dataKey: 'locationIds' });
  const vehicleEnumsQ = useVehiclesAsEnumsQ({ dataKey: 'vehicleIds' });
  const employeeEnumsQ = useEmployeesAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ();

  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Tickets..."
        matchFn={(word: string, row: TicketAggregated) =>
          enums.matchFn(word, row) ||
          DataTable.fuzzyMatchFn(['comment'], word, row) ||
          locationEnumsQ.data?.some(({ label }) =>
            label.toLowerCase().includes(word),
          ) ||
          vehicleEnumsQ.data?.some(({ label }) =>
            label.toLowerCase().includes(word),
          ) ||
          customerEnumsQ.data?.some(({ label }) =>
            label.toLowerCase().includes(word),
          )
        }
      />

      <DataTable.FilterPopover label="Location">
        <DataTable.FilterMultiSelect
          filterKey="location-ids"
          enums={locationEnumsQ.data ?? []}
        />
      </DataTable.FilterPopover>

      {/* TODO: Filter by start date and end date */}

      <DataTable.FilterPopover label="Vehicles" hasSearch>
        <DataTable.FilterMultiSelect
          filterKey="vehicle-ids"
          enums={vehicleEnumsQ.data ?? []}
        />
      </DataTable.FilterPopover>

      <DataTable.FilterPopover label="Employee" hasSearch>
        <DataTable.FilterMultiSelect
          filterKey="employee-id"
          enums={employeeEnumsQ.data ?? []}
        />
      </DataTable.FilterPopover>

      <DataTable.FilterPopover label="Customer" hasSearch>
        <DataTable.FilterMultiSelect
          filterKey="customer-id"
          enums={customerEnumsQ.data ?? []}
        />
      </DataTable.FilterPopover>
    </>
  );
}
