import { z } from 'zod';
import { reqString } from '@data/form';
import { Shop } from '@data/webedit/shop/types';

export const initShop: Partial<Shop> = {
  imageUrl: '',
};

export const shopZ = z.object({
  name: reqString('Name'),
  address: reqString('Address'),

  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imageUrl: z.string().nullable().optional(),
  openHours: z
    .object({
      mon: z.string().nullable().optional(),
      tue: z.string().nullable().optional(),
      wed: z.string().nullable().optional(),
      thu: z.string().nullable().optional(),
      fri: z.string().nullable().optional(),
      sat: z.string().nullable().optional(),
      sun: z.string().nullable().optional(),
    })
    .optional(),
  hasTemporaryHours: z.boolean().optional(),
  locationId: z.coerce.number().optional(),
  bodyText: z.string().optional(),
});
