import * as enums from '@data/ticket/enums';

import * as DataTable from '@components/DataTable';
import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import { enumsMatchUtil } from '@data/enums';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { useTicketsAsEnumsQ } from '@data/ticket/queries';
import { TicketAggregated } from '@data/ticket/types';
import { useVehiclesAsEnumsQ } from '@data/vehicle/queries';

export default function ShopTicketFilters() {
  const ticketEnumsQ = useTicketsAsEnumsQ();

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
          DataTable.fuzzyMatchFn(
            ['comment', 'startDate', 'endDate', 'repairDescription'],
            word,
            row,
          ) ||
          enumsMatchUtil({
            enums: employeeEnumsQ.data,
            isOf: row.employeeId,
            includes: word,
          }) ||
          enumsMatchUtil({
            enums: customerEnumsQ.data,
            isOf: row.customerId,
            includes: word,
          }) ||
          enumsMatchUtil({
            enums: vehicleEnumsQ.data,
            isOf: row.vehicleIds,
            includes: word,
          }) ||
          enumsMatchUtil({
            enums: ticketEnumsQ.data,
            isOf: row.id,
            startsWith: word,
          }) ||
          enumsMatchUtil({
            enums: locationEnumsQ.data,
            isOf: row.locationIds,
            startsWith: word,
          })
        }
      />

      {/* TODO: Filter by start date and end date */}

      <DataTable.FilterPopover label="Customer" hasSearch>
        <DataTable.FilterMultiSelect
          filterKey="customer-id"
          enums={customerEnumsQ.data ?? []}
        />
      </DataTable.FilterPopover>

      <DataTable.FilterPopover label="Vehicles" hasSearch>
        <DataTable.FilterMultiSelect
          heading="Locations"
          filterKey="location-ids"
          enums={locationEnumsQ.data ?? []}
        />
        <DataTable.FilterMultiSelect
          heading="Vehicles"
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

      <DataTable.FilterPopover label="More" hasSearch>
        <DataTable.FilterMultiSelect
          heading="Status"
          filterKey="status"
          enums={enums.status}
        />
        <DataTable.FilterMultiSelect
          heading="Type"
          filterKey="type"
          enums={enums.ticketType}
        />
      </DataTable.FilterPopover>
    </>
  );
}
