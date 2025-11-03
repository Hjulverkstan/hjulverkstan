import { z } from 'zod';

import { reqString } from '../../form';
import { Story } from './types';
import { Global, WebEditLang } from '@data/webedit/types';

export const initStory: Partial<Story> = {};

export const createStoryZ = (lang: WebEditLang) =>
  z.object({
    title: reqString('Title'),
    slug: reqString('Slug (web url)'),
    imageURL: z.string().optional(),

    ...(lang == Global
      ? {
          bodyText: z.record(z.any()).optional().nullable(),
        }
      : {}),
  });
