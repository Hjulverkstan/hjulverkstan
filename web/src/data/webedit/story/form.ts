import { z } from 'zod';

import { reqString } from '../../form';
import { Story } from './types';

export const initStory: Partial<Story> = {};

export const createStoryZ = () =>
  z.object({
    title: reqString('Title'),
    slug: reqString('Slug (web url)'),
    imageURL: z.string().optional(),
    bodyText: z.record(z.any()),
  });
