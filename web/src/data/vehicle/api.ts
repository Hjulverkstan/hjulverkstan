import { createErrorHandler, endpoints, instance } from '../api';
import { ListResponse } from '../types';

import { Vehicle, VehicleStatus } from './types';

// GET ALL

export type GetVehiclesRes = ListResponse<Vehicle>;

export const createGetVehicles = () => ({
  queryKey: [endpoints.vehicle],
  queryFn: () =>
    instance
      .get<GetVehiclesRes>(endpoints.vehicle)
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.vehicle)),
});

// GET

export type GetVehicleRes = Vehicle;
export interface GetVehicleParams {
  id: string;
}

export const createGetVehicle = ({ id }: GetVehicleParams) => ({
  queryKey: [endpoints.vehicle, id],
  queryFn: () =>
    instance
      .get<GetVehicleRes>(`${endpoints.vehicle}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.vehicle)),
});

// CREATE

export type CreateVehicleRes = Vehicle;
export type CreateVehicleParams = Omit<Vehicle, 'id'>;

export const createCreateVehicle = () => ({
  mutationFn: (body: CreateVehicleParams) =>
    instance
      .post<CreateVehicleRes>(endpoints.vehicle, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.vehicle)),
});

// EDIT

export type EditVehicleRes = Vehicle;
export type EditVehicleParams = Vehicle;

export const createEditVehicle = () => ({
  mutationFn: ({ id, ...body }: EditVehicleParams) =>
    instance
      .put<EditVehicleRes>(`${endpoints.vehicle}/${id}`, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.vehicle)),
});

// EDIT STATUS

export type EditVehicleStatusRes = Vehicle;
export interface EditVehicleStatusParams {
  id: string;
  vehicleStatus: VehicleStatus;
}

export const createUpdateVehicleStatus = () => ({
  mutationFn: ({ id, vehicleStatus }: EditVehicleStatusParams) =>
    instance
      .put<EditVehicleStatusRes>(`${endpoints.vehicle}/${id}/status`, {
        vehicleStatus,
      })
      .then((res) => res.data)
      .catch(createErrorHandler(`${endpoints.vehicle}/${id}/status`)),
});

// DELETE

export const createDeleteVehicle = () => ({
  mutationFn: (id: string) =>
    instance
      .delete(`${endpoints.vehicle}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.vehicle)),
});
