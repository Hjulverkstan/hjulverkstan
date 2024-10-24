import { CheckIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import {
  useDeleteTicketM,
  useUpdateTicketStatusM,
} from '@data/ticket/mutations';
import {
  Ticket,
  TicketAggregated,
  TicketStatus,
  TicketType,
  ticketTypeToTicketStatus,
} from '@data/ticket/types';
import * as enums from '@data/ticket/enums';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import { Vehicle } from '@data/vehicle/types';
import { createGetVehicle } from '@data/vehicle/api';
import { useQueries } from '@tanstack/react-query';
import UpdateVehicleStatusesDialog from '@components/UpdateVehicleStatusesDialog';

export default function ShopTicketsActions({
  row: ticket,
  disabled,
}: PortalTableActionsProps<TicketAggregated>) {
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const deleteTicketM = useDeleteTicketM();
  const updateTicketStatusM = useUpdateTicketStatusM();

  // Fetch vehicles associated with the ticket
  const vehicleQueries = useQueries({
    queries: ticket.vehicleIds.map((id) => {
      const getVehicleQuery = createGetVehicle({ id });
      return {
        queryKey: getVehicleQuery.queryKey,
        queryFn: getVehicleQuery.queryFn,
      };
    }),
  });

  const vehicles = vehicleQueries
    .map((query) => query.data)
    .filter((data): data is Vehicle => data !== undefined); // Type guard

  const onDelete = () => {
    deleteTicketM.mutate(ticket.id, {
      onSuccess: (res: Ticket) => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'ticket',
            id: res.id,
          }),
        );
      },
      onError: () => {
        toast(createErrorToast({ verbLabel: 'delete', dataLabel: 'ticket' }));
      },
    });
  };

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        entity={ticket.ticketType}
        entityId={ticket.id}
      />,
    );
  };

  const onStatusUpdate = (newStatus: TicketStatus) => {
    updateTicketStatusM.mutate(
      { id: ticket.id, ticketStatus: newStatus },
      {
        onSuccess: (res) => {
          toast(
            createSuccessToast({
              verbLabel: 'update status on',
              dataLabel: 'ticket',
              id: res.id,
            }),
          );
          const notCustomerOwnedVehicles = vehicles.filter(
            (vehicle) => !vehicle.isCustomerOwned,
          );

          if (
            res.ticketStatus === TicketStatus.CLOSED &&
            (ticket.ticketType === TicketType.RENT ||
              ticket.ticketType === TicketType.REPAIR) &&
            notCustomerOwnedVehicles.length > 0
          ) {
            openDialog(
              <UpdateVehicleStatusesDialog
                vehicles={notCustomerOwnedVehicles}
              />,
            );
          }
        },
        onError: () => {
          toast(
            createErrorToast({
              verbLabel: 'update status on',
              dataLabel: 'ticket',
            }),
          );
        },
      },
    );
  };

  const allowedStatuses = ticketTypeToTicketStatus(ticket.ticketType);

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

        {allowedStatuses?.length && (
          <DropdownMenu.Sub>
            <DropdownMenu.Separator />
            <DropdownMenu.SubTrigger>Status</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {allowedStatuses.map((ticketStatus) => (
                <DropdownMenu.Item
                  key={ticketStatus}
                  onSelect={() => onStatusUpdate(ticketStatus)}
                  disabled={ticketStatus === ticket.ticketStatus}
                >
                  {enums.find(ticketStatus).label}
                  {ticketStatus === ticket.ticketStatus && (
                    <span className="ml-auto">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
