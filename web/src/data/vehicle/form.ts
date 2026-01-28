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
import { useMemo } from 'react';
import { useVehiclesQ } from '@data/vehicle/queries';
import { useParams } from 'react-router-dom';

//

export const initVehicle: Partial<Vehicle> = {
  vehicleType: VehicleType.BIKE,
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

export function useVehicleZ() {
  // Fetches the id parameter from the url, which would be the current vehicle.
  const { id = '' } = useParams();
  const vehiclesQ = useVehiclesQ();

  // If regTags possibly being undefined ends up as a problem, just add '?? []' at the end.
  const regTags = vehiclesQ.data
    ?.filter((vehicle) => vehicle.id !== id)
    .map((vehicle) => vehicle.regTag?.toLowerCase());

  return useMemo(() => {
    const commonProps = {
      isCustomerOwned: z.boolean(isReq('Ownership')),
      vehicleStatus: z.nativeEnum(VehicleStatus).optional(),
      regTag: z.string().optional(),
    };

    return z
      .discriminatedUnion(
        'vehicleType',
        [
          vehicleBaseZ.extend({
            ...commonProps,
            vehicleType: z.literal(VehicleType.BIKE),
            bikeType: z.nativeEnum(BikeType).optional(),
            brand: z.nativeEnum(BikeBrand).optional(),
            size: z.nativeEnum(BikeSize).optional(),
            brakeType: z.nativeEnum(BrakeType).optional(),
            gearCount: z
              .number()
              .min(minGearCount, {
                message: 'Minimum gear count is 1 (if no gears choose 1)',
              })
              .max(maxGearCount, {
                message: 'Maximum gear count is 33',
              })
              .optional(),
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
        isReq('Vehicle Type'),
      )
      .superRefine((data, ctx) => {
        /**
         * As the regTag validation is dependent on isCustomerOwned and one
         * seems to not be able to nest a discriminated union in another
         * discriminated union, we settle for using superRefine here instead.
         * The downside of this is that this validation is only applied all
         * validations in the schema are successful. Thus postponing the
         * validation in superRefine till the end of the user flow.
         */
        if (data.vehicleType === VehicleType.BATCH) return;

        if (!data.isCustomerOwned) {
          if (!data.vehicleStatus) {
            ctx.addIssue({
              code: 'custom',
              path: ['vehicleStatus'],
              message: 'Vehicle Status is required',
            });
          }

          if (!data.regTag) {
            ctx.addIssue({
              code: 'custom',
              path: ['regTag'],
              message: 'Reg Tag is required',
            });
          }

          if (data.vehicleType === VehicleType.BIKE) {
            if (!data.bikeType) {
              ctx.addIssue({
                code: 'custom',
                path: ['bikeType'],
                message: 'Bike Type is required',
              });
            }
            if (!data.size) {
              ctx.addIssue({
                code: 'custom',
                path: ['size'],
                message: 'Size is required',
              });
            }
            if (!data.brakeType) {
              ctx.addIssue({
                code: 'custom',
                path: ['brakeType'],
                message: 'Brake Type is required',
              });
            }
            if (data.gearCount === undefined || data.gearCount === null) {
              ctx.addIssue({
                code: 'custom',
                path: ['gearCount'],
                message: 'Gear Count is required',
              });
            }
          }
        }

        if (data.regTag && regTags?.includes(data.regTag.toLowerCase())) {
          ctx.addIssue({
            code: 'custom',
            path: ['regTag'],
            message: 'This Reg Tag is already in use.',
          });
        }
      });
  }, [regTags]);
}
