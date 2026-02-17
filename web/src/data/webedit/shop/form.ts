import { z } from 'zod';
import { reqString } from '../../form';
import { Shop } from './types';
import { Global, WebEditLang } from '@data/webedit/types';

const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

const timeSchema = z
  .string()
  .optional()
  .nullable()
  .refine((val) => !val || timeRegex.test(val), {
    message: 'Format must be H:MM (e.g. 8:00 or 17:30)',
  });

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
          mon: timeSchema,
          tue: timeSchema,
          wed: timeSchema,
          thu: timeSchema,
          fri: timeSchema,
          sat: timeSchema,
          sun: timeSchema,
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
          (time) => time && typeof time === 'string' && time.trim().length > 0,
        );
        return hasAnyContent;
      },
      {
        message: 'You must provide opening hours or enable Temporary Hours.',
        path: ['openHours'],
      },
    );
