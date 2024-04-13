import { useQuery } from 'react-query';

import * as api from '@api';
import { useAggregatedQueries } from '@hooks/useAggregatedQueries';

//

export const useVehicles = () =>
  useQuery<api.Vehicle[], api.ErrorRes>(api.getVehicles());

export interface UseVehicleParams {
  id?: string;
}

export const useVehicle = ({ id }: UseVehicleParams) =>
  useQuery<api.Vehicle, api.ErrorRes>({
    ...(id ? api.getVehicle({ id }) : {}),
    enabled: !!id,
  });

export const useTickets = () =>
  useQuery<api.Ticket[], api.ErrorRes>(api.createGetTickets());

export const useCustomers = () =>
  useQuery<api.Customer[], api.ErrorRes>(api.createGetCustomers());

//

export interface VehicleAggregated extends api.Vehicle {
  tickets: Array<{
    isOpen: boolean;
    ticketType: api.TicketType;
    customerFirstName?: string;
  }>;
}

export const useVehiclesAggregated = () =>
  useAggregatedQueries(
    (vehicles, tickets, customers): VehicleAggregated[] =>
      vehicles.map((vehicle) => ({
        ...vehicle,
        tickets: vehicle.ticketIds
          .map((ticketId) => tickets.find((ticket) => ticket.id === ticketId)!)
          .map((ticket) => ({
            isOpen: ticket.isOpen,
            ticketType: ticket.ticketType,
            customerFirstName: customers.find(
              (customer) => customer.id === ticket.customerId,
            )?.firstName,
          })),
      })),
    [useVehicles(), useTickets(), useCustomers()],
  );
