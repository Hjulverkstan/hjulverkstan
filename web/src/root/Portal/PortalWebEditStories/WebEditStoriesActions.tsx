import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Story } from '@data/webedit/story/types';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';
import { useSoftDeleteStoryM } from '@data/webedit/story/mutations';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import { usePortalWebEditLang } from '../PortalWebEditLang';
import { fallbackLang } from '@root';
import ConfirmDeleteDialog from '@components/ConfirmSoftDeleteDialog';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function WebEditStoriesActions({
  row: story,
  disabled,
}: PortalTableActionsProps<Story>) {
  const lang = usePortalWebEditLang();
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const deleteStoryM = useSoftDeleteStoryM();

  const notFallbacktLang = lang !== fallbackLang;

  const onDelete = () => {
    deleteStoryM.mutate(
      { id: story.id, lang },
      {
        onSuccess: () => {
          toast(
            createSuccessToast({
              verbLabel: 'delete',
              id: story.id,
              dataLabel:
                lang == fallbackLang ? 'Story' : 'translation of Story',
            }),
          );
        },
        onError: () => {
          toast(
            createErrorToast({
              verbLabel: 'delete',
              dataLabel:
                lang == fallbackLang ? 'Story' : 'translation of Story',
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
        entity={lang == fallbackLang ? 'Story' : 'translation of story'}
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
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger className="w-full">
              <DropdownMenu.Item
                onClick={(e) => e.stopPropagation()}
                onSelect={handleDeleteClick}
                disabled={notFallbacktLang}
              >
                Delete
                <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            {notFallbacktLang && (
              <Tooltip.Content className="rounded-sm bg-primary p-2 text-white">
                Delete requires Swedish
              </Tooltip.Content>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
