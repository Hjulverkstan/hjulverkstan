import { z } from 'zod';
import { GeneralContent } from './types';

export const generalContentZ = z.object({
  value: z.string().optional(),
  imageURL: z.string().optional(),
});

export const initGeneralContent = {} as Partial<GeneralContent>;
