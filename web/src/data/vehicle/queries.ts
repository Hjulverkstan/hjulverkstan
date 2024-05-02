import { useQuery } from 'react-query';

import { useAggregatedQueries } from '@hooks/useAggregatedQueries';

import { useTicketsQ } from '../ticket/queries';
import { useCustomersQ } from '../customer/queries';
import { useLocationsQ } from '../location/queries';
import { ErrorRes } from '../api';
import { EnumAttributes } from '../enums';
import { Vehicle, VehicleAggregated } from './types';
import * as enums from './enums';
import * as api from './api';

//

export const useVehiclesQ = () =>
  useQuery<Vehicle[], ErrorRes>(api.createGetVehicles());

//

export interface UseVehicleProps {
  id?: string;
}

export const useVehicleQ = ({ id }: UseVehicleProps) =>
  useQuery<Vehicle, ErrorRes>({
    ...(id ? api.createGetVehicle({ id }) : {}),
    enabled: !!id,
  });

//

export const useVehiclesAggregatedQ = () =>
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
    [useVehiclesQ(), useTicketsQ(), useCustomersQ(), useLocationsQ()],
  );

//

export const useVehiclesAsEnumsQ = ({ dataKey = 'vehicleId' } = {}) =>
  useQuery<Vehicle[], ErrorRes, EnumAttributes[]>({
    ...api.createGetVehicles(),
    select: (vehicles) =>
      vehicles?.map((vehicle) => ({
        dataKey,
        icon: enums.find(vehicle.vehicleType).icon,
        name: vehicle.regTag,
        value: vehicle.id,
      })) ?? [],
  });
