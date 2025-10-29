import { JSONContent } from '@tiptap/core';

import { Auditable } from '../../types';

export interface Story extends Auditable {
  id: string;
  slug: string;
  title: string;
  bodyText: JSONContent;
  imageURL: string;
}
