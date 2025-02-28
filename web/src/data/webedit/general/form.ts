import { z } from 'zod';

export const initGeneralContent = {} as Partial<{
  value: string;
  imageUrl: '';
}>;

export const generalContentZ = z.object({
  value: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
});
