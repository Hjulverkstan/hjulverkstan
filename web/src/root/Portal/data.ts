import { z } from 'zod';

import * as api from '@api';

export const vehicleZ = z.object({
  vehicleType: z.nativeEnum(api.VehicleType),
  vehicleStatus: z.nativeEnum(api.VehicleStatus),
});

export const initVehicle: Partial<api.Vehicle> = {
  vehicleType: api.VehicleType.BIKE,
  vehicleStatus: api.VehicleStatus.UNAVAILABLE,
};
