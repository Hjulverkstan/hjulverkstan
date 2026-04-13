import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import {
  useDeleteEmployeeM,
  useSoftDeleteEmployeeM,
} from '@data/employee/mutations';
import { Employee } from '@data/employee/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import * as Tooltip from '@radix-ui/react-tooltip';
import ConfirmArchiveDialog from '@components/ConfirmArchvieDialog';

export default function AdminEmployeesActions({
  row: employee,
  disabled,
}: PortalTableActionsProps<Employee>) {
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const hasTickets = !!employee.ticketIds.length;
  const [open, setOpen] = useState(false);

  const archiveEmployeeM = useSoftDeleteEmployeeM();
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

  const onArchive = () => {
    archiveEmployeeM.mutate(employee.id, {
      onSuccess: (res: Employee) => {
        toast(
          createSuccessToast({
            verbLabel: 'archive',
            dataLabel: 'employee',
            id: `${res.firstName} ${res.lastName}`,
          }),
        );
      },
      onError: () => {
        toast(
          createErrorToast({ verbLabel: 'archive', dataLabel: 'employee' }),
        );
      },
    });
  };

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        onArchive={onArchive}
        entity="employee"
        entityId={`${employee.firstName} ${employee.lastName}`}
      />,
    );
  };

  const handleArchiveClick = () => {
    openDialog(
      <ConfirmArchiveDialog
        onArchive={onArchive}
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
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger className="w-full">
              <DropdownMenu.Item
                onClick={(e) => e.stopPropagation()}
                onSelect={() => handleArchiveClick()}
                disabled={hasTickets}
              >
                Archive
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            {hasTickets && (
              <Tooltip.Content className="bg-primary text-white">
                Cannot archive employees with tickets.
              </Tooltip.Content>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger className="w-full">
              <DropdownMenu.Item
                onClick={(e) => e.stopPropagation()}
                onSelect={() => handleDeleteClick()}
                disabled={hasTickets}
              >
                Delete
                <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            {hasTickets && (
              <Tooltip.Content className="bg-primary text-white">
                Cannot delete employees with tickets.
              </Tooltip.Content>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
