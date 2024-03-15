import { z } from 'zod';

import * as API from '@api';

export const vehicleZ = z.object({
  vehicleType: z.nativeEnum(API.VehicleType),
  vehicleStatus: z.nativeEnum(API.VehicleStatus),
});

export const initVehicle: Partial<API.Vehicle> = {
  vehicleType: API.VehicleType.BIKE,
  vehicleStatus: API.VehicleStatus.UNAVAILABLE,
};
