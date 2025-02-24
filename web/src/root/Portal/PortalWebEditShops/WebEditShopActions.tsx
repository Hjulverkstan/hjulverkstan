import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDeleteShopM } from '@data/webedit/shop/mutations';
import { Shop } from '@data/webedit/shop/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

export default function WebEditShopActions({
  row: shop,
  disabled,
}: PortalTableActionsProps<Shop>) {
  const { openDialog } = useDialogManager();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const deleteShopM = useDeleteShopM();

  const onDelete = () => {
    deleteShopM.mutate(shop.id, {
      onSuccess: (res: Shop) => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'shop',
            id: res.name,
          }),
        );
      },
      onError: () => {
        toast(createErrorToast({ verbLabel: 'delete', dataLabel: 'shop' }));
      },
    });
  };

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        entity="shop"
        entityId={shop.name || shop.id}
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
      <DropdownMenu.Content align="end" className="w-[160px]">
        <DropdownMenu.Item onClick={handleDeleteClick}>
          Delete
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`./${shop.id}/edit`, { replace: true });
          }}
        >
          Edit
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
