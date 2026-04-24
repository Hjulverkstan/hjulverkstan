import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Shop } from '@data/webedit/shop/types';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';
import { useSoftDeleteShopM } from '@data/webedit/shop/mutations';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import { usePortalWebEditLang } from '../PortalWebEditLang';
import { fallbackLang } from '@root';
import ConfirmDeleteDialog from '@components/ConfirmSoftDeleteDialog';

export default function WebEditShopsActions({
  row: shop,
  disabled,
}: PortalTableActionsProps<Shop>) {
  const lang = usePortalWebEditLang();
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const deleteShopM = useSoftDeleteShopM();

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

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
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
          onSelect={() => handleDeleteClick()}
        >
          Delete
          <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
