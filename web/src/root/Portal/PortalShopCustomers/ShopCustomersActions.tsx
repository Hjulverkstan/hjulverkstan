import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import {
  useArchiveCustomerM,
  useDeleteCustomerM,
} from '@data/customer/mutations';
import { Customer } from '@data/customer/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import ConfirmArchiveDialog from '@components/ConfirmArchvieDialog';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function ShopCustomersActions({
  row: customer,
  disabled,
}: PortalTableActionsProps<Customer>) {
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const hasTickets = !!customer.ticketIds.length;
  const isAnonymous = customer.anonymized;

  const deleteCustomerM = useDeleteCustomerM();
  const archiveCustomerM = useArchiveCustomerM();

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

  const onArchive = () => {
    archiveCustomerM.mutate(customer.id, {
      onSuccess: (res: Customer) => {
        toast(
          createSuccessToast({
            verbLabel: 'archive',
            dataLabel: 'customer',
            id: res.organizationName ?? `${res.firstName} ${res.lastName}`,
          }),
        );
      },
      onError: () => {
        toast(
          createErrorToast({ verbLabel: 'archive', dataLabel: 'customer' }),
        );
      },
    });
  };

  const handleArchiveClick = () => {
    openDialog(
      <ConfirmArchiveDialog
        onArchive={onArchive}
        entity={customer.customerType}
        entityId={customer.id}
      />,
    );
  };

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        onArchive={onArchive}
        entity={customer.customerType}
        entityId={customer.id}
        disable={hasTickets}
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
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger className="w-full">
              <DropdownMenu.Item
                onClick={(e) => e.stopPropagation()}
                onSelect={handleArchiveClick}
                disabled={hasTickets}
              >
                Archive
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            {hasTickets && (
              <Tooltip.Content className="bg-primary rounded-sm p-2 text-white">
                Archive ticket first.
              </Tooltip.Content>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
        <DropdownMenu.Item
          onClick={(e) => e.stopPropagation()}
          onSelect={() => handleDeleteClick()}
          disabled={isAnonymous}
        >
          Delete
          <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
