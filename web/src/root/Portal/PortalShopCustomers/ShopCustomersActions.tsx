import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { useDeleteCustomerM } from '@data/customer/mutations';
import { Customer } from '@data/customer/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

export default function ShopCustomersActions({
  row: customer,
  disabled,
}: PortalTableActionsProps<Customer>) {
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const deleteCustomerM = useDeleteCustomerM();

  const onDelete = () => {
    deleteCustomerM.mutate(customer.id, {
      onSuccess: (res: Customer) => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'customer',
            id: res.organizationName ?? `${res.firstName} ${res.lastName}`,
          }),
        );
      },
      onError: () => {
        toast(createErrorToast({ verbLabel: 'delete', dataLabel: 'customer' }));
      },
    });
  };

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        entity={customer.customerType}
        entityId={customer.id}
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
