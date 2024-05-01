import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from '../api';
import { Vehicle, VehicleType } from './types';

// GET LIST

export interface GetVehiclesRes {
  vehicles: Vehicle[];
}

export const createGetVehicles = () => ({
  queryKey: ['vehicles'],
  queryFn: () =>
    instance
      .get<GetVehiclesRes>(endpoints.vehicle)
      .then((res) => res.data.vehicles.map(parseResponseData) as Vehicle[])
      .catch(createErrorHandler(endpoints.vehicle)),
});

// GET ONE

export type GetVehicleRes = Vehicle;
export interface GetVehicleParams {
  id: string;
}

export const createGetVehicle = ({ id }: GetVehicleParams) => ({
  queryKey: ['vehicle', id],
  queryFn: () =>
    instance
      .get<GetVehicleRes>(`${endpoints.vehicle}/${id}`)
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});

// CREATE

export type CreateVehicleRes = Vehicle;
export type CreateVehicleParams = Omit<Vehicle, 'id'>;

const toVehicleUrl = (vehicleType: string) =>
  endpoints.vehicle +
  ({
    [VehicleType.BIKE]: '/bike',
    [VehicleType.STROLLER]: '/stroller',
    [VehicleType.BATCH]: '/batch',
  }[vehicleType] ?? '');

export const createCreateVehicle = () => ({
  mutationFn: (body: CreateVehicleParams) =>
    instance
      .post<CreateVehicleRes>(toVehicleUrl(body.vehicleType))
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});

// UPDATE

export type EditVehicleRes = Vehicle;
export type EditVehicleParams = Vehicle;

export const createEditVehicle = () => ({
  mutationFn: (body: EditVehicleParams) =>
    instance
      .put<EditVehicleRes>(toVehicleUrl(body.vehicleType), body)
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});

// DELETE

export const createDeleteVehicle = () => ({
  mutationFn: (id: string) =>
    instance
      .delete<GetVehicleRes>(`${endpoints.vehicle}/${id}`)
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});
