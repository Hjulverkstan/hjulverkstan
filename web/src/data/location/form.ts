import { z } from 'zod';
import { reqString, isReq } from '../form';
import { Location, LocationType } from '@data/location/types';

export const initLocation = {
  vehicleIds: [],
} as Partial<Location>;

const locationBaseZ = z.object({
  locationType: z.nativeEnum(LocationType, isReq('Location type')),
  name: reqString('Name'),
  address: reqString('Address'),
});

export const locationZ = z.discriminatedUnion(
  'locationType',
  [
    locationBaseZ.extend({
      locationType: z.literal(LocationType.SHOP),
    }),
    locationBaseZ.extend({
      locationType: z.literal(LocationType.STORAGE),
    }),
  ],
  isReq('Location type'),
);
