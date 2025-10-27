import { useEffect, useReducer } from 'react';

export const useEditorRerender = (editor: any) => {
  const [, force] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!editor) return;
    const rerender = () => force();

    editor.on('selectionUpdate', rerender);
    editor.on('transaction', rerender);
    editor.on('update', rerender);

    return () => {
      editor.off('selectionUpdate', rerender);
      editor.off('transaction', rerender);
      editor.off('update', rerender);
    };
  }, [editor]);
};
