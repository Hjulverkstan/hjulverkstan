import { z } from 'zod';
import { GeneralContent } from '@data/webedit/general/types';

export const initGeneralContent = {} as Partial<GeneralContent>;

export const generalContentSchema = z.object({
  value: z.string().nonempty({ message: 'Value är obligatoriskt' }),
});
