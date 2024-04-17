import { z } from 'zod';

import * as api from '@api';

//

const withErrMsg = (message: string) => ({
  errorMap: (issue: any) => ({ ...issue, message }),
});

const isReq = (dataLabel: string) => withErrMsg(`${dataLabel} is required.`);

// Vehicle

export const minGearCount = 1;
export const maxGearCount = 33;

export const vehicleBaseZ = z.object({
  vehicleType: z.nativeEnum(api.VehicleType, isReq('Vehicle type')),
  vehicleStatus: z.nativeEnum(api.VehicleStatus, isReq('Status')),
});

export const vehicleZ = z.discriminatedUnion('vehicleType', [
  vehicleBaseZ.extend({
    vehicleType: z.literal(api.VehicleType.BIKE),
    bikeType: z.nativeEnum(api.BikeType, isReq('Bike type')),
    brakeType: z.nativeEnum(api.BrakeType, isReq('Brake type')),
    size: z.nativeEnum(api.BikeSize, isReq('Size')),
    gearCount: z
      .number(isReq('Gear count'))
      .min(minGearCount, {
        message: 'Minimum gear count is 1 (if no gears choose 1)',
      })
      .max(maxGearCount, {
        message: 'Maximum gear count is 33',
      }),
  }),
  vehicleBaseZ.extend({
    vehicleType: z.literal(api.VehicleType.STROLLER),
    strollerType: z.nativeEnum(api.StrollerType, isReq('Stroller type')),
  }),
  vehicleBaseZ.extend({
    vehicleType: z.literal(api.VehicleType.SCOOTER),
  }),
]);

export const initVehicle: Partial<api.Vehicle> = {
  vehicleType: api.VehicleType.BIKE,
  vehicleStatus: api.VehicleStatus.UNAVAILABLE,
};
