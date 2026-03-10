import { z } from 'zod';

import { reqString } from '../../form';
import { Shop } from './types';

export const initShop: Partial<Shop> = {
  hasTemporaryHours: false,
  openHours: {},
};

export const createShopZ = () =>
  z.object({
    name: reqString('Name'),
    slug: reqString('Slug'),
    address: reqString('Address'),
    locationId: z.coerce.number(),

    latitude: reqString('Latitude'),
    longitude: reqString('Longitude'),
    imageURL: z.string().optional().nullable(),
    openHours: z.object({
      mon: z.string().optional(),
      tue: z.string().optional(),
      wed: z.string().optional(),
      thu: z.string().optional(),
      fri: z.string().optional(),
      sat: z.string().optional(),
      sun: z.string().optional(),
    }),
    hasTemporaryHours: z.boolean(),
  });
