import { z } from 'zod';

export const createTextZ = () =>
  z.object({
    value: z.string(),
  });
