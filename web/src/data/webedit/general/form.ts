import { z } from 'zod';

export const initGeneralContent = {} as Partial<{
  value: string;
  imageURL: '';
}>;

export const generalContentZ = z.object({
  value: z.string().optional(),
  imageURL: z.string().optional().nullable(),
});
