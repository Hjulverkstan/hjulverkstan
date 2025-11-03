import { z } from 'zod';
import { Global, WebEditLang } from '@data/webedit/types';

export const createTextZ = (lang: WebEditLang) =>
  z.object({
    ...(lang != Global ? { value: z.string().optional() } : {}),
  });
