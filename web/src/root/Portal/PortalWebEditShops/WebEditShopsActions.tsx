import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Shop } from '@data/webedit/shop/types';
import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';
import {
  useDeleteShopM,
  useSoftDeleteShopM,
} from '@data/webedit/shop/mutations';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import { usePortalWebEditLang } from '../PortalWebEditLang';
import { fallbackLang } from '@root';
import ConfirmArchiveDialog from '@components/ConfirmArchvieDialog';

export default function WebEditShopsActions({
  row: shop,
  disabled,
}: PortalTableActionsProps<Shop>) {
  const lang = usePortalWebEditLang();
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const archiveShopM = useSoftDeleteShopM();
  const deleteShopM = useDeleteShopM();

  const onArchive = () => {
    archiveShopM.mutate(
      { id: shop.id, lang },
      {
        onSuccess: () => {
          toast(
            createSuccessToast({
              verbLabel: 'archive',
              id: shop.id,
              dataLabel: lang == fallbackLang ? 'Shop' : 'translation of Shop',
            }),
          );
        },
        onError: () => {
          toast(
            createErrorToast({
              verbLabel: 'archive',
              dataLabel: lang == fallbackLang ? 'Shop' : 'translation of Shop',
            }),
          );
        },
      },
    );
  };

  const onDelete = () => {
    deleteShopM.mutate(
      { id: shop.id, lang },
      {
        onSuccess: () => {
          toast(
            createSuccessToast({
              verbLabel: 'delete',
              id: shop.id,
              dataLabel: lang == fallbackLang ? 'Shop' : 'translation of Shop',
            }),
          );
        },
        onError: () => {
          toast(
            createErrorToast({
              verbLabel: 'delete',
              dataLabel: lang == fallbackLang ? 'Shop' : 'translation of Shop',
            }),
          );
        },
      },
    );
  };

  const handleArchiveClick = () => {
    openDialog(
      <ConfirmArchiveDialog
        onArchive={onArchive}
        entity={lang == fallbackLang ? 'Shop' : 'translation of shop'}
        entityId={shop.name}
      />,
    );
  };

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        onArchive={onArchive}
        entity={lang == fallbackLang ? 'Shop' : 'translation of shop'}
        entityId={shop.name}
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
          onSelect={() => handleArchiveClick()}
        >
          Archive {lang !== fallbackLang && 'translation'}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={(e) => e.stopPropagation()}
          onSelect={() => handleDeleteClick()}
        >
          Delete {lang !== fallbackLang && 'translation'}
          <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
