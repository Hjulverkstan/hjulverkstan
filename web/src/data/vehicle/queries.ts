import { useQuery } from '@tanstack/react-query';

import { StandardError } from '../api';
import { EnumAttributes } from '../enums';
import * as api from './api';
import * as enums from './enums';
import * as U from '@utils';
import { Vehicle, VehicleType, VehicleAggregated } from './types';
import { Warning } from '@data/warning/types';
import { useTicketsQ } from '@data/ticket/queries';
import { useAggregatedQueries } from '@hooks/useAggregatedQueries';
import { TicketStatus } from '@data/ticket/types';

//

export const useVehiclesQ = () =>
  useQuery<Vehicle[], StandardError>(api.createGetVehicles());

//

export interface UseVehicleProps {
  id?: string;
}

export const useVehicleQ = ({ id }: UseVehicleProps) =>
  useQuery<Vehicle, StandardError>({
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
        const warnings: Warning[] =
          vehicle.isCustomerOwned && vehicleTickets.length === 0
            ? [Warning.ORPHAN]
            : [];
        return {
          ...vehicle,
          ticketTypes: U.uniq(
            vehicleTickets.map((ticket) => ticket.ticketType),
          ),
          ticketStatuses: U.uniq(
            vehicleTickets
              .map((ticket) => ticket.ticketStatus)
              .filter((status): status is TicketStatus => status !== undefined),
          ),
          warnings,
        };
      }),
    [useVehiclesQ(), useTicketsQ()],
  );

export interface UseVehiclesAsEnumsQProps {
  dataKey?: string;
  filterCustomerOwned?: boolean;
}

export const useVehiclesAsEnumsQ = ({
  dataKey = 'vehicleId',
  filterCustomerOwned,
}: UseVehiclesAsEnumsQProps = {}) =>
  useQuery<Vehicle[], StandardError, EnumAttributes[]>({
    ...api.createGetVehicles(),
    select: (vehicles) =>
      vehicles
        ?.filter((vehicle) =>
          filterCustomerOwned === undefined
            ? true
            : filterCustomerOwned
              ? !vehicle.isCustomerOwned
              : vehicle.isCustomerOwned,
        )
        .map((vehicle) => ({
          dataKey,
          icon: enums.find(vehicle.vehicleType).icon,
          label:
            vehicle.vehicleType === VehicleType.BATCH
              ? 'Batch'
              : vehicle.regTag || `#${vehicle.id}`,
          value: vehicle.id,
        })) ?? [],
  });
