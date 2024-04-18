import { useQuery } from 'react-query';

import * as enums from '@enums';
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

export const useLocations = () =>
  useQuery<api.Location[], api.ErrorRes>(api.createGetLocations());

export const useLocationsAsEnums = () =>
  useQuery<api.Location[], api.ErrorRes, enums.EnumAttributes[]>({
    ...api.createGetLocations(),
    select: (locations) =>
      locations.map((location) => {
        const { icon } = enums.location.locationType.find(
          (e) => e.value === location.locationType,
        )!;

        return { icon, name: location.name, value: location.id };
      }) ?? [],
  });

//

export interface VehicleAggregated extends api.Vehicle {
  location: api.Location;
  tickets: Array<{
    id: string;
    isOpen: boolean;
    ticketType: api.TicketType;
    customerFirstName?: string;
  }>;
}

export const useVehiclesAggregated = () =>
  useAggregatedQueries(
    (vehicles, tickets, customers, locations): VehicleAggregated[] =>
      vehicles.map((vehicle) => ({
        ...vehicle,
        location: locations.find(
          (location) => location.id === vehicle.locationId,
        )!,
        tickets: vehicle.ticketIds
          .map((ticketId) => tickets.find((ticket) => ticket.id === ticketId)!)
          .map((ticket) => ({
            id: ticket.id,
            isOpen: ticket.isOpen,
            ticketType: ticket.ticketType,
            customerFirstName: customers.find(
              (customer) => customer.id === ticket.customerId,
            )?.firstName,
          })),
      })),
    [useVehicles(), useTickets(), useCustomers(), useLocations()],
  );
