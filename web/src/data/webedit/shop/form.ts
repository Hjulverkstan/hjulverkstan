import { z } from 'zod';
import { reqString } from '@data/form';
import { Shop } from '@data/webedit/shop/types';

export const initShop = {
  openHours: {
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: '',
    sun: '',
  },
} as Partial<Shop>;

export const shopZ = z.object({
  name: reqString('Name'),
  address: reqString('Address'),

  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imageUrl: z.string().nullable().optional(),
  openHours: z
    .object({
      mon: z.string().optional(),
      tue: z.string().optional(),
      wed: z.string().optional(),
      thu: z.string().optional(),
      fri: z.string().optional(),
      sat: z.string().optional(),
      sun: z.string().optional(),
    })
    .optional(),
  hasTemporaryHours: z.boolean().optional(),
  locationId: z.number().optional(),
  bodyText: z.string().optional(),
});
