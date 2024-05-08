import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { useDeleteEmployeeM } from '@data/employee/mutations';
import { Employee } from '@data/employee/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

export default function AdminEmployeesActions({
  row: employee,
  disabled,
}: PortalTableActionsProps<Employee>) {
  const deleteEmployeeM = useDeleteEmployeeM();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onDelete = () => {
    deleteEmployeeM.mutate(employee.id, {
      onSuccess: (res: Employee) => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'employee',
            id: `${res.firstName} ${res.lastName}`,
          }),
        );
      },
      onError: () => {
        toast(createErrorToast({ verbLabel: 'delete', dataLabel: 'employee' }));
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
            entity="employee"
            entityId={`${employee.firstName} ${employee.lastName}`}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog>
  );
}
