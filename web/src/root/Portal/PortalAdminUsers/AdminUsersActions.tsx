import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { useDeleteUserM } from '@data/user/mutations';
import { User } from '@data/user/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

export default function AdminUsersActions({
  row: user,
  disabled,
}: PortalTableActionsProps<User>) {
  const deleteUserM = useDeleteUserM();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

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

  return (
    <Dialog>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <IconButton
            disabled={disabled}
            variant="ghost"
            icon={DotsHorizontalIcon}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" className="w-[160px]">
          <DialogTrigger asChild>
            <DropdownMenu.Item
              onClick={(e) => e.stopPropagation()}
              onSelect={(e) => e.preventDefault()}
            >
              Delete
              <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DialogTrigger>
          <ConfirmDeleteDialog
            onDelete={onDelete}
            onCancel={() => setOpen(false)}
            entity="user"
            entityId={user.username}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog>
  );
}
