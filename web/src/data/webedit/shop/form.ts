import { z } from 'zod';

import { reqString } from '../../form';
import { Shop } from './types';
import { LocaleAndGlobal } from '@data/webedit/types';

export const initShop: Partial<Shop> = {
  hasTemporaryHours: false,
};

export const createShopZ = (locale: LocaleAndGlobal) =>
  z.object({
    name: reqString('Name'),
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

    ...(locale
      ? {
          bodyText: z.string().optional(),
        }
      : {}),
  });
