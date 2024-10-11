import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { useDeleteEmployeeM } from '@data/employee/mutations';
import { Employee } from '@data/employee/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

export default function AdminEmployeesActions({
  row: employee,
  disabled,
}: PortalTableActionsProps<Employee>) {
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const deleteEmployeeM = useDeleteEmployeeM();

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

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        entity="employee"
        entityId={`${employee.firstName} ${employee.lastName}`}
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
