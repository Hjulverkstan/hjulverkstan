import { z } from 'zod';
import { Shop } from './types';

/**
 * Regex for time intervals: H:MM - H:MM
 * Allows optional spaces around the hyphen.
 * Examples: "8:00-17:00", "08:30 - 18:00", "9:00 - 9:00"
 */
const timeRangeRegex =
  /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

// Schemat som kollar efter "par" (Opening - Closing)
const timeSchema = z
  .string()
  .optional()
  .nullable()
  .refine((val) => !val || timeRangeRegex.test(val), {
    message: 'Format must be H:MM (e.g. 8:00 or 17:00)',
  });

export const initShop: Partial<Shop> = {
  hasTemporaryHours: true,
  openHours: {},
};

export const createShopZ = () => {
  return z.object({
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
};
