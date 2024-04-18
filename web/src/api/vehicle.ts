import { instance, endpoints, createErrorHandler, parseResponseData } from './';

/* * * * * * * * VEHICLE * * * * * * * */

export enum VehicleType {
  BIKE = 'BIKE',
  STROLLER = 'STROLLER',
  BATCH = 'BATCH',
  SKATE = 'SKATE',
  OTHER = 'OTHER',
  SCOOTER = 'SCOOTER',
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

export enum StrollerType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
}

export enum BikeBrand {
  MONARK = 'MONARK',
  SKEPPSHULT = 'SKEPPSHULT',
  YOSEMITE = 'YOSEMITE',
  CRESCENT = 'CRESCENT',
  SPECIALIZED = 'SPECIALIZED',
  NISHIKI = 'NISHIKI',
  SJOSALA = 'SJÖSALA',
  KRONAN = 'KRONAN',
  PELAGO = 'PELAGO',
  BIANCHI = 'BIANCHI',
  OTHER = 'OTHER',
}

export interface Vehicle {
  id: string;
  vehicleType: VehicleType;
  vehicleStatus: VehicleStatus;
  imageURL: string;
  comment: string;
  ticketIds: string[];
  regTag: string;
  locationId: string;
  //
  strollerType?: StrollerType;
  //
  bikeType?: BikeType;
  size?: BikeSize;
  brakeType?: BrakeType;
  gearCount?: number;
  brand?: BikeBrand;
  //
  batchCount?: number;
  //
  createdAt: number | null;
  updatedAt: number | null;
  createdBy: number | null;
  updatedBy: number | null;
}

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

const toVehicleUrl = (vehicleType: VehicleType, id?: string) => {
  const slug = {
    [VehicleType.BIKE]: '/bike',
    [VehicleType.STROLLER]: '/stroller',
    [VehicleType.BATCH]: '/batch',
  }[vehicleType];

  return endpoints.vehicle + (slug ?? '') + (id ? `/${id}` : '');
};

export const createVehicle = () => ({
  mutationFn: (body: CreateVehicleParams) =>
    instance
      .post<CreateVehicleRes>(toVehicleUrl(body.vehicleType), body)
      .then((res) => parseResponseData(res.data) as Vehicle)
      .catch(createErrorHandler(endpoints.vehicle)),
});

//

export type EditVehicleRes = Vehicle;

export type EditVehicleParams = Vehicle;

export const editVehicle = () => ({
  mutationFn: (body: EditVehicleParams) =>
    instance
      .put<EditVehicleRes>(toVehicleUrl(body.vehicleType, body.id), body)
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
