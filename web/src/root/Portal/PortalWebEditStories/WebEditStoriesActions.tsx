import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Story } from '@data/webedit/story/types';
import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';
import { useDeleteStoryM } from '@data/webedit/story/mutations';
import { Global } from '@data/webedit/types';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import { usePortalWebEditLang } from '../PortalWebEditLang';

export default function WebEditStoriesActions({
  row: story,
  disabled,
}: PortalTableActionsProps<Story>) {
  const lang = usePortalWebEditLang();
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const deleteStoryM = useDeleteStoryM();

  const onDelete = () => {
    deleteStoryM.mutate(
      { id: story.id, lang },
      {
        onSuccess: () => {
          toast(
            createSuccessToast({
              verbLabel: 'delete',
              id: story.id,
              dataLabel: lang == Global ? 'Story' : 'translation of Story',
            }),
          );
        },
        onError: () => {
          toast(
            createErrorToast({
              verbLabel: 'delete',
              dataLabel: lang == Global ? 'Story' : 'translation of Story',
            }),
          );
        },
      },
    );
  };

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        entity={
          lang == Global
            ? 'Story and all its translations'
            : 'translation of story'
        }
        entityId={story.slug}
      />,
    );
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <IconButton
          disabled={disabled}
          variant="ghost"
          icon={DotsHorizontalIcon}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-max-[250px]">
        <DropdownMenu.Item
          onClick={(e) => e.stopPropagation()}
          onSelect={() => handleDeleteClick()}
          disabled={lang !== Global && story.bodyText == null}
        >
          Delete {lang !== Global && 'translation'}
          <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
