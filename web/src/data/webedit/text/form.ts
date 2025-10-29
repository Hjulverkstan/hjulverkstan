import { z } from 'zod';
import { Global, LocaleAndGlobal } from '@data/webedit/types';

export const createTextZ = (locale: LocaleAndGlobal) =>
  z.object({
    ...(locale != Global ? { value: z.string().optional() } : {}),
  });
