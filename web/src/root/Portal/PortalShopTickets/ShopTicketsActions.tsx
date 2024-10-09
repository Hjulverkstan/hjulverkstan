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
  ticketTypeToTicketStatus,
} from '@data/ticket/types';
import * as enums from '@data/ticket/enums';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

export default function ShopTicketsActions({
  row: ticket,
  disabled,
}: PortalTableActionsProps<TicketAggregated>) {
  const deleteTicketM = useDeleteTicketM();
  const updateTicketStatusM = useUpdateTicketStatusM();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

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

  const onStatusUpdate = (newStatus: TicketStatus) => {
    updateTicketStatusM.mutate(
      { id: ticket.id, ticketStatus: newStatus },
      {
        onSuccess: (res: Ticket) => {
          toast(
            createSuccessToast({
              verbLabel: 'update status on',
              dataLabel: 'ticket',
              id: res.id,
            }),
          );
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
            entity={ticket.ticketType}
            entityId={ticket.id}
          />

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
    </Dialog>
  );
}
