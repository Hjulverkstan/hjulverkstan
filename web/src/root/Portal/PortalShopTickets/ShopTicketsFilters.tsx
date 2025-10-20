import { useLocation, useParams } from 'react-router-dom';

import * as DataTable from '@components/DataTable';
import * as enums from '@data/ticket/enums';
import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import { enumsMatchUtil } from '@data/enums';
import { TicketAggregated } from '@data/ticket/types';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { useVehiclesAsEnumsQ } from '@data/vehicle/queries';
import {
  useTicketsAggregatedQ,
  useTicketsAsEnumsQ,
} from '@data/ticket/queries';

import { PortalFilterDate } from '../PortalFilterDate';
import {
  VehicleShortcutAction,
  VehicleShortcutLocationState,
} from '../PortalShopInventory/ShopInventoryActions';
import { matchDateWithoutTimestamp } from '@utils/common';

export default function ShopTicketFilters() {
  const ticketsQ = useTicketsAggregatedQ();
  const ticketEnumsQ = useTicketsAsEnumsQ();
  const locationState = useLocation().state as VehicleShortcutLocationState;

  const locationEnumsQ = useLocationsAsEnumsQ({ dataKey: 'locationIds' });
  const vehicleEnumsQ = useVehiclesAsEnumsQ({ dataKey: 'vehicleIds' });
  const employeeEnumsQ = useEmployeesAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ();

  const { id } = useParams();
  const ticketByParam = id && ticketsQ.data?.find((t) => t.id === id);

  // This shortcut action can be triggered an passed through location state
  // from the inventory page
  const vehicleIdToSelect =
    locationState?.action === VehicleShortcutAction.FILTER_BY_VEHICLE &&
    locationState.vehicleId;

  const expectedVisibleTickets = vehicleIdToSelect
    ? // User expects to see the tickets from the "See tickets" vehicle shortcut
      ticketsQ.data?.filter((t) => t.vehicleIds.includes(vehicleIdToSelect))
    : ticketByParam
      ? // The user expects to see the ticket navigated to by the url
        [ticketByParam]
      : undefined;

  // By passing this to the toInitSelect of all multi select filters, we can
  // check if each filter has a persisted selection that will hide the
  // expectedVisibleTickets and clear it if so.
  const clearIfExcludesExpectedTicketsByProp =
    (prop: keyof TicketAggregated) => (fromStore?: any[]) =>
      (fromStore &&
        expectedVisibleTickets?.some((t) =>
          Array.isArray(t[prop])
            ? !t[prop].some((v) => fromStore.includes(v))
            : !fromStore.includes(t[prop]),
        ) &&
        []) ||
      fromStore;

  const filterSearchMatchFn = (word: string, row: TicketAggregated) =>
    enums.matchFn(word, row) ||
    DataTable.fuzzyMatchFn(['comment', 'repairDescription'], word, row) ||
    matchDateWithoutTimestamp(word, row.startDate) ||
    matchDateWithoutTimestamp(word, row.endDate) ||
    enumsMatchUtil({
      enums: employeeEnumsQ.data,
      isOf: row.employeeId,
      includes: word,
    }) ||
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
    });

  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Tickets..."
        matchFn={filterSearchMatchFn}
        toInitSelected={(fromStore) =>
          // If the persisted search excludes the expected visible tickets
          fromStore &&
          expectedVisibleTickets?.some(
            (t) => !filterSearchMatchFn(fromStore, t),
          )
            ? ''
            : fromStore
        }
      />

      <DataTable.FilterPopover label="Customer" hasSearch>
        <DataTable.FilterMultiSelect
          filterKey="customer-id"
          enums={customerEnumsQ.data ?? []}
          toInitSelected={clearIfExcludesExpectedTicketsByProp('customerId')}
        />
      </DataTable.FilterPopover>

      <DataTable.FilterPopover label="Vehicles" hasSearch>
        <DataTable.FilterMultiSelect
          heading="Locations"
          filterKey="location-ids"
          enums={locationEnumsQ.data ?? []}
          toInitSelected={clearIfExcludesExpectedTicketsByProp('locationIds')}
        />
        <DataTable.FilterMultiSelect
          heading="Vehicles"
          filterKey="vehicle-ids"
          enums={vehicleEnumsQ.data ?? []}
          toInitSelected={(fromStore) =>
            vehicleIdToSelect ? [vehicleIdToSelect] : fromStore
          }
        />
      </DataTable.FilterPopover>

      <DataTable.FilterPopover label="Employee" hasSearch>
        <DataTable.FilterMultiSelect
          filterKey="employee-id"
          enums={employeeEnumsQ.data ?? []}
          toInitSelected={clearIfExcludesExpectedTicketsByProp('employeeId')}
        />
      </DataTable.FilterPopover>

      <DataTable.FilterPopover label="More" hasSearch>
        <DataTable.FilterMultiSelect
          heading="Status"
          filterKey="status"
          enums={enums.ticketStatus}
          toInitSelected={clearIfExcludesExpectedTicketsByProp('ticketStatus')}
        />
        <DataTable.FilterMultiSelect
          heading="Type"
          filterKey="type"
          enums={enums.ticketType}
          toInitSelected={clearIfExcludesExpectedTicketsByProp('ticketType')}
        />
      </DataTable.FilterPopover>

      <PortalFilterDate
        shouldClearPersistedState={!!expectedVisibleTickets}
        filterOptions={[
          {
            label: 'Start Date - End Date',
            dataKeyFrom: 'startDate',
            dataKeyTo: 'endDate',
          },
          { label: 'Created At', dataKeyFrom: 'createdAt' },
          { label: 'Edited At', dataKeyFrom: 'updatedAt' },
        ]}
      />
    </>
  );
}
