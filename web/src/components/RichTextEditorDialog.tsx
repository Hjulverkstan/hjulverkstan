import {
  Bold,
  Check,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pencil,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from 'lucide-react';
import { ChainedCommands, Editor, JSONContent } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button, IconButton } from '@components/shadcn/Button';
import { useEditorRerender } from '@hooks/useEditorRerender';
import { MouseEvent } from 'react';
import usePortalSlugs from '@hooks/useSlugs';
import { useNavigate } from 'react-router-dom';

interface RichTextEditorDialogProps {
  content: JSONContent;
  onSubmit: (content: JSONContent | null) => void;
}

export default function RichTextEditorDialog({
  content,
  onSubmit,
}: RichTextEditorDialogProps) {
  const navigate = useNavigate();

  // TODO: Replace with context instead.
  const { tailSlug, url } = usePortalSlugs();
  const editable = /create|edit/.test(tailSlug ?? '');

  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[240px] prose prose-sm p-4',
      },
    },
    editable, // TODO: Replace with mode over context
    content,
  });

  useEditorRerender(editor);

  return (
    <DialogContent
      hideCross
      className="flex max-h-[80vh] flex-col sm:max-w-[800px]"
    >
      <DialogTitle className="hidden">Rich Text Editor</DialogTitle>
      <DialogDescription className="hidden">
        Using the toolbar and text box bellow you may edit the text content with
        full support of rich text
      </DialogDescription>
      <DialogHeader>
        <div className="flex items-center gap-2">
          {editable ? (
            <RichTextEditorActions editor={editor} />
          ) : (
            <IconButton
              icon={Pencil}
              text="Edit"
              className="ml-auto"
              onClick={() => navigate(url + '/edit')}
            />
          )}
        </div>
      </DialogHeader>
      <div className="bg-muted flex-1 overflow-y-auto rounded border">
        <EditorContent editor={editor} />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogClose>
        {editable && (
          <DialogClose asChild>
            <IconButton
              variant="contrast"
              type="submit"
              onClick={() =>
                onSubmit(
                  editor.getText({ blockSeparator: '' }).trim().length > 0
                    ? editor.getJSON()
                    : null,
                )
              }
              icon={Check}
              text="Done"
            />
          </DialogClose>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

export const RichTextEditorActions = ({ editor }: { editor: Editor }) => {
  const createHandler =
    (handle: (chain: ChainedCommands) => ChainedCommands) =>
    (e: MouseEvent) => {
      e.preventDefault();
      handle(editor?.chain().focus()).run();
    };

  return (
    <>
      <IconButton
        tooltip="Bold"
        variant={editor?.isActive('bold') ? 'contrast' : 'outline'}
        onClick={createHandler((c) => c.toggleBold())}
        disabled={!editor.can().toggleBold()}
        icon={Bold}
      />
      <IconButton
        tooltip="Italic"
        variant={editor?.isActive('italic') ? 'contrast' : 'outline'}
        onClick={createHandler((c) => c.toggleItalic())}
        disabled={!editor.can().toggleItalic()}
        icon={Italic}
      />
      <IconButton
        tooltip="Strike"
        variant={editor?.isActive('strike') ? 'contrast' : 'outline'}
        onClick={createHandler((c) => c.toggleStrike())}
        disabled={!editor.can().toggleStrike()}
        icon={Strikethrough}
      />
      <div className="bg-border mx-1 h-6 w-px" />
      <IconButton
        tooltip="Heading"
        variant={
          editor?.isActive('heading', { level: 2 }) ? 'contrast' : 'outline'
        }
        onClick={createHandler((c) => c.toggleHeading({ level: 2 }))}
        disabled={!editor.can().toggleHeading({ level: 2 })}
        icon={Heading2}
      />
      <IconButton
        tooltip="Sub-heading"
        variant={
          editor?.isActive('heading', { level: 3 }) ? 'contrast' : 'outline'
        }
        onClick={createHandler((c) => c.toggleHeading({ level: 3 }))}
        disabled={!editor.can().toggleHeading({ level: 3 })}
        icon={Heading3}
      />
      <div className="bg-border mx-1 h-6 w-px" />
      <IconButton
        tooltip="Bullet list"
        variant={editor?.isActive('bulletList') ? 'contrast' : 'outline'}
        onClick={createHandler((c) => c.toggleBulletList())}
        disabled={!editor?.can().toggleBulletList()}
        icon={List}
      />
      <IconButton
        tooltip="Ordered list"
        variant={editor?.isActive('orderedList') ? 'contrast' : 'outline'}
        onClick={createHandler((c) => c.toggleOrderedList())}
        disabled={!editor?.can().toggleOrderedList()}
        icon={ListOrdered}
      />
      <IconButton
        tooltip="Quote"
        variant={editor?.isActive('blockquote') ? 'contrast' : 'outline'}
        onClick={createHandler((c) => c.toggleBlockquote())}
        disabled={!editor?.can().toggleBlockquote()}
        icon={Quote}
      />
      <div className="bg-border mx-1 h-6 w-px" />
      <IconButton
        variant="outline"
        tooltip="Undo"
        onClick={createHandler((c) => c.undo())}
        disabled={!editor?.can().undo()}
        icon={Undo2}
      />
      <IconButton
        variant="outline"
        tooltip="Redo"
        onClick={createHandler((c) => c.redo())}
        disabled={!editor?.can().redo()}
        icon={Redo2}
      />
    </>
  );
};
