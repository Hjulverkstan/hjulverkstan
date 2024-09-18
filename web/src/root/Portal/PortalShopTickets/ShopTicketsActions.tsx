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
} from '@data/ticket/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

const STATUS_OPTIONS_BY_TICKET_TYPE = {
  [TicketType.RENT]: [
    { label: 'Ready', value: TicketStatus.READY },
    { label: 'In Progress', value: TicketStatus.IN_PROGRESS },
    { label: 'Closed', value: TicketStatus.CLOSED },
  ],
  [TicketType.REPAIR]: [
    { label: 'Ready', value: TicketStatus.READY },
    { label: 'In Progress', value: TicketStatus.IN_PROGRESS },
    { label: 'Complete', value: TicketStatus.COMPLETE },
    { label: 'Closed', value: TicketStatus.CLOSED },
  ],
  [TicketType.DONATE]: [],
};

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

  const allowedStatuses =
    STATUS_OPTIONS_BY_TICKET_TYPE[ticket.ticketType] || [];

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

          {allowedStatuses.length > 0 && (
            <DropdownMenu.Sub>
              <DropdownMenu.Separator />
              <DropdownMenu.SubTrigger>Status</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {allowedStatuses.map(({ label, value }) => (
                  <DropdownMenu.Item
                    key={value}
                    onSelect={() => {
                      if (value !== ticket.ticketStatus) {
                        onStatusUpdate(value);
                      }
                    }}
                    disabled={value === ticket.ticketStatus}
                  >
                    {label}
                    {value === ticket.ticketStatus && (
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
