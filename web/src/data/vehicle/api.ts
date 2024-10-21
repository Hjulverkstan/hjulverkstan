import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from '../api';
import { Vehicle, VehicleType, VehicleStatus } from './types';

// QUERIES

export interface GetVehiclesRes {
  vehicles: Vehicle[];
}

export const createGetVehicles = () => ({
  queryKey: ['vehicles'],
  queryFn: () =>
    instance
      .get<GetVehiclesRes>(endpoints.vehicle)
      .then(
        (res) =>
          res.data.vehicles.map(parseResponseData).reverse() as Vehicle[],
      )
      .catch(createErrorHandler(endpoints.vehicle)),
});

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

// MUTATIONS

const transformBody = ({
  isCustomerOwned,
  id,
  locationId,
  imageURL,
  ticketIds,
  comment,
  regTag,
  vehicleStatus,
  vehicleType,
  size,
  gearCount,
  brakeType,
  brand,
  bikeType,
  strollerType,
  batchCount,
}: Partial<Vehicle>) => ({
  isCustomerOwned,
  id,
  locationId: Number(locationId),
  imageURL,
  ticketIds,
  comment,
  vehicleType,
  ...(!isCustomerOwned && vehicleType !== VehicleType.BATCH ? { regTag } : {}),

  ...(vehicleType !== VehicleType.BATCH ? { vehicleStatus } : { batchCount }),
  ...(vehicleType === VehicleType.BIKE
    ? { size, gearCount, brakeType, brand, bikeType }
    : {}),
  ...(vehicleType === VehicleType.STROLLER ? { strollerType } : {}),
});

const toVehicleUrl = (vehicleType: string, vehicleId?: string) =>
  endpoints.vehicle +
  ({
    [VehicleType.BIKE]: '/bike',
    [VehicleType.STROLLER]: '/stroller',
    [VehicleType.BATCH]: '/batch',
  }[vehicleType] ?? '') +
  (vehicleId ? `/${vehicleId}` : '');

//

export type CreateVehicleRes = Vehicle;
export type CreateVehicleParams = Omit<Vehicle, 'id'>;

export const createCreateVehicle = () => ({
  mutationFn: (body: CreateVehicleParams) =>
    instance
      .post<CreateVehicleRes>(
        toVehicleUrl(body.vehicleType),
        transformBody(body),
      )
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});

//

export type EditVehicleRes = Vehicle;
export type EditVehicleParams = Vehicle;

export const createEditVehicle = () => ({
  mutationFn: (body: EditVehicleParams) =>
    instance
      .put<EditVehicleRes>(
        toVehicleUrl(body.vehicleType, body.id),
        transformBody(body),
      )
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});

//

export const createDeleteVehicle = () => ({
  mutationFn: (id: string) =>
    instance
      .delete<GetVehicleRes>(`${endpoints.vehicle}/${id}`)
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});

export const createUpdateVehicleStatus = () => ({
  mutationFn: ({
    id,
    vehicleStatus,
  }: {
    id: string;
    vehicleStatus: VehicleStatus;
  }) =>
    instance
      .post<Vehicle>(`${endpoints.vehicle}/${id}/status`, {
        newStatus: vehicleStatus,
      })
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(`${endpoints.vehicle}/${id}/status`)),
});
