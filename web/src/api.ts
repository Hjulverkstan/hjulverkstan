import axios from 'axios';

const baseURL = 'http://localhost:8080';
const instance = axios.create({ baseURL, timeout: 5000 });

const endpoints = {
  vehicle: '/vehicle',
};

// type QueryParamsCreator<Res, Params = undefined> = (params: Params) => {
//   queryKey: string[];
//   queryFn: () => Promise<Res>;
// };

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

const withIdAsString = (obj: Record<string, any>) => ({
  ...obj,
  id: String(obj.id),
});

//

export interface GetVehiclesRes {
  vehicles: Vehicle[];
}

export const getVehicles = () => ({
  queryKey: ['vehicles'],
  queryFn: async () =>
    await instance
      .get<GetVehiclesRes>(endpoints.vehicle)
      .then((res) => res.data.vehicles.map(withIdAsString) as Vehicle[]),
});

//

export type GetVehicleRes = Vehicle;

export interface GetVehicleParams {
  id: string;
}

export const getVehicle = ({ id }: GetVehicleParams) => ({
  queryKey: ['vehicle', id],
  queryFn: async () =>
    await instance
      .get<GetVehicleRes>(`${endpoints.vehicle}/${id}`)
      .then((res) => withIdAsString(res.data) as Vehicle),
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
  mutationFn: async (body: CreateVehicleParams) =>
    await instance
      .post<CreateVehicleRes>(
        `${endpoints.vehicle}/${vehicleSlugMap[body.vehicleType]}`,
        body,
      )
      .then((res) => withIdAsString(res.data) as Vehicle),
});

//

export type EditVehicleRes = Vehicle;

export type EditVehicleParams = Vehicle;

export const editVehicle = () => ({
  mutationFn: async (body: EditVehicleParams) =>
    await instance
      .put<EditVehicleRes>(
        `${endpoints.vehicle}/${vehicleSlugMap[body.vehicleType]}/${body.id}?edit`,
        body,
      )
      .then((res) => withIdAsString(res.data) as Vehicle),
});
