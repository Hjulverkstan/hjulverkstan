import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useMemo } from 'react';

export interface TiptapConentProps {
  content?: string;
}

export const TiptapContent: React.FC<TiptapConentProps> = ({ content }) => {
  const html = useMemo(
    () => content && generateHTML(JSON.parse(content), [StarterKit]),
    [content],
  );
  /*

    let contentParsed: string | undefined = undefined;

  try {
    contentParsed = content && JSON.parse(content);
  } catch (e) {
    console.warn("Failed to parse content: " + content + ", error: " + e);
  }

  const editor = useEditor({
      extensions: [StarterKit],
      content: contentParsed,
    });

*/

  return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null;
};
