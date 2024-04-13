import { instance, endpoints, createErrorHandler, parseResponseData } from './';

/* * * * * * * * VEHICLE * * * * * * * */

export enum VehicleType {
  BIKE = 'BIKE',
  SKATE = 'SKATE',
  STROLLER = 'STROLLER',
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  BROKEN = 'BROKEN',
}

export enum BrakeType {
  FOOTBRAKE = 'FOOTBRAKE',
  CALIPER = 'CALIPER',
  DISC = 'DISC',
}

export enum BikeSize {
  EXTRA_SMALL = 'EXTRA_SMALL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  EXTRA_LARGE = 'EXTRA_LARGE',
}

export enum BikeType {
  MOUNTAINBIKE = 'MOUNTAINBIKE',
  ROAD = 'ROAD',
  CHILD = 'CHILD',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  BMX = 'BMX',
  LADY = 'LADY',
}

export type Vehicle = {
  id: string;
  vehicleType: VehicleType;
  vehicleStatus: VehicleStatus;
  imageUrl: string;
  comment: string;
  ticketIds: string[];
  createdAt: number | null;
  updatedAt: number | null;
  createdBy: number | null;
  updatedBy: number | null;
} & {
  vehicleType: VehicleType.BIKE;
  size: BikeSize;
  bikeType: BikeType;
  brakeType: BrakeType;
  gearCount: number;
};

//

export interface GetVehiclesRes {
  vehicles: Vehicle[];
}

export const getVehicles = () => ({
  queryKey: ['vehicles'],
  queryFn: () =>
    instance
      .get<GetVehiclesRes>(endpoints.vehicle)
      .then((res) => res.data.vehicles.map(parseResponseData) as Vehicle[])
      .catch(createErrorHandler(endpoints.vehicle)),
});

//

export type GetVehicleRes = Vehicle;

export interface GetVehicleParams {
  id: string;
}

export const getVehicle = ({ id }: GetVehicleParams) => ({
  queryKey: ['vehicle', id],
  queryFn: () =>
    instance
      .get<GetVehicleRes>(`${endpoints.vehicle}/${id}`)
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});

//

export type CreateVehicleRes = Vehicle;

export type CreateVehicleParams = Omit<Vehicle, 'id'>;

const vehicleSlugMap = {
  [VehicleType.BIKE]: 'bike',
  [VehicleType.STROLLER]: 'stroller',
  [VehicleType.SKATE]: 'skate',
};

export const createVehicle = () => ({
  mutationFn: (body: CreateVehicleParams) =>
    instance
      .post<CreateVehicleRes>(
        `${endpoints.vehicle}/${vehicleSlugMap[body.vehicleType]}`,
        body,
      )
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});

//

export type EditVehicleRes = Vehicle;

export type EditVehicleParams = Vehicle;

export const editVehicle = () => ({
  mutationFn: (body: EditVehicleParams) =>
    instance
      .put<EditVehicleRes>(
        `${endpoints.vehicle}/${vehicleSlugMap[body.vehicleType]}/${body.id}?edit`,
        body,
      )
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});

export const deleteVehicle = () => ({
  mutationFn: (id: string) =>
    instance
      .delete<GetVehicleRes>(`${endpoints.vehicle}/${id}`)
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});
