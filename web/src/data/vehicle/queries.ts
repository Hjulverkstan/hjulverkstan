import { useQuery } from '@tanstack/react-query';

import { ErrorRes } from '../api';
import { EnumAttributes } from '../enums';
import * as api from './api';
import * as enums from './enums';
import { Vehicle, VehicleType } from './types';

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
