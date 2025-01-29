import { z } from 'zod';
import { reqString } from '@data/form';

export const initGeneralContent = {} as Partial<{
  value: string;
}>;

export const generalContentZ = z.object({
  value: reqString('Value'),
});
