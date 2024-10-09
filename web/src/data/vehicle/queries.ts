import { useQuery } from '@tanstack/react-query';

import { ErrorRes } from '../api';
import { EnumAttributes } from '../enums';
import * as api from './api';
import * as enums from './enums';
import * as U from '@utils';
import { Vehicle, VehicleType, VehicleAggregated } from './types';
import { useTicketsQ } from '@data/ticket/queries';
import { useAggregatedQueries } from '@hooks/useAggregatedQueries';

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
    (vehicles, tickets): VehicleAggregated[] =>
      vehicles.map((vehicle) => {
        const vehicleTickets = tickets.filter((ticket) =>
          vehicle.ticketIds.includes(ticket.id),
        );

        return {
          ...vehicle,
          ticketTypes: U.uniq(
            vehicleTickets.map((ticket) => ticket.ticketType),
          ),
          ticketStatuses: U.uniq(
            vehicleTickets.map((ticket) => ticket.ticketStatus),
          ),
        };
      }),
    [useVehiclesQ(), useTicketsQ()],
  );

export const useVehiclesAsEnumsQ = ({ dataKey = 'vehicleId' } = {}) =>
  useQuery<Vehicle[], ErrorRes, EnumAttributes[]>({
    ...api.createGetVehicles(),
    select: (vehicles) =>
      vehicles?.map((vehicle) => ({
        dataKey,
        icon: enums.find(vehicle.vehicleType).icon,
        label:
          vehicle.vehicleType === VehicleType.BATCH ? 'Batch' : vehicle.regTag,
        value: vehicle.id,
      })) ?? [],
  });
