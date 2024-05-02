import { TicketType } from '../ticket/types';
import { Location } from '../location/types';

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

// This is aggregated in ./queries.ts

export interface VehicleAggregated extends Vehicle {
  location: Location;
  tickets: Array<{
    id: string;
    isOpen: boolean;
    ticketType: TicketType;
    customerFirstName?: string;
  }>;
}
