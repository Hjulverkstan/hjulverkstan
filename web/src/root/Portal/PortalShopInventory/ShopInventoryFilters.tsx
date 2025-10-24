import * as enumsRaw from '@data/vehicle/enums';

import * as DataTable from '@components/DataTable';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { useTicketsAsEnumsQ } from '@data/ticket/queries';
import { Vehicle } from '@data/vehicle/types';
import { PortalFilterDate } from '../PortalFilterDate';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { matchEnumsBy, matchEnumsOnRow } from '@utils/enums';

export default function ShopInventoryFilters() {
  const locationEnumsQ = useLocationsAsEnumsQ();
  const ticketEnumsQ = useTicketsAsEnumsQ();
  const enums = useTranslateRawEnums<typeof enumsRaw>(enumsRaw);

  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Inventory..."
        matchFn={(word: string, row: Vehicle) =>
          matchEnumsOnRow(enums, word, row) ||
          DataTable.fuzzyMatchFn(['comment', 'regTag'], word, row) ||
          word === String(row.gearCount) ||
          matchEnumsBy({
            enums: ticketEnumsQ.data,
            isOf: row.ticketIds,
            startsWith: word,
          }) ||
          matchEnumsBy({
            enums: locationEnumsQ.data,
            isOf: row.locationId,
            startsWith: word,
          })
        }
      />

      <DataTable.FilterPopover label="Type">
        <DataTable.FilterMultiSelect
          heading="Vehicle type"
          filterKey="vehicle-type"
          enums={[
            ...enums.vehicleType,
            ...enums.bikeType,
            ...enums.strollerType,
          ]}
        />
        <DataTable.FilterMultiSelect
          heading="Ownership"
          filterKey="ownership-type"
          enums={[...enums.isCustomerOwned]}
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

      <DataTable.FilterPopover label="Ticket">
        <DataTable.FilterMultiSelect
          heading="Ticket type"
          filterKey="ticket-type"
          enums={enums.ticketTypes}
        />
        <DataTable.FilterMultiSelect
          heading="Ticket status"
          filterKey="ticket-status"
          enums={enums.ticketStatuses}
        />
      </DataTable.FilterPopover>

      <DataTable.FilterPopover label="Details" hasSearch>
        <DataTable.FilterSlider
          filterKey="gears"
          dataKey="gearCount"
          heading="Gear Count"
        />
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

      <PortalFilterDate
        filterOptions={[
          { label: 'Created At', dataKeyFrom: 'createdAt' },
          { label: 'Edited At', dataKeyFrom: 'updatedAt' },
        ]}
      />
    </>
  );
}
