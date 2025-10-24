import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Write something</p>',
  });

  return (
    editor && (
      <>
        <EditorContent editor={editor} />
        <button onClick={() => console.log(editor.getJSON())}>Generate</button>
      </>
    )
  );
}
