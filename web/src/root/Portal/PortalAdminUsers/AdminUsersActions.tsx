import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { useDeleteUserM } from '@data/user/mutations';
import { User } from '@data/user/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

export default function AdminUsersActions({
  row: user,
  disabled,
}: PortalTableActionsProps<User>) {
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const deleteUserM = useDeleteUserM();

  const onDelete = () => {
    deleteUserM.mutate(user.id, {
      onSuccess: (res: User) => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'user',
            id: res.username,
          }),
        );
      },
      onError: () => {
        toast(createErrorToast({ verbLabel: 'delete', dataLabel: 'user' }));
      },
    });
  };

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        entity="user"
        entityId={user.username}
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
