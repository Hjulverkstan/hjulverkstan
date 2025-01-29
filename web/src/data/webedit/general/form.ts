import { z } from 'zod';

export const generalContentSchema = z.object({
  value: z.string().nonempty({ message: 'Value är obligatoriskt' }),
});
