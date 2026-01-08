import { FC, useMemo } from 'react';
import { type JSONContent, type Extension, generateText } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

import * as C from '@utils/common';

interface TiptapContentAsTextProps {
  content: JSONContent | null | undefined;
  extensions?: Extension[];
  max?: number;
  blockSeparator?: string;
}

export const TiptapContentAsText: FC<TiptapContentAsTextProps> = ({
  content,
  extensions = [StarterKit],
  max,
  blockSeparator = ' ',
}) =>
  useMemo(() => {
    if (!content) return ''

    const text = generateText(content, extensions, { blockSeparator })
      .replace(/\s+/g, ' ')
      .trim()

    return max ? C.truncate(text, max) : text
  }, [content, extensions, max, blockSeparator])