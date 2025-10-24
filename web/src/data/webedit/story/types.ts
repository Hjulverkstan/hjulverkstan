import { JSONContent } from '@tiptap/core';

export interface Story {
  id: string;
  slug: string;
  title: string;
  bodyText: JSONContent;
  imageURL: string;
}
