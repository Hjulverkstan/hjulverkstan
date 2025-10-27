import { useMemo } from 'react';
import { JSONContent } from '@tiptap/core';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@utils/common';

export interface TiptapConentProps {
  content?: JSONContent;
  className?: string;
}

export const TiptapContent: React.FC<TiptapConentProps> = ({
  content,
  className,
}) => {
  const html = useMemo(
    () => content && generateHTML(content, [StarterKit]),
    [content],
  );

  return html ? (
    <div
      className={cn('tiptap-custom max-w-[840px] space-y-7', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : null;
};
