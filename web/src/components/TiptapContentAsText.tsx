import { FC, useMemo } from 'react';
import { Editor, type JSONContent, type Extension } from '@tiptap/core';
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
    if (!content) return '';

    const editor = new Editor({ content, extensions });
    const text = editor.getText({ blockSeparator }).replace(/\s+/g, ' ').trim();
    editor.destroy();

    return max ? C.truncate(text, max) : text;
  }, [content, extensions, max, blockSeparator]);
