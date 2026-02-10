import { z } from 'zod';

import { reqString } from '../../form';
import { Shop } from './types';
import { Global, WebEditLang } from '@data/webedit/types';

export const initShop: Partial<Shop> = {
  hasTemporaryHours: false,
  openHours: {},
};

export const createShopZ = (lang: WebEditLang) =>
  z
    .object({
      name: reqString('Name'),
      slug: z.string().optional(),
      address: reqString('Address'),
      locationId: z.coerce.number(),

      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
      imageURL: z.string().optional().nullable(),
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
        .optional()
        .nullable(),
      hasTemporaryHours: z.boolean().optional(),

      ...(lang == Global
        ? {
            bodyText: z.record(z.any()).optional().nullable(),
          }
        : {}),
    })
    .refine(
      (data) => {
        if (data.hasTemporaryHours) {
          return true;
        }

        const hours = data.openHours;
        if (!hours) return false;

        const hasAnyContent = Object.values(hours).some(
          (time) => time && time.trim().length > 0,
        );
        return hasAnyContent;
      },
      {
        message: 'You must provide opening hours or enable Temporary Hours.',
        path: ['openHours'],
      },
    );
