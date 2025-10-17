import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Write something</p>',
  });

  function handleClick() {
    const json = JSON.stringify(editor.getJSON());
    console.log(json);
  }

  return (
    <>
      {editor && (
        <>
          <EditorContent editor={editor} />
          <button onClick={handleClick}>Generate</button>
        </>
      )}
    </>
  );
}
