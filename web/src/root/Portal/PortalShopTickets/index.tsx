import { useLocation, useParams } from 'react-router-dom';

import { useCustomersQ } from '@data/customer/queries';
import { useEmployeesQ } from '@data/employee/queries';
import { useVehiclesQ } from '@data/vehicle/queries';
import { useLocationsQ } from '@data/location/queries';
import { initTicket, ticketZ } from '@data/ticket/form';
import { useCreateTicketM, useEditTicketM } from '@data/ticket/mutations';
import { useTicketQ, useTicketsAggregatedQ } from '@data/ticket/queries';

import * as DataTable from '@components/DataTable';
import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';

import PortalContent from '../PortalContent';
import PortalForm from '../PortalForm';
import PortalTable from '../PortalTable';
import PortalToolbar from '../PortalToolbar';
import { PageContentProps } from '..';

import ShopTicketsActions from './ShopTicketsActions';
import ShopTicketsFilters from './ShopTicketsFilters';
import ShopTicketsFields from './ShopTicketsFields';
import useColumns from './useColumns';
import { Ticket, TicketType } from '@data/ticket/types';
import {
  VehicleShortcutAction,
  VehicleShortcutLocationState,
} from '../PortalShopInventory/ShopInventoryActions';

//

export default function PortalShopTickets({ mode }: PageContentProps) {
  const { id = '' } = useParams();
  const locationState = useLocation().state as VehicleShortcutLocationState;

  const shouldInjectWithVehicleId =
    locationState?.action === VehicleShortcutAction.CREATE_TICKET;

  const initTicketInjected = shouldInjectWithVehicleId
    ? { ...initTicket, vehicleIds: [locationState?.vehicleId] }
    : initTicket;

  const ticketsQ = useTicketsAggregatedQ();
  const ticketQ = useTicketQ({ id });
  const createTicketM = useCreateTicketM();
  const editTicketM = useEditTicketM();

  // Handle errors and loading here for queries used in columns, filters and
  // fields.
  const locationsQ = useLocationsQ();
  const customersQ = useCustomersQ();
  const employeesQ = useEmployeesQ();
  const vehiclesQ = useVehiclesQ();

  const tableQueries = [
    ticketsQ,
    locationsQ,
    customersQ,
    employeesQ,
    vehiclesQ,
  ];

  const isLoading = tableQueries.some((query) => query.isLoading);
  const error = tableQueries.find((query) => !!query.error)?.error;

  const columns = useColumns();

  return (
    <DataTable.Provider
      key="tickets"
      tableKey="tickets"
      disabled={mode && mode !== Mode.READ}
      data={ticketsQ.data}
    >
      <PortalToolbar dataLabel="ticket">
        <ShopTicketsFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={ShopTicketsActions}
          columns={columns}
          isLoading={isLoading}
          error={error}
          mode={mode}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={ticketQ.isLoading || locationsQ.isLoading}
            data={ticketQ.data}
            zodSchema={ticketZ}
            initCreateBody={initTicketInjected}
          >
            <PortalForm
              dataLabel="Ticket"
              toToolbarName={(body: Ticket) => body.id && `Ticket #${body.id}`}
              disableEdit={
                (ticketQ.data?.ticketType === TicketType.DONATE &&
                  'Donate tickets cannot be edited') ||
                (ticketQ.data?.ticketType === TicketType.RECEIVE &&
                  'Receive tickets cannot be edited')
              }
              error={ticketQ.error || locationsQ.error}
              isSubmitting={createTicketM.isPending || editTicketM.isPending}
              saveMutation={editTicketM.mutateAsync}
              createMutation={createTicketM.mutateAsync}
            >
              <ShopTicketsFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
