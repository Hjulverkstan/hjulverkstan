import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import {
  useSoftDeleteCustomerM,
  useHardDeleteCustomerM,
} from '@data/customer/mutations';
import { Customer } from '@data/customer/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function ShopCustomersActions({
  row: customer,
  disabled,
}: PortalTableActionsProps<Customer>) {
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const hasTickets = !!customer.ticketIds.length;

  const hardDeleteCustomerM = useHardDeleteCustomerM();
  const deleteCustomerM = useSoftDeleteCustomerM();

  const onHardDelete = () => {
    hardDeleteCustomerM.mutate(customer.id, {
      onSuccess: (res: Customer) => {
        toast(
          createSuccessToast({
            verbLabel: 'hard delete',
            dataLabel: 'customer',
            id: res.organizationName ?? `${res.firstName} ${res.lastName}`,
          }),
        );
      },
      onError: () => {
        toast(
          createErrorToast({ verbLabel: 'hard delete', dataLabel: 'customer' }),
        );
      },
    });
  };

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

  const handleHardDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onHardDelete={onHardDelete}
        onDelete={onDelete}
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
                onSelect={handleHardDeleteClick}
              >
                Delete
                <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
              </DropdownMenu.Item>
            </Tooltip.Trigger>
          </Tooltip.Root>
        </Tooltip.Provider>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
