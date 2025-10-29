import { useQuery } from '@tanstack/react-query';

import * as C from '@utils/common';
import { useAggregatedQueries } from '@hooks/useAggregatedQueries';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';

import * as siteApi from '../site/api';
import { Warning } from '../warning/types';
import { useTicketsQ } from '../ticket/queries';
import { TicketStatus } from '../ticket/types';
import { StandardError } from '../api';
import { EnumAttributes } from '../types';

import * as api from './api';
import * as enumsRaw from './enums';
import { Vehicle, VehicleAggregated, VehicleType } from './types';
import { findEnum } from '@utils/enums';

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
          ticketTypes: C.uniq(
            vehicleTickets.map((ticket) => ticket.ticketType),
          ),
          ticketStatuses: C.uniq(
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
}: UseVehiclesAsEnumsQProps = {}) => {
  const enums = useTranslateRawEnums(enumsRaw);

  return useQuery<Vehicle[], StandardError, EnumAttributes[]>({
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
          icon: findEnum(enums, vehicle.vehicleType).icon,
          label:
            vehicle.vehicleType === VehicleType.BATCH
              ? 'Batch'
              : vehicle.regTag || `#${vehicle.id}`,
          value: vehicle.id,
        })) ?? [],
  });
};

//

export interface UsePublicVehiclesByLocationQProps {
  locationId?: string;
}

export const usePublicVehiclesByLocationQ = ({
  locationId,
}: UsePublicVehiclesByLocationQProps) =>
  useQuery<Vehicle[], StandardError>({
    ...siteApi.createGetPublicVehiclesByLocation({ locationId }),
    enabled: !!locationId,
  });

//

export interface UsePublicVehicleByIdQProps {
  id: string;
}

export const usePublicVehicleByIdQ = ({ id }: UsePublicVehicleByIdQProps) =>
  useQuery<Vehicle, StandardError>({
    ...siteApi.createGetPublicVehicleById({ id }),
  });
