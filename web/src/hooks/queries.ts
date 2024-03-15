import * as api from '@api';
import { useQuery } from 'react-query';

export const useVehicles = () =>
  useQuery<api.Vehicle[], string>(api.getVehicles());

export interface UseVehicleParams {
  id?: string;
}

export const useVehicle = ({ id }: UseVehicleParams) =>
  useQuery<api.Vehicle, string>({
    ...(id ? api.getVehicle({ id }) : {}),
    enabled: !!id,
  });
