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

export const minBatchCount = 1;

export const vehicleBaseZ = z.object({
  vehicleType: z.nativeEnum(api.VehicleType, isReq('Vehicle type')),
  locationId: z.string(isReq('Location')),
});

const commonProps = {
  vehicleStatus: z.nativeEnum(api.VehicleStatus, isReq('Status')),
  regTag: z.string(isReq('Reg Tag')).min(1, { message: 'Reg Tag is required' }),
};

export const vehicleZ = z.discriminatedUnion('vehicleType', [
  vehicleBaseZ.extend({
    ...commonProps,
    vehicleType: z.literal(api.VehicleType.BIKE),
    bikeType: z.nativeEnum(api.BikeType, isReq('Bike Type')),
    brakeType: z.nativeEnum(api.BrakeType, isReq('Brake Type')),
    size: z.nativeEnum(api.BikeSize, isReq('Size')),
    brand: z.nativeEnum(api.BikeBrand, isReq('Brand')),
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
    vehicleType: z.literal(api.VehicleType.STROLLER),
    strollerType: z.nativeEnum(api.StrollerType, isReq('Stroller Type')),
  }),
  vehicleBaseZ.extend({
    ...commonProps,
    vehicleType: z.literal(api.VehicleType.SCOOTER),
  }),
  vehicleBaseZ.extend({
    vehicleType: z.literal(api.VehicleType.BATCH),
    batchCount: z.number(isReq('Batch Count')).min(minBatchCount, {
      message: 'Minimum batch count is 1',
    }),
  }),
  vehicleBaseZ.extend({
    ...commonProps,
    vehicleType: z.literal(api.VehicleType.SKATE),
  }),
  vehicleBaseZ.extend({
    ...commonProps,
    vehicleType: z.literal(api.VehicleType.OTHER),
  }),
]);

export const initVehicle: Partial<api.Vehicle> = {
  vehicleType: api.VehicleType.BIKE,
  vehicleStatus: api.VehicleStatus.UNAVAILABLE,
  ticketIds: [],
};
