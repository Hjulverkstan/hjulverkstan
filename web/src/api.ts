import axios from 'axios';

import * as U from '@utils';

const baseURL = 'http://localhost:8080';
const instance = axios.create({ baseURL });

const endpoints = {
  vehicle: '/vehicle',
};

//

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

export interface GetVehiclesRes {
  vehicles: Vehicle[];
}

export const getVehicles = {
  queryKey: ['vehicles'],
  queryFn: async () =>
    await instance
      .get(endpoints.vehicle)
      .then((res) => res.data.vehicles.map(U.toCamelCaseObj)),
};
