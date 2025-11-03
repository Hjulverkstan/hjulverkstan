import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Text } from '@data/webedit/text/types';
import * as rawEnums from '@data/webedit/text/enums';
import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';
import { useDeleteTextM } from '@data/webedit/text/mutations';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { Global } from '@data/webedit/types';
import { findEnum } from '@utils/enums';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import { usePortalWebEditLang } from '../PortalWebEditLang';

export default function WebEditTextActions({
  row: text,
  disabled,
}: PortalTableActionsProps<Text>) {
  const lang = usePortalWebEditLang();
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const enums = useTranslateRawEnums(rawEnums);
  const deleteTextM = useDeleteTextM();

  const [open, setOpen] = useState(false);

  const onDelete = () => {
    deleteTextM.mutate(
      { id: text.id, lang },
      {
        onSuccess: () => {
          toast(
            createSuccessToast({
              verbLabel: 'delete',
              dataLabel: 'translation of text',
              id: findEnum(enums, text.key).label,
            }),
          );
        },
        onError: () => {
          toast(
            createErrorToast({
              verbLabel: 'delete',
              dataLabel: 'translation of text',
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
        entity="translation of text"
        entityId={findEnum(enums, text.key).label}
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
          disabled={lang === Global || !text.value}
        >
          Delete {lang !== Global && 'translation'}
          <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
