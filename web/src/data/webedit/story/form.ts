import { z } from 'zod';

import { reqString } from '../../form';
import { Story } from './types';

export const initStory: Partial<Story> = {};

export const shopZ = z.object({
  title: reqString('Title'),
  slug: reqString('Slug (web url)'),
  bodyText: reqString('Body text'),
  imageURL: z.string().optional(),
});
