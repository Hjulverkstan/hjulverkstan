import { z } from 'zod';

import { isReq } from '../form';
import {
  BikeBrand,
  BikeSize,
  BikeType,
  BrakeType,
  StrollerType,
  Vehicle,
  VehicleStatus,
  VehicleType,
} from './types';

//

export const initVehicle: Partial<Vehicle> = {
  vehicleType: VehicleType.BIKE,
  vehicleStatus: VehicleStatus.UNAVAILABLE,
  ticketIds: [],
};

// Vehicle

export const minGearCount = 1;
export const maxGearCount = 33;
export const minBatchCount = 1;

const vehicleBaseZ = z.object({
  vehicleType: z.nativeEnum(VehicleType, isReq('Vehicle type')),
  locationId: z.string(isReq('Location')),
});

const commonProps = {
  vehicleStatus: z.nativeEnum(VehicleStatus, isReq('Status')),
  regTag: z.string(isReq('Reg Tag')).min(1, { message: 'Reg Tag is required' }),
};

export const vehicleZ = z.discriminatedUnion(
  'vehicleType',
  [
    vehicleBaseZ.extend({
      ...commonProps,
      vehicleType: z.literal(VehicleType.BIKE),
      bikeType: z.nativeEnum(BikeType, isReq('Bike Type')),
      brakeType: z.nativeEnum(BrakeType, isReq('Brake Type')),
      size: z.nativeEnum(BikeSize, isReq('Size')),
      brand: z.nativeEnum(BikeBrand, isReq('Brand')),
      gearCount: z
        .number(isReq('Gear Count'))
        .min(minGearCount, {
          message: 'Minimum gear count is 1 (if no gears choose 1)',
        })
        .max(maxGearCount, {
          message: 'Maximum gear count is 33',
        }),
    }),
    vehicleBaseZ.extend({
      ...commonProps,
      vehicleType: z.literal(VehicleType.STROLLER),
      strollerType: z.nativeEnum(StrollerType, isReq('Stroller Type')),
    }),
    vehicleBaseZ.extend({
      ...commonProps,
      vehicleType: z.literal(VehicleType.SCOOTER),
    }),
    vehicleBaseZ.extend({
      vehicleType: z.literal(VehicleType.BATCH),
      batchCount: z.number(isReq('Batch Count')).min(minBatchCount, {
        message: 'Minimum batch count is 1',
      }),
    }),
    vehicleBaseZ.extend({
      ...commonProps,
      vehicleType: z.literal(VehicleType.SKATE),
    }),
    vehicleBaseZ.extend({
      ...commonProps,
      vehicleType: z.literal(VehicleType.OTHER),
    }),
  ],
  isReq('Vehicle type'),
);
